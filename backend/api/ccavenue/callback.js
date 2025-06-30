import crypto from "crypto";
import mongoose from "mongoose";
import Form from "../../models/Form"; // Adjust path as needed

const WORKING_KEY = "EE8225FC5F850581F431D475A9256608";

// PKCS5 padding removal
function pkcs5Unpad(str) {
  const pad = str.charCodeAt(str.length - 1);
  return str.slice(0, -pad);
}

// Decrypt function
function decrypt(encText, workingKey) {
  const iv = Buffer.from([0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f]);
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(workingKey), iv);
  let decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");
  return pkcs5Unpad(decoded);
}

// Parse key-value string into JS object
function keyValueToObject(str) {
  const obj = {};
  for (const pair of str.split("&")) {
    const [key, val] = pair.split("=");
    if (key) obj[key] = val;
  }
  return obj;
}

export default async function handler(req, res) {
  // CC Avenue POSTs "encResp" in the body as urlencoded
  let encResp = req.body.encResp;
  if (!encResp && req.method === "POST") {
    // Handle urlencoded body (Next.js default bodyParser does not support this)
    // So, in next.config.js or this api file, set: export const config = { api: { bodyParser: false } }
    // Then parse manually:
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers).toString("utf8");
    encResp = rawBody.split("encResp=")[1];
  }

  // Decrypt and parse response
  const decrypted = decrypt(encResp, WORKING_KEY);
  const respObj = keyValueToObject(decrypted);

  // Now, process the payment
  const { order_id, order_status } = respObj;
  // You must store user id in the order_id or elsewhere for mapping!
  // For example, if you format order_id as `${userId}_${timestamp}`

  try {
    if (order_status === "Success") {
      // Extract user ID if you encoded it in order_id, otherwise find by other means
      // E.g., order_id = LB_USERID_TIMESTAMP
      // const userId = order_id.split("_")[1];
      // For demo, let's assume you store userId in order_id or have a mapping table

      // Find the Form and update payment status
      const form = await Form.findOneAndUpdate(
        { "subscriptionPlan.orderId": order_id }, // Adjust field if needed
        { $set: { paymentStatus: true }, $inc: { subscriptionCount: 1 } },
        { new: true }
      );

      // Return the payment result for frontend
      return res.status(200).json({
        success: true,
        message: "Payment successful!",
        payment_data: respObj,
        form,
      });
    }
    // Payment failed/cancelled
    return res.status(200).json({
      success: false,
      message: "Payment failed or cancelled.",
      payment_data: respObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// Disable default body parser to handle raw POST body
export const config = { api: { bodyParser: false } };