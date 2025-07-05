import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";

const PaymentSuccess = () => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Thank you for your payment. Your subscription is now active.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/dashboard")} // Replace with your home or dashboard route
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default PaymentSuccess;
