const qs = require("querystring");
const ccav = require("../utils/ccavutil");
const Form = require("../models/Form");
const UserPayment = require("../models/Payment");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const workingKey = "2A561B005709D8B4BAF69D049B23546B"; // Replace with ENV in production

// Helper function to process payment response
async function processPaymentResponse(responseData, paymentType) {
  const {
    order_id,
    tracking_id,
    order_status,
    merchant_param1,
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
    throw new Error("Invalid payment response: missing parameters");
  }

  // Create payment transaction object
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
    ...responseData,
  };

  // Update or create user payment record
  await UserPayment.findOneAndUpdate(
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

      // Decrypt response
      const decrypted = ccav.decrypt(encrypted, workingKey);
      const responseData = qs.parse(decrypted);

      const { order_status, merchant_param1, order_id, tracking_id } =
        await processPaymentResponse(responseData, "subscription");

      if (order_status === "Success") {
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
        }

        return res.redirect("https://lunchbowl.co.in/payment/success");
      } else {
        return res.redirect("https://lunchbowl.co.in/payment/failed");
      }
    } catch (error) {
      console.error("CCAvenue response error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};

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

      // Decrypt response
      const decrypted = ccav.decrypt(encrypted, workingKey);
      const responseData = qs.parse(decrypted);

      const { order_status } = await processPaymentResponse(
        responseData,
        "holiday"
      );

      if (order_status === "Success") {
        return res.send("success");
      } else {
        return res.send("failed");
      }
    } catch (error) {
      console.error("CCAvenue holiday payment error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};