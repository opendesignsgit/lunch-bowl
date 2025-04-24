import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Box
} from "@mui/material";

export const OTPComponent = ({ onVerify, onResend, initialTimer = 120, generatedOtp }) => {
  const [userOtp, setUserOtp] = useState("");
  const [timer, setTimer] = useState(initialTimer);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [message, setMessage] = useState(null);
  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setTimer(initialTimer);
    setResendEnabled(false);
    setMessage(null);
    setUserOtp("");
    if (onResend) onResend(newOtp);
  };

  const handleVerifyOtp = () => {
    if (userOtp === generatedOtp) {
      setMessage({ type: "success", text: "OTP is correct!" });
      if (onVerify) onVerify();
    } else {
      setMessage({ type: "error", text: "OTP is incorrect! Please try again." });
    }
  };

  const handleOtpChange = (index, value) => {
    const otpArray = userOtp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setUserOtp(newOtp);
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
    // Auto-submit when last digit is entered
    if (index === otpRefs.current.length - 1 && newOtp.length === 4) {
      handleVerifyOtp();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && event.target.value === "") {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <Typography variant="body2" sx={{ mb: 2 }}>
        We've sent an OTP to your phone number.
      </Typography>
      <Typography
        variant="body2"
        fontWeight="bold"
        mb={1}
        sx={{ color: "#FF6B00" }}
      >
        ONE TIME PASSWORD*
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <TextField
            key={index}
            variant="outlined"
            size="small"
            value={userOtp[index] || ""}
            inputProps={{
              maxLength: 1,
              style: { textAlign: "center", fontSize: "24px" },
            }}
            sx={{ width: "56px" }}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            inputRef={(ref) => (otpRefs.current[index] = ref)}
          />
        ))}
      </Box>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        mb={2}
      >
        Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
        {timer % 60} minutes
      </Typography>
      <Button
        fullWidth
        sx={{
          backgroundColor: resendEnabled ? "#FF6B00" : "#e85f00",
          color: "#fff",
          fontWeight: "bold",
          padding: "12px",
          borderRadius: "4px",
          "&:hover": { backgroundColor: "#e85f00" },
        }}
        endIcon={<span>&#8594;</span>}
        onClick={resendEnabled ? handleResendOtp : handleVerifyOtp}
      >
        {resendEnabled ? "Resend OTP" : "Verify One Time Password"}
      </Button>

      {message && (
        <Alert
          severity={message.type}
          sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
        >
          {message.text}
        </Alert>
      )}
    </>
  );
};