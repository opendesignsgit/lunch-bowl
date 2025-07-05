const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const Form = require("../models/Form");

const workingKey =
  process.env.CCAVENUE_WORKING_KEY || "2A561B005709D8B4BAF69D049B23546B";

const decrypt = (encText, workingKey) => {
  try {
    const m = crypto.createHash("md5");
    m.update(workingKey);
    const key = m.digest("binary");
    const iv =
      "\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f";
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    let decoded = decipher.update(encText, "hex", "utf8");
    decoded += decipher.final("utf8");
    return decoded;
  } catch (err) {
    console.error("Decryption error:", err);
    throw new Error("Failed to decrypt response");
  }
};

router.post("/response", async (req, res) => {
  try {
    const { encResponse } = req.body;

    if (!encResponse) {
      return res.status(400).json({
        success: false,
        message: "No response data received",
      });
    }

    const decryptedData = decrypt(encResponse, workingKey);
    const responseParams = new URLSearchParams(decryptedData);

    const orderStatus = responseParams.get("order_status");
    const orderId = responseParams.get("order_id");
    const userId = responseParams.get("merchant_param1");
    const amount = responseParams.get("amount");
    const planId = responseParams.get("merchant_param2");

    if (orderStatus === "Success") {
      await Form.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            paymentStatus: true,
            "subscriptionPlan.orderId": orderId,
            "subscriptionPlan.planId": planId,
            "subscriptionPlan.paymentAmount": parseFloat(amount),
            "subscriptionPlan.paymentDate": new Date(),
          },
          $inc: { subscriptionCount: 1 },
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Payment successful",
        orderId,
        amount,
      });
    } else {
      return res.json({
        success: false,
        message: "Payment failed",
        orderId,
      });
    }
  } catch (error) {
    console.error("Payment processing failed:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const form = await Form.findOne({ "subscriptionPlan.orderId": orderId });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: form.paymentStatus,
      message: form.paymentStatus ? "Payment verified" : "Payment not verified",
      data: {
        status: form.paymentStatus,
        orderId: form.subscriptionPlan.orderId,
        planId: form.subscriptionPlan.planId,
        amount: form.subscriptionPlan.paymentAmount,
        date: form.subscriptionPlan.paymentDate,
      },
    });
  } catch (error) {
    console.error("Verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;