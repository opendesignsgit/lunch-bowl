import crypto from "crypto";

// Use environment variables in production!
const MERCHANT_ID = "4381442";
const ACCESS_CODE = "AVRM80MF59BY86MRYB";
const WORKING_KEY = "EE8225FC5F850581F431D475A9256608";
const REDIRECT_URL = "https://lunchbowl.co.in/payment/callback";
const CANCEL_URL = "https://lunchbowl.co.in/payment/cancel";
const ACTION_URL = "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

// Helper to flatten an object to key-value string
function objectToKeyValue(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

// PKCS5 padding for AES encryption
function pkcs5Pad(text) {
  const blockSize = 16;
  const pad = blockSize - (text.length % blockSize);
  return text + String.fromCharCode(pad).repeat(pad);
}

function encrypt(plainText, workingKey) {
  const iv = Buffer.from([0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f]);
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(workingKey), iv);
  let encrypted = cipher.update(pkcs5Pad(plainText), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get payment data from frontend (provide all fields you need)
  const {
    amount,
    order_id,
    currency = "INR",
    billing_name,
    billing_email,
    billing_tel,
    billing_address,
    billing_city,
    billing_state,
    billing_zip,
    billing_country
  } = req.body;

  // Prepare CC Avenue parameters
  const data = {
    merchant_id: MERCHANT_ID,
    order_id: order_id,
    currency,
    amount: parseFloat(amount).toFixed(2),
    redirect_url: REDIRECT_URL,
    cancel_url: CANCEL_URL,
    language: "EN",
    billing_name,
    billing_address,
    billing_city,
    billing_state,
    billing_zip,
    billing_country,
    billing_tel,
    billing_email,
  };

  // Convert and encrypt
  const merchantData = objectToKeyValue(data);
  const encRequest = encrypt(merchantData, WORKING_KEY);

  res.status(200).json({
    actionUrl: ACTION_URL,
    encRequest,
    accessCode: ACCESS_CODE,
  });
}