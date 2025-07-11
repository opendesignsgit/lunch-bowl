import React, { useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import useRegistration from "@hooks/useRegistration";

const PaymentStep = ({ prevStep, _id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { submitHandler } = useRegistration();

  const ccavenueConfig = {
    merchant_id: "4381442",
    access_code: "AVRM80MF59BY86MRYB",
    working_key: "2A561B005709D8B4BAF69D049B23546B",
    redirect_url: "https://api.lunchbowl.co.in/api/ccavenue/response",
    cancel_url: "https://api.lunchbowl.co.in/api/ccavenue/response",
    currency: "INR",
    language: "EN",
    endpoint:
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  };

  // Exact implementation matching Node.js crypto
  const encrypt = (plainText, workingKey) => {
    try {
      // Step 1: Create MD5 hash of working key
      const md5Hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(workingKey));

      // Step 2: Convert to binary-like format (WordArray)
      const key = CryptoJS.enc.Hex.parse(md5Hash.toString(CryptoJS.enc.Hex));

      // Step 3: Create IV (same as in Node.js code)
      const iv = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");

      // Step 4: Encrypt using AES-128-CBC
      const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(plainText),
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Return as hex string (to match Node.js implementation)
      return encrypted.ciphertext.toString();
    } catch (err) {
      console.error("Encryption error:", err);
      throw new Error("Payment encryption failed");
    }
  };

  const generateOrderId = () =>
    `LB${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const initiatePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch form data
      const response = await submitHandler({
        path: "get-customer-form",
        _id,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch form data");
      }

      const { subscriptionPlan, user, parentDetails } = response.data || {};
      if (!subscriptionPlan || !user) {
        throw new Error("Required data missing in response");
      }
      console.log("====================================");
      console.log("Subscription Plan:", response);
      console.log("====================================");
      // Prepare payment data
      const orderId = generateOrderId();
      const paymentData = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: subscriptionPlan.price.toFixed(2),
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        language: ccavenueConfig.language,
        billing_name: (user?.name || "Customer").substring(0, 50),
        billing_email: (user?.email || "no-email@example.com").substring(0, 50),
        billing_tel: (user?.phone || "0000000000").substring(0, 20),
        billing_address: (parentDetails?.address || "Not Provided").substring(
          0,
          100
        ),
        billing_city: (parentDetails?.city || "Chennai").substring(0, 50),
        billing_state: (parentDetails?.state || "Tamil Nadu").substring(0, 50),
        billing_zip: (parentDetails?.pincode || "600001").substring(0, 10),
        billing_country: (parentDetails?.country || "India").substring(0, 50),
        merchant_param1: _id,
        merchant_param2: subscriptionPlan.planId,
        merchant_param3: orderId,
      };
      console.log("====================================");
      console.log("Payment Data:", paymentData);
      console.log("====================================");
      // Create request string
      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      // Encrypt using the exact method
      const encryptedData = encrypt(plainText, ccavenueConfig.working_key);

      // Submit to CCAvenue via hidden form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = ccavenueConfig.endpoint;
      form.style.display = "none";

      const addInput = (name, value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addInput("encRequest", encryptedData);
      addInput("access_code", ccavenueConfig.access_code);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      {loading && <LinearProgress sx={{ mb: 3 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h4" sx={{ mb: 3, color: "#4AB138" }}>
        Complete Payment
      </Typography>
      <Typography sx={{ mb: 4 }}>Secure payment via CCAvenue</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Button variant="outlined" onClick={prevStep}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={initiatePayment}
          disabled={loading}
          sx={{ bgcolor: "#FF6A00", "&:hover": { bgcolor: "#E55C00" } }}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentStep;
