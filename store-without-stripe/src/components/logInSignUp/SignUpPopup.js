import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
import SignUpImage from "../../../public/LogInSignUp/signuppopimg.jpg";
import FreeTrialPopup from "../../components/home/FreeTrialPopup";
import useLoginSubmit from "@hooks/useLoginSubmit";


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
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    otp: "",
  });
  const otpRefs = useRef([]);
  const [freeTrialPopup, setFreeTrialPopup] = useState(false);
  const { submitHandler, loading } =
      useLoginSubmit();
  

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

  // Validation functions
  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z]+$/.test(name.trim());
  };

  const validateMobile = (mobile) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateOtp = (otp) => {
    return otp.length === 4 && /^\d+$/.test(otp);
  };

  const validateForm = () => {
    const newErrors = {
      firstName: !form.firstName.trim()
        ? "First name is required"
        : !validateName(form.firstName)
        ? "Minimum 2 letters, no numbers/special chars"
        : "",
      lastName: !form.lastName.trim()
        ? "Last name is required"
        : !validateName(form.lastName)
        ? "Minimum 2 letters, no numbers/special chars"
        : "",
      mobile: !form.mobile
        ? "Mobile number is required"
        : !validateMobile(form.mobile)
        ? "Please enter a valid 10-digit number"
        : "",
      email: !form.email
        ? "Email is required"
        : !validateEmail(form.email)
        ? "Please enter a valid email"
        : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const generateOtp = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
    setTimer(120);
    setResendEnabled(false);
    setMessage(null);
    setErrors({ ...errors, mobile: "" }); // Clear mobile error when OTP is sent
  };

  const handleSendOtp = async () => {
    if (validateForm()) {
        try {
            const res = await submitHandler({ phone: form.mobile, path: "signUp" });

            console.log('====================================');
            console.log("Full Response:", res); // Ensure the response is an object
           
            console.log('====================================');
            setOtp(res.otp)

            // generateOtp();
             setOtpSent(true);
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    }
};


  const handleResendOtp = () => {
    if (!validateMobile(form.mobile)) {
      setErrors({
        ...errors,
        mobile: "Please enter a valid 10-digit mobile number",
      });
      return;
    }
    generateOtp();
  };

  const handleVerifyOtp = async() => {
    if (!validateOtp(userOtp)) {
      setErrors({ ...errors, otp: "Please enter a valid 4-digit OTP" });
      return;
    }else{
      const res = await submitHandler({otp:userOtp, phone: form.mobile, path : "signUp-otp", email: form.email, firstName: form.firstName, lastName:form.lastName})
      console.log('====================================');
      console.log("verifyOtp---->", res);
      console.log('====================================');
    }

    // if (userOtp === otp) {
    //   setMessage({ type: "success", text: "OTP verified successfully!" });
    //   setErrors({ ...errors, otp: "" });
    //   setFreeTrialPopup(true)
    //   onClose()
    //   // Here you would typically proceed with registration
    // } else {
    //   setMessage({
    //     type: "error",
    //     text: "OTP is incorrect! Please try again.",
    //   });
    //   setErrors({ ...errors, otp: "Incorrect OTP" });
    // }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Input restrictions
    if (name === "mobile" && value && !/^[0-9]*$/.test(value)) return;
    if (
      (name === "firstName" || name === "lastName") &&
      value &&
      !/^[a-zA-Z ]*$/.test(value)
    )
      return;

    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
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
    <>
    <Dialog open={open} onClose={() => { onClose(); setOtpSent(false); setForm({ firstName: "", lastName: "", mobile: "", email: "", }); setUserOtp("");  setErrors({ firstName: "", lastName: "", mobile: "", email: "", otp: "", }); }} className="compopups" maxWidth="lg" fullWidth  sx={{'& .MuiDialog-paper': { height: '75vh', }}}>
      <Box className="flex relative h-full relative overflow-hidden">
        {/* Left Side Image */}
        <Box className="w-[50%]" sx={{backgroundImage: `url(${SignUpImage.src})`,backgroundSize: "cover",backgroundPosition: "center",}}/>

        {/* Right Side Form or OTP */}
        <Box className="w-[50%] p-[2.5vw] self-center signboxcol"
          sx={{
            bgcolor: "#fff",
          }}
        >

          <IconButton className="popClose"  onClick={() => { onClose(); setOtpSent(false); setForm({ firstName: "", lastName: "", mobile: "", email: "", }); setUserOtp(""); setErrors({ firstName: "", lastName: "", mobile: "", email: "", otp: "", }); }} sx={{ position: "absolute", top: 16, right: 16 }} >  <CloseIcon /> </IconButton>

          <div  className="poptitles">
          <Typography
            variant="h4"
            sx={{ textTransform: "uppercase", mb: 1 }}
          >
            {otpSent ? "Enter OTP" : "Sign Up"}
          </Typography>
          </div>
          {otpSent ? (
            <>
            <div className="sendotpbox">
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
                onClick={handleVerifyOtp}
              >
                {resendEnabled ? "Resend OTP" : "Verify One Time Password"}
              </Button>
              </div>
              <Typography className="ephonenolink"
                variant="body2"
                sx={{
                  mb: 3,
                  color: "#FF6B00",
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
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
              {/* Name Fields */}
              <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
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
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    inputProps={{ maxLength: 30 }}
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
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    inputProps={{ maxLength: 30 }}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 1 }}>
                {renderLabel("Mobile Number")}
                <TextField
                  name="mobile"
                  placeholder="Enter your Mobile Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={form.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  inputProps={{ maxLength: 10 }}
                />
              </Box>

              <Box sx={{ mb: 2}}>
                {renderLabel("Email")}
                <TextField
                  name="email"
                  placeholder="Enter your Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={form.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>

              {/* Terms */}
              <Typography variant="body2" sx={{ mb: 1 }} className="para-tcpp">
                By creating an account, I accept the{" "}
                <Link href="/" color="#FF6B00">
                  T&C & Privacy Policy
                </Link >
              </Typography>

              {/* Send OTP */}
              <Button  className="sotpbtn"
                fullWidth
                sx={{
                  backgroundColor: "#FF6B00",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e85f00" },
                }}
                onClick={handleSendOtp}
              >
                <span>Send One Time Password</span>
              </Button>
              </div>
              {/* Divider & Social */}
              {/* <Divider className="ordivider" sx={{ my: 2, position: "relative", paddingY: "15px" }}>
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
              </Divider> */}

              {/* Social Login Buttons */}
              {/* <Box className="wsmideabtn">
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
                  
                  
                </Box> */}
            </>
          )}
        </Box>
      </Box>
    </Dialog>
    <FreeTrialPopup
    open={freeTrialPopup}
    onClose={() => setFreeTrialPopup(false)}
  />
</>
  );
};

export default SignUpPopup;
