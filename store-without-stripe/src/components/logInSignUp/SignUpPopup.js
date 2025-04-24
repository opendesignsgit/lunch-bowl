import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import SignUpImage from "../../../public/LogInSignUp/LogIn.png"; // Adjust path as needed

const SignUpPopup = ({ open, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [message, setMessage] = useState(null);
  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setResendEnabled(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const generateOtp = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
    setTimer(120);
    setResendEnabled(false);
    setMessage(null);
  };

  const handleSendOtp = () => {
    generateOtp();
    setOtpSent(true);
  };

  const handleResendOtp = () => {
    generateOtp();
  };

  const handleVerifyOtp = () => {
    if (userOtp === otp) {
      setMessage({ type: "success", text: "OTP is correct!" });
    } else {
      setMessage({ type: "error", text: "OTP is incorrect! Please try again." });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    const otpArray = userOtp.split("");
    otpArray[index] = value;
    setUserOtp(otpArray.join(""));
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && event.target.value === "") {
      otpRefs.current[index - 1].focus();
    }
  };

  const renderLabel = (label) => (
    <Typography
      component="label"
      sx={{
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        display: "inline-block",
        mb: 0.5,
        color: "#FF6B00",
      }}
    >
      {label}
      <Typography component="span" sx={{ color: "#FF6B00" }}>
        *
      </Typography>
    </Typography>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "1000px",
          height: "650px",
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Side Image */}
        <Box
          sx={{
            width: "50%",
            backgroundImage: `url(${SignUpImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Right Side Form or OTP */}
        <Box
          sx={{
            width: "50%",
            p: 7,
            pt: 8,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ textTransform: "uppercase", mb: 1 }}
          >
            {otpSent ? "Enter OTP" : "Sign Up"}
          </Typography>

          {otpSent ? (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We've sent an OTP to your mobile number.
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                mb={1}
                sx={{ color: "#FF6B00" }}
              >
                Your OTP: {otp}
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
                Time remaining: {Math.floor(timer / 60)}:
                {timer % 60 < 10 ? "0" : ""}
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
                  mb: 3,
                  "&:hover": { backgroundColor: "#e85f00" },
                }}
                endIcon={<span>&#8594;</span>}
                onClick={resendEnabled ? handleResendOtp : handleVerifyOtp}
              >
                {resendEnabled ? "Resend OTP" : "Verify One Time Password"}
              </Button>

              {/* Success/Error Message */}
              {message && (
                <Alert
                  severity={message.type}
                  sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
                >
                  {message.text}
                </Alert>
              )}
            </>
          ) : (
            <>
              {/* Name Fields */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  {renderLabel("First Name")}
                  <TextField
                    name="firstName"
                    placeholder="Enter your First Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  {renderLabel("Last Name")}
                  <TextField
                    name="lastName"
                    placeholder="Enter your Last Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                {renderLabel("Mobile Number")}
                <TextField
                  name="mobile"
                  placeholder="Enter your Mobile Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={form.mobile}
                  onChange={handleChange}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                {renderLabel("Email")}
                <TextField
                  name="email"
                  placeholder="Enter your Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                />
              </Box>

              {/* Terms */}
              <Typography variant="caption" sx={{ mb: 2 }}>
                By creating an account, I accept the{" "}
                <Typography component="span" color="#FF6B00">
                  T&C & Privacy Policy
                </Typography>
              </Typography>

              {/* Send OTP */}
              <Button
                fullWidth
                sx={{
                  backgroundColor: "#FF6B00",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "12px",
                  borderRadius: "4px",
                  mb: 3,
                  "&:hover": { backgroundColor: "#e85f00" },
                }}
                endIcon={<span>&#8594;</span>}
                onClick={handleSendOtp}
              >
                Send One Time Password
              </Button>

              {/* Divider & Social */}
              <Divider sx={{ position: "relative", mb: 3 }}>
                <Typography
                  component="span"
                  sx={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#fff",
                    px: 1,
                    fontSize: "13px",
                    color: "#999",
                  }}
                >
                  OR
                </Typography>
              </Divider>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  startIcon={<GoogleIcon />}
                  sx={{
                    backgroundColor: "#34A853",
                    color: "#fff",
                    fontWeight: 500,
                    padding: "8px 16px",
                    flex: 1,
                    borderRadius: "4px",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Log In with Google
                </Button>
                <Button
                  startIcon={<FacebookIcon />}
                  sx={{
                    backgroundColor: "#1877F2",
                    color: "#fff",
                    fontWeight: 500,
                    padding: "8px 16px",
                    flex: 1,
                    borderRadius: "4px",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Log In with Facebook
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default SignUpPopup;