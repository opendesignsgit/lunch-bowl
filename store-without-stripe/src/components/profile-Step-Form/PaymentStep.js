import React, { useState, useEffect } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import useRegistration from "@hooks/useRegistration";

const PaymentStep = ({ prevStep, _id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const { submitHandler } = useRegistration();

  // CCAvenue configuration
  const ccavenueConfig = {
    merchant_id: "4381442",
    access_code: "AVRM80MF59BY86MRYB",
    working_key: "EE8225FC5F850581F431D475A9256608",
    redirect_url: "https://lunchbowl.co.in/api/ccavenue/response",
    cancel_url: "https://lunchbowl.co.in/api/ccavenue/response",
    currency: "INR",
    language: "EN",
    endpoint:
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  };

  // Encryption function
  const encrypt = (plainText) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(ccavenueConfig.working_key);
      const iv = CryptoJS.enc.Utf8.parse(ccavenueConfig.working_key);
      return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
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

      // 1. Fetch form data using useRegistration hook
      const response = await submitHandler({
        path: "get-customer-form",
        _id,
      });

      console.log("API Response:", response); // Debug log

      // Handle the response structure you provided
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch form data");
      }

      if (!response.data) {
        throw new Error("No data received from API");
      }

      const { subscriptionPlan, user } = response.data;

      if (!subscriptionPlan) {
        throw new Error("Subscription plan not found in response");
      }

      if (!user) {
        throw new Error("User information not found in response");
      }

      // 2. Prepare payment data
      const orderId = generateOrderId();
      const paymentData = {
        merchant_id: ccavenueConfig.merchant_id,
        order_id: orderId,
        amount: subscriptionPlan.price.toFixed(2),
        currency: ccavenueConfig.currency,
        redirect_url: ccavenueConfig.redirect_url,
        cancel_url: ccavenueConfig.cancel_url,
        billing_name: user?.name || "Customer",
        billing_email: user?.email || "",
        billing_tel: user?.phone || "",
        delivery_name: user?.name || "Customer",
        delivery_tel: user?.phone || "",
        merchant_param1: _id,
        merchant_param2: subscriptionPlan.planId,
        merchant_param3: orderId,
      };

      // 3. Create and encrypt request
      const plainText = Object.entries(paymentData)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

      const encryptedData = encrypt(plainText);

      // 4. Submit to CCAvenue
      const form = document.createElement("form");
      form.method = "POST";
      form.action = ccavenueConfig.endpoint;
      alert("Redirecting to CCAvenue for payment...");

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
      setPaymentStatus({
        success: false,
        message: err.message || "Payment failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId) => {
    try {
      setLoading(true);

      const response = await submitHandler({
        path: "verify-payment",
        data: { orderId },
      });

      if (!response || !response.success) {
        throw new Error(response?.message || "Payment verification failed");
      }

      // Update payment status
      const updateResponse = await submitHandler({
        payload: {
          paymentStatus: true,
          transactionId: orderId,
        },
        step: 4,
        path: "step-Form-Payment",
        _id,
      });

      if (!updateResponse || !updateResponse.success) {
        throw new Error("Failed to update payment status");
      }

      setPaymentStatus({
        success: true,
        message: "Payment successful! Subscription activated.",
      });
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "Could not verify payment");
      setPaymentStatus({
        success: false,
        message: err.message || "Payment verification failed. Contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("encResponse")) {
      verifyPayment(params.get("orderNo"));
    }
  }, []);

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {paymentStatus ? (
        <>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              color: paymentStatus.success ? "#4AB138" : "#FF6A00",
            }}
          >
            {paymentStatus.success ? "Payment Successful!" : "Payment Failed"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {paymentStatus.message}
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#FF6A00",
              "&:hover": { bgcolor: "#E55C00" },
              px: 4,
              py: 1.5,
              borderRadius: "8px",
            }}
            onClick={() =>
              router.push(
                paymentStatus.success
                  ? "/user/menuCalendarPage"
                  : "/subscription"
              )
            }
          >
            {paymentStatus.success ? "Continue" : "Try Again"}
          </Button>
        </>
      ) : (
        <>
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
        </>
      )}
    </Box>
  );
};

export default PaymentStep;
