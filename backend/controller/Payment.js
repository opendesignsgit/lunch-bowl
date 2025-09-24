const qs = require("querystring");
const ccav = require("../utils/ccavutil");
const mongoose = require("mongoose"); // Add this import for ObjectId validation
const Form = require("../models/Form");
const UserPayment = require("../models/Payment");
const nodemailer = require("nodemailer");
const { sendSMS } = require("../lib/sms-sender/smsService");
const SmsLog = require("../models/SmsLog");
const HolidayPayment = require("../models/HolidayPayment");
const UserMeal = require("../models/UserMeal");

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

        // Check payment type based on merchant_param2 or order_id
        const isRenewalPayment = responseData.merchant_param2?.includes("RENEWAL") || 
                                responseData.order_id?.includes("RENEWAL");
        const isAddChildrenPayment = responseData.merchant_param2?.includes("ADD_CHILD") || 
                                    responseData.order_id?.includes("ADD_CHILD");

        let updatedForm;

        if (isRenewalPayment) {
          // Handle renewal payment success
          const existingForm = await Form.findOne({ user: merchant_param1 });
          if (!existingForm) {
            console.error("Form not found for renewal payment:", merchant_param1);
            return res.status(404).send("User form not found");
          }

          // Create renewal history entry
          const hasRenewalChildren = existingForm.pendingChildrenForRenewal && existingForm.pendingChildrenForRenewal.length > 0;
          const hasAddChildren = existingForm.pendingChildrenAdditions && existingForm.pendingChildrenAdditions.length > 0;
          
          let finalChildrenCount;
          if (hasRenewalChildren) {
            // For renewal, use the count from the modified children list
            finalChildrenCount = existingForm.pendingChildrenForRenewal.length;
          } else if (hasAddChildren) {
            // For add-children during renewal, add to existing count
            finalChildrenCount = existingForm.children.length + existingForm.pendingChildrenAdditions.length;
          } else {
            // No changes, keep existing count
            finalChildrenCount = existingForm.children.length;
          }

          const renewalEntry = {
            numberOfChildren: finalChildrenCount,
            renewalFromDate: existingForm.subscriptionPlan.startDate,
            renewalToDate: existingForm.subscriptionPlan.endDate,
            amount: parseFloat(responseData.amount || 0),
            renewedDate: new Date(),
            offerApplied: "",
            newChildrenAdded: hasAddChildren,
            transactionDetails: {
              orderId: order_id,
              transactionId: tracking_id,
              paymentStatus: "Success",
              paymentMethod: "CCAvenue",
              paymentDate: new Date()
            },
            planId: existingForm.subscriptionPlan.planId,
            workingDays: existingForm.subscriptionPlan.workingDays
          };

          // Update form with renewal data
          const updateData = {
            $push: { renewalHistory: renewalEntry },
            $set: {
              paymentStatus: order_status,
              "subscriptionPlan.orderId": order_id,
              "subscriptionPlan.transactionId": tracking_id || "N/A",
              "subscriptionPlan.paymentDate": new Date(),
            },
            $inc: { subscriptionCount: 1 }
          };

          // Handle children updates based on renewal type
          if (hasRenewalChildren) {
            // For renewal with modified children, replace the entire children array
            updateData.$set.children = existingForm.pendingChildrenForRenewal;
            updateData.$unset = { pendingChildrenForRenewal: "" };
          } else if (hasAddChildren) {
            // For add-children during renewal, add to existing children
            updateData.$push.children = { $each: existingForm.pendingChildrenAdditions };
            updateData.$unset = { pendingChildrenAdditions: "" };
          }

          updatedForm = await Form.findOneAndUpdate(
            { user: merchant_param1 },
            updateData,
            { new: true }
          );

          // Update UserMeal to reflect children changes for menu calendar
          if (updatedForm) {
            try {
              const userMeal = await UserMeal.findOne({ userId: mongoose.Types.ObjectId(merchant_param1) });
              
              if (userMeal) {
                if (hasRenewalChildren) {
                  // For renewal with modified children, replace UserMeal children entirely
                  userMeal.children = existingForm.pendingChildrenForRenewal.map(child => ({
                    childId: child._id,
                    meals: []
                  }));
                  await userMeal.save();
                  console.log("UserMeal updated with modified children after renewal payment");
                } else if (hasAddChildren) {
                  // For add-children during renewal, add new children to existing UserMeal
                  for (const child of existingForm.pendingChildrenAdditions) {
                    const childEntry = {
                      childId: child._id,
                      meals: []
                    };
                    userMeal.children.push(childEntry);
                  }
                  await userMeal.save();
                  console.log("UserMeal updated with additional children after renewal payment");
                }
              } else {
                // Create new UserMeal if it doesn't exist
                const childrenEntries = updatedForm.children.map(child => ({
                  childId: child._id,
                  meals: []
                }));
                
                const newUserMeal = new UserMeal({
                  userId: mongoose.Types.ObjectId(merchant_param1),
                  children: childrenEntries
                });
                await newUserMeal.save();
                console.log("Created new UserMeal with children after renewal payment");
              }
            } catch (userMealError) {
              console.error("Error updating UserMeal after renewal payment:", userMealError);
            }
          }

        } else if (isAddChildrenPayment) {
          // Handle add-children payment success
          const existingForm = await Form.findOne({ user: merchant_param1 });
          if (!existingForm || !existingForm.pendingChildrenAdditions || existingForm.pendingChildrenAdditions.length === 0) {
            console.error("No pending children found for add-children payment:", merchant_param1);
            return res.status(400).send("No pending children to add");
          }

          // Create renewal history entry for add-children
          const renewalEntry = {
            numberOfChildren: existingForm.children.length + existingForm.pendingChildrenAdditions.length,
            renewalFromDate: new Date(), // Start from today for new children
            renewalToDate: existingForm.subscriptionPlan.endDate, // Keep existing end date
            amount: parseFloat(responseData.amount || 0),
            renewedDate: new Date(),
            offerApplied: "5% Add Children Discount",
            newChildrenAdded: true,
            transactionDetails: {
              orderId: order_id,
              transactionId: tracking_id,
              paymentStatus: "Success",
              paymentMethod: "CCAvenue",
              paymentDate: new Date()
            },
            planId: existingForm.subscriptionPlan.planId,
            workingDays: existingForm.subscriptionPlan.workingDays
          };

          updatedForm = await Form.findOneAndUpdate(
            { user: merchant_param1 },
            {
              $push: { 
                children: { $each: existingForm.pendingChildrenAdditions },
                renewalHistory: renewalEntry
              },
              $unset: { pendingChildrenAdditions: "" },
              $set: {
                paymentStatus: order_status,
                "subscriptionPlan.orderId": order_id,
                "subscriptionPlan.transactionId": tracking_id || "N/A",
                "subscriptionPlan.paymentDate": new Date(),
              }
            },
            { new: true }
          );

          // Update UserMeal to include the new children for menu calendar
          if (updatedForm && existingForm.pendingChildrenAdditions && existingForm.pendingChildrenAdditions.length > 0) {
            try {
              const userMeal = await UserMeal.findOne({ userId: mongoose.Types.ObjectId(merchant_param1) });
              
              if (userMeal) {
                // Add new children to UserMeal
                for (const child of existingForm.pendingChildrenAdditions) {
                  const childEntry = {
                    childId: child._id,
                    meals: []
                  };
                  userMeal.children.push(childEntry);
                }
                await userMeal.save();
                console.log("UserMeal updated with new children after add-children payment");
              } else {
                // Create new UserMeal if it doesn't exist
                const childrenEntries = existingForm.pendingChildrenAdditions.map(child => ({
                  childId: child._id,
                  meals: []
                }));
                
                const newUserMeal = new UserMeal({
                  userId: mongoose.Types.ObjectId(merchant_param1),
                  children: childrenEntries
                });
                await newUserMeal.save();
                console.log("Created new UserMeal with new children after add-children payment");
              }
            } catch (userMealError) {
              console.error("Error updating UserMeal after add-children payment:", userMealError);
            }
          }

        } else {
          // Handle regular subscription payment
          updatedForm = await Form.findOneAndUpdate(
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
        }

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
              <p>For any help, reach out to <a href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</a></p>
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
        return res.redirect("https://lunchbowl.co.in/payment/subscriptionFailed");
      }
    } catch (error) {
      console.error("CCAvenue subscription response error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

// Holiday Payment Response Handler
exports.holiydayPayment = async (req, res) => {
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

      let decrypted, responseData;
      try {
        decrypted = ccav.decrypt(encrypted, workingKey);
      } catch (decryptErr) {
        return res.status(400).send("Failed to decrypt payment response");
      }

      try {
        responseData = qs.parse(decrypted);
      } catch (parseErr) {
        return res.status(400).send("Malformed payment response data");
      }

      const { order_status, merchant_param1: userId, merchant_param2: mealDate, merchant_param3, tracking_id } = responseData;

      if (!userId) return res.status(400).send("Missing user ID");
      if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send("Invalid user ID");
      if (!mealDate || !/^\d{4}-\d{2}-\d{2}$/.test(mealDate)) return res.status(400).send("Invalid mealDate (should be YYYY-MM-DD)");


      await processPaymentResponse(responseData, "holiday");

      // Parse children's paid meal data
      let childrenData = [];
      try {
        if (merchant_param3 && merchant_param3.trim().startsWith("[")) {
          childrenData = JSON.parse(merchant_param3);
        } else if (merchant_param3 && merchant_param3.includes("childId")) {
          const parts = merchant_param3.split(",");
          const childObj = {};
          for (const part of parts) {
            const clean = part.trim();
            if (clean.startsWith("childId")) childObj.childId = clean.replace("childId", "");
            if (clean.startsWith("dish")) childObj.dish = clean.replace("dish", "");
            if (clean.startsWith("mealDate")) childObj.mealDate = clean.replace("mealDate", "");
          }
          if (!childObj.mealDate && mealDate) childObj.mealDate = mealDate;
          childrenData.push(childObj);
        }
      } catch (err) {
        return res.status(400).send("Malformed childrenData in payment");
      }

      if (order_status !== "Success") {
        return res.redirect("https://lunchbowl.co.in/payment/failed");
      }

      // Always update HolidayPayment
      for (const child of childrenData) {
        const finalMealDate = child.mealDate || mealDate;
        if (child.childId && child.dish && finalMealDate) {
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

            try {
              const userForm = await Form.findOne({ user: userId });
              if (userForm && userForm.parentDetails) {
                const parentName = `${userForm.parentDetails.fatherFirstName} ${userForm.parentDetails.fatherLastName}`;
                const email = userForm.parentDetails.email;
                const mealDateFormatted = new Date(finalMealDate).toLocaleDateString("en-IN");
                const menuName = child.dish;

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
                  subject: "Holiday Meal Payment Confirmation – LunchBowl",
                  html: `
        <p>Hi ${parentName},</p>
        <p>Your holiday meal payment is successful.</p>
        <p>A meal has been booked for <b>${mealDateFormatted}</b> with menu <b>${menuName}</b>.</p>
        <p>We hope your child enjoys their special holiday meal!</p>
        <p>For any queries, contact <a href="mailto:contactus@lunchbowl.co.in">contactus@lunchbowl.co.in</a></p>
        <p>– Earth Tech Concepts Pvt Ltd</p>
      `,
                };

                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    console.error("Holiday meal email error:", err);
                  } else {
                    console.log("Holiday meal email sent:", info.response);
                  }
                });
              }
            } catch (emailErr) {
              console.error("Error sending holiday meal email:", emailErr);
            }
          } catch (dbErr) {
            // Log, don't block
            console.error("HolidayPayment DB error:", dbErr);
          }
        }
      }

      // --- Only update existing UserMeal, DO NOT create new! ---
      let userMeal = await UserMeal.findOne({ userId: mongoose.Types.ObjectId(userId) });
      if (!userMeal) {
        return res.status(404).send("User meal plan not found. Please contact support.");
      }
      let updated = false;
      for (const child of childrenData) {
        if (!child.childId || !child.dish) continue;
        const finalMealDate = child.mealDate || mealDate;
        const mealDateObj = new Date(finalMealDate);

        // Find child's entry in userMeal
        let childObj = userMeal.children.find(
          c => c.childId.toString() === child.childId
        );
        if (!childObj) continue; // DO NOT create new child entry!

        // Check if meal for this date exists
        let mealIndex = childObj.meals.findIndex(
          m => new Date(m.mealDate).toISOString().slice(0, 10) === mealDateObj.toISOString().slice(0, 10)
        );
        if (mealIndex >= 0) {
          // Overwrite
          childObj.meals[mealIndex].mealName = child.dish;
          childObj.meals[mealIndex].mealDate = mealDateObj;
        } else {
          // Add new meal for that date
          childObj.meals.push({
            mealDate: mealDateObj,
            mealName: child.dish,
          });
        }
        updated = true;
      }

      // Save only if an update happened
      if (updated) {
        await userMeal.save();
      }

      return res.redirect("https://lunchbowl.co.in/payment/success");
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

