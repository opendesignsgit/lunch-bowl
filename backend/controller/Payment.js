const qs = require("querystring");
const ccav = require("../utils/ccavutil"); // Make sure to export encrypt/decrypt correctly
const Form = require("../models/Form"); // Your Mongoose Form model
const fs = require("fs");
const path = require("path");

const workingKey = "2A561B005709D8B4BAF69D049B23546B"; // Replace with ENV in production

exports.ccavenueResponse = async (req, res) => {
  console.log("====================================");
  console.log("CCAvenue Payment Response Received----> start");
  console.log("====================================");
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

      console.log("====================================");
      console.log("Encrypted Payment Response:", encrypted);
      console.log("====================================");

      // Decrypt response
      const decrypted = ccav.decrypt(encrypted, workingKey);
      console.log("Decrypted Payment Response--------->:", decrypted);
      const responseData = qs.parse(decrypted); // Converts k1=v1&k2=v2 → { k1: v1, k2: v2 }

      console.log("Decrypted Payment Response:", responseData);

      const { order_id, tracking_id, order_status, merchant_param1 } =
        responseData;

      if (!merchant_param1 || !order_id) {
        return res
          .status(400)
          .send("Invalid payment response: missing parameters");
      }

      if (order_status === "Success") {
        const updatedForm = await Form.findOneAndUpdate(
          { user: merchant_param1 },
          {
            $set: {
              paymentStatus: order_status, // Set to "Success"
              "subscriptionPlan.orderId": order_id,
              "subscriptionPlan.transactionId": tracking_id || "N/A",
              "subscriptionPlan.paymentDate": new Date(),
              step: 4,
            },
            $inc: {
              subscriptionCount: 1, // Increment subscriptionCount by 1
            },
          },
          { new: true } // To return the updated document
        );

        console.log("Payment status updated in DB:", updatedForm);

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
