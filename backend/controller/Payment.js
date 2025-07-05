const qs = require("querystring");
const ccav = require("../utils/ccavutil"); // Make sure to export encrypt/decrypt correctly
const Form = require("../models/Form"); // Your Mongoose Form model
const fs = require("fs");
const path = require("path");

const workingKey = "2A561B005709D8B4BAF69D049B23546B"; // Replace with ENV in production

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
        // Update payment status in DB
        await Form.findOneAndUpdate(
          { user: merchant_param1 },
          {
            paymentStatus: true,
            "subscriptionPlan.orderId": order_id,
            "subscriptionPlan.transactionId": tracking_id || "N/A",
            "subscriptionPlan.paymentDate": new Date(),
          }
        );

        // You can also redirect to a success page
        return res.redirect("/payment/success"); // frontend route
      } else {
        return res.redirect("/payment/failed"); // frontend route
      }
    } catch (error) {
      console.error("CCAvenue response error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
};