// Dummy Payment Response Handler for Development/Testing
exports.dummyPaymentResponse = async (req, res) => {
  try {
    const { userId, paymentType = "subscription", amount = 1 } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Check if dummy responses are enabled
    const useDummyResponse = process.env.CCAV_USE_DUMMY_RESPONSE === 'true';
    const dummySuccess = process.env.CCAV_DUMMY_SUCCESS === 'true';

    if (!useDummyResponse) {
      return res.status(400).json({ error: "Dummy responses not enabled" });
    }

    if (!dummySuccess) {
      return res.json({ 
        success: false,
        order_status: "Failed",
        message: "Payment failed (dummy response)"
      });
    }

    // Generate dummy successful payment data
    const orderId = `DUMMY_${Date.now()}`;
    const trackingId = `TXN_${Date.now()}`;

    const dummyResponseData = {
      order_id: orderId,
      tracking_id: trackingId,
      order_status: "Success",
      merchant_param1: userId,
      merchant_param2: paymentType === "renewal" ? "RENEWAL_PLAN" : 
                      paymentType === "add_children" ? "ADD_CHILD_PLAN" : "SUBSCRIPTION_PLAN",
      amount: amount,
      payment_mode: "Dummy",
      card_name: "Dummy Card",
      status_code: "Success",
      status_message: "Transaction Successful",
      bank_ref_no: `BANK_${Date.now()}`,
      billing_name: "Test User",
      billing_email: "test@example.com",
    };

    // Process the dummy payment
    const { order_status, merchant_param1, order_id, tracking_id } =
      await processPaymentResponse(dummyResponseData, "subscription");

    if (order_status === "Success") {
      // Check payment type to handle different flows
      const isAddChildrenPayment = paymentType === "add_children";
      let updatedForm;

      if (isAddChildrenPayment) {
        // Handle add-children payment success (same logic as real payments)
        const existingForm = await Form.findOne({ user: merchant_param1 });
        if (!existingForm || !existingForm.pendingChildrenAdditions || existingForm.pendingChildrenAdditions.length === 0) {
          console.error("No pending children found for dummy add-children payment:", merchant_param1);
          return res.json({
            success: false,
            order_status: "Failed",
            message: "No pending children to add"
          });
        }

        // Create renewal history entry for add-children
        const renewalEntry = {
          numberOfChildren: existingForm.children.length + existingForm.pendingChildrenAdditions.length,
          renewalFromDate: new Date(), // Start from today for new children
          renewalToDate: existingForm.subscriptionPlan.endDate, // Keep existing end date
          amount: parseFloat(amount || 0),
          renewedDate: new Date(),
          offerApplied: "5% Add Children Discount",
          newChildrenAdded: true,
          transactionDetails: {
            orderId: order_id,
            transactionId: tracking_id,
            paymentStatus: "Success",
            paymentMethod: "Dummy",
            paymentDate: new Date()
          },
          planId: existingForm.subscriptionPlan.planId,
          workingDays: existingForm.subscriptionPlan.workingDays
        };

        updatedForm = await Form.findOneAndUpdate(
          { user: merchant_param1 },
          {
            $push: { 
              children: { $each: existingForm.pendingChildrenAdditions },
              renewalHistory: renewalEntry
            },
            $unset: { pendingChildrenAdditions: "" },
            $set: {
              paymentStatus: order_status,
              "subscriptionPlan.orderId": order_id,
              "subscriptionPlan.transactionId": tracking_id || "N/A",
              "subscriptionPlan.paymentDate": new Date(),
            }
          },
          { new: true }
        );

        // Update UserMeal to include the new children for menu calendar
        if (updatedForm && existingForm.pendingChildrenAdditions && existingForm.pendingChildrenAdditions.length > 0) {
          try {
            const userMeal = await UserMeal.findOne({ userId: mongoose.Types.ObjectId(merchant_param1) });
            
            if (userMeal) {
              // Add new children to UserMeal
              for (const child of existingForm.pendingChildrenAdditions) {
                const childEntry = {
                  childId: child._id,
                  meals: []
                };
                userMeal.children.push(childEntry);
              }
              await userMeal.save();
              console.log("UserMeal updated with new children after dummy add-children payment");
            } else {
              // Create new UserMeal if it doesn't exist
              const childrenEntries = existingForm.pendingChildrenAdditions.map(child => ({
                childId: child._id,
                meals: []
              }));
              
              const newUserMeal = new UserMeal({
                userId: mongoose.Types.ObjectId(merchant_param1),
                children: childrenEntries
              });
              await newUserMeal.save();
              console.log("Created new UserMeal with new children after dummy add-children payment");
            }
          } catch (userMealError) {
            console.error("Error updating UserMeal after dummy add-children payment:", userMealError);
          }
        }

      } else if (paymentType === "renewal") {
        // Handle renewal payment success (same logic as real payments)
        const existingForm = await Form.findOne({ user: merchant_param1 });
        if (!existingForm) {
          console.error("Form not found for dummy renewal payment:", merchant_param1);
          return res.json({
            success: false,
            order_status: "Failed",
            message: "User form not found"
          });
        }

        // Create renewal history entry
        const hasRenewalChildren = existingForm.pendingChildrenForRenewal && existingForm.pendingChildrenForRenewal.length > 0;
        const hasAddChildren = existingForm.pendingChildrenAdditions && existingForm.pendingChildrenAdditions.length > 0;
        
        let finalChildrenCount;
        if (hasRenewalChildren) {
          finalChildrenCount = existingForm.pendingChildrenForRenewal.length;
        } else if (hasAddChildren) {
          finalChildrenCount = existingForm.children.length + existingForm.pendingChildrenAdditions.length;
        } else {
          finalChildrenCount = existingForm.children.length;
        }

        const renewalEntry = {
          numberOfChildren: finalChildrenCount,
          renewalFromDate: existingForm.subscriptionPlan.startDate,
          renewalToDate: existingForm.subscriptionPlan.endDate,
          amount: parseFloat(amount || 0),
          renewedDate: new Date(),
          offerApplied: "",
          newChildrenAdded: hasAddChildren,
          transactionDetails: {
            orderId: order_id,
            transactionId: tracking_id,
            paymentStatus: "Success",
            paymentMethod: "Dummy",
            paymentDate: new Date()
          },
          planId: existingForm.subscriptionPlan.planId,
          workingDays: existingForm.subscriptionPlan.workingDays
        };

        // Update form with renewal data
        const updateData = {
          $push: { renewalHistory: renewalEntry },
          $set: {
            paymentStatus: order_status,
            "subscriptionPlan.orderId": order_id,
            "subscriptionPlan.transactionId": tracking_id || "N/A",
            "subscriptionPlan.paymentDate": new Date(),
          },
          $inc: { subscriptionCount: 1 }
        };

        // Handle children updates based on renewal type
        if (hasRenewalChildren) {
          updateData.$set.children = existingForm.pendingChildrenForRenewal;
          updateData.$unset = { pendingChildrenForRenewal: "" };
        } else if (hasAddChildren) {
          updateData.$push.children = { $each: existingForm.pendingChildrenAdditions };
          updateData.$unset = { pendingChildrenAdditions: "" };
        }

        updatedForm = await Form.findOneAndUpdate(
          { user: merchant_param1 },
          updateData,
          { new: true }
        );

        // Update UserMeal to reflect children changes for menu calendar
        if (updatedForm) {
          try {
            const userMeal = await UserMeal.findOne({ userId: mongoose.Types.ObjectId(merchant_param1) });
            
            if (userMeal) {
              if (hasRenewalChildren) {
                userMeal.children = existingForm.pendingChildrenForRenewal.map(child => ({
                  childId: child._id,
                  meals: []
                }));
                await userMeal.save();
                console.log("UserMeal updated with modified children after dummy renewal payment");
              } else if (hasAddChildren) {
                for (const child of existingForm.pendingChildrenAdditions) {
                  const childEntry = {
                    childId: child._id,
                    meals: []
                  };
                  userMeal.children.push(childEntry);
                }
                await userMeal.save();
                console.log("UserMeal updated with additional children after dummy renewal payment");
              }
            } else {
              const childrenEntries = updatedForm.children.map(child => ({
                childId: child._id,
                meals: []
              }));
              
              const newUserMeal = new UserMeal({
                userId: mongoose.Types.ObjectId(merchant_param1),
                children: childrenEntries
              });
              await newUserMeal.save();
              console.log("Created new UserMeal with children after dummy renewal payment");
            }
          } catch (userMealError) {
            console.error("Error updating UserMeal after dummy renewal payment:", userMealError);
          }
        }

      } else {
        // Handle regular subscription payment
        updatedForm = await Form.findOneAndUpdate(
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
      }

      console.log("Dummy payment processed successfully:", updatedForm);

      return res.json({
        success: true,
        order_status: "Success",
        order_id: order_id,
        tracking_id: tracking_id,
        message: "Dummy payment processed successfully"
      });
    } else {
      return res.json({
        success: false,
        order_status: "Failed", 
        message: "Dummy payment processing failed"
      });
    }
  } catch (error) {
    console.error("Dummy payment error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};