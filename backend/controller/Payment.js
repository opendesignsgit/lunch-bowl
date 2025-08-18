const qs = require("querystring");
const ccav = require("../utils/ccavutil");
const mongoose = require("mongoose"); // Add this import for ObjectId validation
const Form = require("../models/Form");
const UserPayment = require("../models/Payment");
const nodemailer = require("nodemailer");
const { sendSMS } = require("../lib/sms-sender/smsService");
const SmsLog = require("../models/SmsLog");
const HolidayPayment = require("../models/HolidayPayment");

const workingKey =
  process.env.CCAV_WORKING_KEY || "2A561B005709D8B4BAF69D049B23546B"; // Use env vars in production

// Helper function to process payment response and save payment data
async function processPaymentResponse(responseData, paymentType) {
  const {
    order_id,
    tracking_id,
    order_status,
    merchant_param1,
    merchant_param2,
    amount,
    payment_mode,
    card_name,
    status_code,
    status_message,
    bank_ref_no,
    billing_name,
    billing_email,
  } = responseData;

  if (!merchant_param1 || !order_id) {
    throw new Error(
      "Invalid payment response: missing merchant_param1 (user) or order_id"
    );
  }

  if (!mongoose.Types.ObjectId.isValid(merchant_param1)) {
    throw new Error(`Invalid user ID (merchant_param1): ${merchant_param1}`);
  }

  // Build payment transaction object
  const paymentTransaction = {
    order_id,
    tracking_id,
    amount: parseFloat(amount || 0),
    order_status,
    payment_mode,
    card_name,
    status_code,
    status_message,
    bank_ref_no,
    billing_name,
    billing_email,
    payment_type: paymentType,
    merchant_param1,
    // Include holidayDate if holiday payment
    ...(paymentType === "holiday" && merchant_param2
      ? { holidayDate: merchant_param2 }
      : {}),
    ...responseData,
  };

  // Update or create user payment record
  const updatedPayment = await UserPayment.findOneAndUpdate(
    { user: merchant_param1 },
    {
      $push: { payments: paymentTransaction },
      $inc: { total_amount: parseFloat(amount || 0) },
      $setOnInsert: { created_at: new Date() },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  return { order_status, merchant_param1, order_id, tracking_id };
}

// Subscription Payment Response Handler
exports.ccavenueResponse = async (req, res) => {
  let encResponse = "";
  req.on("data", (data) => {
    encResponse += data;
  });

  req.on("end", async () => {
    try {
      const parsed = qs.parse(encResponse);
      const encrypted = parsed.encResp;

      if (!encrypted) {
        return res.status(400).send("Missing encrypted response");
      }

      const decrypted = ccav.decrypt(encrypted, workingKey);
      const responseData = qs.parse(decrypted);

      console.log("Subscription payment decrypted response:", responseData);

      const { order_status, merchant_param1, order_id, tracking_id } =
        await processPaymentResponse(responseData, "subscription");

      if (order_status === "Success") {
        if (!mongoose.Types.ObjectId.isValid(merchant_param1)) {
          console.error(
            "Invalid user ID in subscription payment handler:",
            merchant_param1
          );
          return res.status(400).send("Invalid user ID");
        }

        const updatedForm = await Form.findOneAndUpdate(
          { user: merchant_param1 },
          {
            $set: {
              paymentStatus: order_status,
              "subscriptionPlan.orderId": order_id,
              "subscriptionPlan.transactionId": tracking_id || "N/A",
              "subscriptionPlan.paymentDate": new Date(),
              step: 4,
            },
            $inc: {
              subscriptionCount: 1,
            },
          },
          { new: true }
        );

        console.log("Subscription payment updated form:", updatedForm);

        // Send Registration + Payment Success Mail
        if (updatedForm) {
          // Extract details for mail
          const parentName = `${updatedForm.parentDetails.fatherFirstName} ${updatedForm.parentDetails.fatherLastName}`;
          const amount = updatedForm.subscriptionPlan.price;
          const startDate = updatedForm.subscriptionPlan.startDate
            ? new Date(
                updatedForm.subscriptionPlan.startDate
              ).toLocaleDateString("en-IN")
            : "";
          const schoolName = updatedForm.children?.[0]?.school || "";
          const childName = updatedForm.children?.[0]
            ? `${updatedForm.children[0].childFirstName} ${updatedForm.children[0].childLastName}`
            : "";
          const email = updatedForm.parentDetails.email;

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Registration & Payment Successful – Welcome Aboard!",
            html: `
              <p>Hi ${parentName},</p>
              <p>Your Lunch Bowl registration is complete, and we've received your payment of ₹${amount}.</p>
              <p>🎒 Meal service starts on: ${startDate}</p>
              <p>📍 School: ${schoolName}</p>
              <p>👦 Child: ${childName}</p>
              <p>We’re thrilled to be part of your child’s lunch journey!</p>
              <p>For any help, reach out to <a href="mailto:support@lunchbowl.in">support@lunchbowl.in</a></p>
              <p>– Earth Tech Concepts Pvt Ltd</p>
            `,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error("Payment Success Mail Error:", err);
            }
          });

          // Send Payment Confirmation SMS
          const parentPhone = updatedForm.parentDetails.mobile;
          if (parentPhone) {
            try {
              const smsResult = await sendSMS(parentPhone, 'PAYMENT_CONFIRMATION', [amount]);
              
              // Log SMS
              const smsLog = new SmsLog({
                mobile: parentPhone,
                messageType: 'PAYMENT_CONFIRMATION',
                message: smsResult.message || '',
                templateId: smsResult.templateId || '',
                messageId: smsResult.messageId || '',
                status: smsResult.success ? 'sent' : 'failed',
                error: smsResult.error || undefined,
                customerId: merchant_param1,
                variables: [amount],
                sentAt: new Date()
              });
              
              await smsLog.save();
              console.log('Payment confirmation SMS sent to:', parentPhone);
            } catch (smsError) {
              console.error('Error sending payment confirmation SMS:', smsError);
              // Don't fail payment processing if SMS fails
            }
          }
        }

        return res.redirect("https://lunchbowl.co.in/user/menuCalendarPage");
      } else {
        return res.redirect("https://lunchbowl.co.in/payment/failed");
      }
    } catch (error) {
      console.error("CCAvenue subscription response error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

// Holiday Payment Response Handler - Handles Both JSON Array and Comma String Formats
exports.holiydayPayment = async (req, res) => {
  let encResponse = "";
  req.on("data", (data) => { encResponse += data; });

  req.on("end", async () => {
    try {
      // Parse the CCAVenue response
      const parsed = qs.parse(encResponse);
      const encrypted = parsed.encResp;
      if (!encrypted) {
        console.error("Missing encResp in payload:", encResponse);
        return res.status(400).send("Missing encrypted response");
      }

      let decrypted, responseData;
      try {
        decrypted = ccav.decrypt(encrypted, workingKey);
      } catch (decryptErr) {
        console.error("CCAVenue decrypt error:", decryptErr, "Input:", encrypted);
        return res.status(400).send("Failed to decrypt payment response");
      }

      try {
        responseData = qs.parse(decrypted);
      } catch (parseErr) {
        console.error("Failed to parse decrypted response:", decrypted, parseErr);
        return res.status(400).send("Malformed payment response data");
      }

      console.log("Holiday payment decrypted response:", responseData);

      const { order_status, merchant_param1: userId, merchant_param2: mealDate, merchant_param3, tracking_id } = responseData;

      // Validate IDs and date
      if (!userId) {
        console.error("userId missing from responseData:", responseData);
        return res.status(400).send("Missing user ID");
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error("userId is not a valid ObjectId:", userId);
        return res.status(400).send("Invalid user ID");
      }
      if (!mealDate || !/^\d{4}-\d{2}-\d{2}$/.test(mealDate)) {
        console.error("Invalid or missing mealDate:", mealDate);
        return res.status(400).send("Invalid mealDate (should be YYYY-MM-DD)");
      }

      // Flexible parser for merchant_param3
      let childrenData = [];
      try {
        if (merchant_param3 && merchant_param3.trim().startsWith("[")) {
          // JSON array
          childrenData = JSON.parse(merchant_param3);
          if (!Array.isArray(childrenData)) throw new Error("childrenData is not array");
        } else if (merchant_param3 && merchant_param3.includes("childId")) {
          // Comma string format: childId... , dish... , mealDate...
          const parts = merchant_param3.split(",");
          const childObj = {};
          for (const part of parts) {
            const clean = part.trim();
            if (clean.startsWith("childId")) childObj.childId = clean.replace("childId", "");
            if (clean.startsWith("dish")) childObj.dish = clean.replace("dish", "");
            if (clean.startsWith("mealDate")) childObj.mealDate = clean.replace("mealDate", "");
          }
          // If mealDate not present in string, fallback to POST param
          if (!childObj.mealDate && mealDate) childObj.mealDate = mealDate;
          childrenData.push(childObj);
        }
        // else: not present or empty, leave as []
      } catch (err) {
        console.error("Cannot parse merchant_param3 (childrenData):", merchant_param3, err);
        return res.status(400).send("Malformed childrenData in payment");
      }

      if (order_status === "Success") {
        // Validate every child before DB save!
        for (const [index, child] of childrenData.entries()) {
          if (!child || typeof child !== "object") {
            console.error(`Child ${index} entry is not object:`, child);
            continue; // Skip, or optionally throw
          }
          if (!child.childId || typeof child.childId !== "string") {
            console.error(`Child ${index}: Missing or invalid childId:`, child.childId);
            continue;
          }
          if (!child.dish || typeof child.dish !== "string") {
            console.error(`Child ${index}: Missing or invalid dish:`, child.dish);
            continue;
          }
          // If mealDate missing in child (for comma string), use response mealDate
          const finalMealDate = child.mealDate || mealDate;
          if (!finalMealDate) {
            console.error(`Child ${index}: Missing mealDate in child and root.`, child);
            continue;
          }

          try {
            await HolidayPayment.create({
              userId,
              childId: child.childId,
              mealDate: finalMealDate,
              mealName: child.dish,
              amount: 199,
              paymentStatus: "Paid",
              transactionDetails: { tracking_id, ...responseData },
            });
          } catch (dbErr) {
            console.error(`DB save error for child:`, child, dbErr);
            // Optionally: return res.status(500).send("Database save failed");
            // Or just skip the broken entry and process others
          }
        }
        return res.redirect("https://lunchbowl.co.in/payment/success");
      } else {
        return res.redirect("https://lunchbowl.co.in/payment/failed");
      }
    } catch (err) {
      console.error("CCAvenue holiday payment handler - Uncaught error:", err);
      res.status(500).send("Internal Server Error");
    }
  });
};



// POST Paid Holiday Data for a Specific Date and User (from request body)
exports.getHolidayPaymentsByDate = async (req, res) => {
  const { date, userId } = req.body;

  if (!date || !userId) {
    return res.status(400).json({ error: "date and userId are required in request body" });
  }

  try {
    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }
    // Validate userId is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const payments = await HolidayPayment.find({
      mealDate: date,
      userId: userId
    }).select("-__v -createdAt -updatedAt");

    // Null/empty check
    if (!payments || payments.length === 0) {
      return res.json([]); // return empty array instead of null/error
    }

    return res.json(payments);
  } catch (err) {
    console.error("Error fetching holiday payments:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};