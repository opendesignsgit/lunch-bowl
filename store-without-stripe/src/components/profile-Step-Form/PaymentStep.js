import React, { useRef, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

const PaymentStep = ({ prevStep, subscriptionDetails }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // You must collect and pass billing info and amount in subscriptionDetails!
  const handlePayment = async () => {
    setLoading(true);
    // Unique order_id
    const order_id = "LB" + Date.now();
    const payload = {
      amount: subscriptionDetails?.totalPrice || "2000", // Fallback for demo
      order_id,
      billing_name: subscriptionDetails?.billing_name || "Test User",
      billing_email: subscriptionDetails?.billing_email || "test@example.com",
      billing_tel: subscriptionDetails?.billing_tel || "9876543210",
      billing_address: subscriptionDetails?.billing_address || "123, Main St",
      billing_city: subscriptionDetails?.billing_city || "City",
      billing_state: subscriptionDetails?.billing_state || "State",
      billing_zip: subscriptionDetails?.billing_zip || "123456",
      billing_country: subscriptionDetails?.billing_country || "India",
    };

    const res = await fetch("/api/ccavenue/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const { actionUrl, encRequest, accessCode } = await res.json();
      // Fill the form and submit
      const form = formRef.current;
      form.action = actionUrl;
      form.elements.encRequest.value = encRequest;
      form.elements.access_code.value = accessCode;
      form.submit();
    } else {
      setLoading(false);
      alert("Payment error: " + (await res.text()));
    }
  };

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#4AB138" }}>
        Payment
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Please proceed to make your payment for the subscription.
      </Typography>
      <form ref={formRef} method="POST" style={{ display: "none" }}>
        <input type="hidden" name="encRequest" value="" />
        <input type="hidden" name="access_code" value="" />
      </form>
      <Button
        variant="contained"
        sx={{
          bgcolor: "#FF6A00",
          "&:hover": { bgcolor: "#E55C00" },
          px: 4,
          py: 1.5,
          borderRadius: "8px",
          minWidth: 150,
        }}
        disabled={loading}
        onClick={handlePayment}
      >
        {loading ? <CircularProgress color="inherit" size={24} /> : "Pay Now"}
      </Button>
      <Box mt={3}>
        <Button variant="outlined" onClick={prevStep}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentStep;
