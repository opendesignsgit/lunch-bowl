import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";


const PaymentStep = ({ prevStep }) => {
      const router = useRouter();
    
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#4AB138" }}>
        Thank You!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Your subscription has been successfully processed. We appreciate your trust in our service.
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
        onClick={() => {
          router.push("/user/menuCalendarPage");
        }}
      >
        OK
      </Button>
    </Box>
  );
};

export default PaymentStep;