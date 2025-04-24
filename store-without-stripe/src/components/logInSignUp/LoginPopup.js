import React, { useState, useRef } from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LogIn from "../../../public/LogInSignUp/LogIn.png";
import SignUpPopup from "./SignUpPopup";

const LoginPopup = ({ open, onClose }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const otpRefs = useRef([]);

  const handleCloseSignUp = () => {
    setShowSignUp(false);
  };

  const handleOtpChange = (index, value) => {
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus(); // Move focus to the next field
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && event.target.value === "") {
      otpRefs.current[index - 1].focus(); // Move focus to the previous field
    }
  };

  return (
    <>
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
              backgroundImage: `url(${LogIn.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Right Side Form */}
          <Box
            sx={{
              width: "50%",
              padding: "55px",
              paddingTop: "8%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              bgcolor: "#fff",
            }}
          >
            {/* Close Icon */}
            <IconButton
              onClick={() => {
                onClose();
                setOtpSent(false);
              }}
              sx={{ position: "absolute", top: 16, right: 16 }}
            >
              <CloseIcon />
            </IconButton>

            {/* Title and Create Account */}
            <Box sx={{ textAlign: "left", marginBottom: "24px" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="#000"
                sx={{ textTransform: "uppercase", marginBottom: "4px" }}
              >
                {otpSent ? "Enter OTP" : "Log In"}
              </Typography>
              {!otpSent && (
                <Typography variant="body2">
                  or{" "}
                  <Typography
                    component="span"
                    color="#FF6B00"
                    fontWeight="500"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowSignUp(true)}
                  >
                    Create an Account
                  </Typography>
                </Typography>
              )}
              {otpSent && (
                <Typography variant="body2" mt={1}>
                  We've sent an OTP to your phone number.
                </Typography>
              )}
            </Box>

            {/* Conditional Form */}
            {otpSent ? (
              <>
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
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#FF6B00",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#e85f00" },
                  }}
                  endIcon={<span>&#8594;</span>}
                >
                  Verify One Time Password
                </Button>
              </>
            ) : (
              <>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  mb={1}
                  sx={{ color: "#FF6B00" }}
                >
                  MOBILE NUMBER*
                </Typography>
                <TextField
                  placeholder="Enter your Mobile Number"
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#FF6B00",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#e85f00" },
                  }}
                  endIcon={<span>&#8594;</span>}
                  onClick={() => setOtpSent(true)}
                >
                  Send One Time Password
                </Button>
              </>
            )}

            {/* Divider */}
            {!otpSent && (
              <>
                <Divider sx={{ my: 3, position: "relative", paddingY: "20px" }}>
                  <Typography
                    component="span"
                    sx={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#fff",
                      px: 1,
                      fontSize: "14px",
                      color: "#666",
                      paddingY: "20px",
                    }}
                  >
                    OR
                  </Typography>
                </Divider>

                {/* Social Login Buttons */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    startIcon={<GoogleIcon />}
                    sx={{
                      backgroundColor: "#34A853",
                      color: "#fff",
                      fontWeight: 500,
                      padding: "8px 16px",
                      minWidth: "180px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
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
                      minWidth: "180px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
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

      {/* Sign Up Popup */}
      <SignUpPopup open={showSignUp} onClose={handleCloseSignUp} />
    </>
  );
};

export default LoginPopup;
