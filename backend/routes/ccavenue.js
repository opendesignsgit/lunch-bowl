const express = require('express');
const router = express.Router();
const CryptoJS = require('crypto-js');
const Form = require('../models/Form');

// CCAvenue configuration
const workingKey = process.env.CCAVENUE_WORKING_KEY || "EE8225FC5F850581F431D475A9256608";

// Handle CCAvenue response
router.post('/response', async (req, res) => {
  try {
    const { encResponse } = req.body;
    
    if (!encResponse) {
      return res.status(400).json({ success: false, message: "No response data received" });
    }
    
    // Decrypt the response
    const bytes = CryptoJS.AES.decrypt(
      encResponse.toString(),
      CryptoJS.enc.Utf8.parse(workingKey),
      {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: CryptoJS.enc.Utf8.parse(workingKey)
      }
    );
    
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const responseParams = new URLSearchParams(decryptedData);
    
    const orderStatus = responseParams.get('order_status');
    const orderId = responseParams.get('order_id');
    const userId = responseParams.get('merchant_param1');
    const amount = responseParams.get('amount');
    
    if (orderStatus === "Success") {
      // Update the form with payment status
      await Form.findOneAndUpdate(
        { user: userId },
        { 
          $set: { 
            paymentStatus: true,
            "subscriptionPlan.orderId": orderId,
            "subscriptionPlan.paymentAmount": parseFloat(amount),
            "subscriptionPlan.paymentDate": new Date()
          },
          $inc: { subscriptionCount: 1 }
        }
      );
      
      // Redirect to frontend with success status
      return res.redirect(`${process.env.FRONTEND_URL}/subscription/payment?success=true&orderId=${orderId}`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/subscription/payment?success=false&orderId=${orderId}`);
    }
  } catch (error) {
    console.error("CCAvenue response processing failed:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/subscription/payment?success=false`);
  }
});

// Verify payment status
router.post('/verify', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: "Order ID is required" 
      });
    }
    
    const form = await Form.findOne({ "subscriptionPlan.orderId": orderId });
    
    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }
    
    return res.status(200).json({ 
      success: form.paymentStatus,
      message: form.paymentStatus 
        ? "Payment verified successfully" 
        : "Payment not verified",
      data: form
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
});

module.exports = router;