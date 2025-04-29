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
import LogIn from "../../../public/LogInSignUp/LogIn.jpg";
import SignUpPopup from "./SignUpPopup";

const LoginPopup = ({ open, onClose }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [timer, setTimer] = useState(120);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({
    mobileNumber: "",
    otp: "",
  });
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

  const validateMobileNumber = (number) => {
    // Basic validation - 10 digits, numbers only
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const validateOtp = (otp) => {
    // OTP should be exactly 4 digits
    return otp.length === 4 && /^\d+$/.test(otp);
  };

  const generateOtp = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
    setTimer(120);
    setResendEnabled(false);
    setMessage(null);
    setErrors({ ...errors, mobileNumber: "" });
  };

  const handleSendOtp = () => {
    if (!mobileNumber) {
      setErrors({ ...errors, mobileNumber: "Mobile number is required" });
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      setErrors({
        ...errors,
        mobileNumber: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    generateOtp();
    setOtpSent(true);
  };

  const handleResendOtp = () => {
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({
        ...errors,
        mobileNumber: "Please enter a valid 10-digit mobile number",
      });
      return;
    }
    generateOtp();
  };

  const handleVerifyOtp = () => {
    if (!validateOtp(userOtp)) {
      setErrors({ ...errors, otp: "Please enter a valid 4-digit OTP" });
      return;
    }

    if (userOtp === otp) {
      setMessage({ type: "success", text: "OTP is correct!" });
      setErrors({ ...errors, otp: "" });
    } else {
      setMessage({
        type: "error",
        text: "OTP is incorrect! Please try again.",
      });
      setErrors({ ...errors, otp: "Incorrect OTP" });
    }
  };

  const handleCloseSignUp = () => {
    setShowSignUp(false);
  };

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^[0-9]$/.test(value)) return;

    const otpArray = userOtp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setUserOtp(newOtp);

    // Clear error when user starts typing
    if (errors.otp && newOtp.length > 0) {
      setErrors({ ...errors, otp: "" });
    }

    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && event.target.value === "") {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value && !/^[0-9]*$/.test(value)) return;

    setMobileNumber(value);

    // Clear error when user starts typing
    if (errors.mobileNumber && value.length > 0) {
      setErrors({ ...errors, mobileNumber: "" });
    }
  };
  return (
    <>
      <Dialog className="compopups" open={open} onClose={() => { onClose(); setOtpSent(false); setMobileNumber(""); setUserOtp(""); setErrors({ mobileNumber: "", otp: "" }); }} maxWidth="lg" fullWidth  sx={{
    '& .MuiDialog-paper': {
      height: '75vh',
    }
  }}>
        <Box className="flex relative h-full  relative overflow-hidden">
          {/* Left Side Image */}
          <Box className="w-[50%]" sx={{ backgroundImage: `url(${LogIn.src})`, backgroundSize: "cover", backgroundPosition: "center", }} />
          {/* Right Side Form */}
          <Box className="w-[50%] p-[2.5vw] self-center logboxcol">
            {/* Close Icon */}
               <IconButton className="popClose" onClick={() => { onClose(); setOtpSent(false); setMobileNumber(""); setUserOtp(""); setErrors({ mobileNumber: "", otp: "" }); }} sx={{ position: "absolute", top: 16, right: 16 }} > <CloseIcon />  </IconButton>

            {/* Title and Create Account */}
            <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
              <Typography variant="h4" color="#000"  sx={{ textTransform: "uppercase", marginBottom: "4px" }} > {otpSent ? "Enter OTP" : "Log In"}  </Typography>
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
                <>
                  <Typography variant="body2" mt={1}>
                    We've sent an OTP to your phone number.
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    mb={1}
                    sx={{ color: "#FF6B00" }}
                  >
                    Your OTP: {otp}
                  </Typography>
                </>
              )}
            </Box>

            {/* Conditional Form */}
            {otpSent ? (
              <>
              <div className="sendotpbox">
                <Typography
                  variant="h6"
                  mb={1}
                  sx={{ color: "#FF6B00" }}
                >
                  ONE TIME PASSWORD*
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
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
                      error={!!errors.otp}
                    />
                  ))}
                </Box>
                {errors.otp && (
                  <Typography color="error" variant="caption" sx={{ mb: 2 }}>
                    {errors.otp}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  mb={2}
                >
                  Time remaining: {Math.floor(timer / 60)}:
                  {timer % 60 < 10 ? "0" : ""}
                  {timer % 60} minutes
                </Typography>
                <div className="resendbtn">
                  <Button
                    fullWidth
                    sx={{
                      backgroundColor: resendEnabled ? "#FF6B00" : "#e85f00",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#e85f00" },
                    }}
                    onClick={resendEnabled ? handleResendOtp : handleVerifyOtp}
                  >
                    {resendEnabled ? "Resend OTP" : "Verify One Time Password"}
                  </Button>
                </div>
                <Typography className="ephonenolink"
                  variant="body2"
                  onClick={() => setOtpSent(false)}
                >
                  Edit phone number
                </Typography>

                {/* Success/Error Message */}
                {message && (
                  <Alert
                    severity={message.type}
                    sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
                  >
                    {message.text}
                  </Alert>
                )}
                </div>
              </>
            ) : (
              <>
              <div className="loginfiledss">
                <Typography
                  variant="h6"
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
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  inputProps={{
                    maxLength: 10,
                  }}
                  sx={{ mb: 2 }}
                />
                <Button className="sotpbtn"
                  fullWidth
                  sx={{
                    backgroundColor: "#FF6B00",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "12px",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#e85f00" },
                  }}
                  onClick={handleSendOtp}
                >
                  <span>Send One Time Password</span>
                </Button>
                </div>
              </>
            )}

            {/* Divider */}
            {!otpSent && (
              <>
                <Divider className="ordivider" sx={{ my: 3, position: "relative", paddingY: "20px" }}>
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
                <Box className="wsmideabtn">
                  <ul className="flex gap-2">
                    <li className="flex-1">
                      <Button className="gglebtn"
                    startIcon={<GoogleIcon />}
                    sx={{
                      backgroundColor: "#34A853",
                      color: "#fff",
                    }}
                  >
                    <span>Log In with Google</span>
                  </Button></li>
                    <li className="flex-1"><Button className="fbookbtn"
                    startIcon={<FacebookIcon />}
                    sx={{
                      backgroundColor: "#1877F2",
                      color: "#fff",
                    }}
                  >
                    <span>Log In with Facebook</span>
                  </Button></li>
                  </ul>
                  
                  
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
