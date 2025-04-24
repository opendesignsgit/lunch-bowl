import React, { useState } from "react";
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
import SignUpImage from "../../../public/LogInSignUp/LogIn.png"; // Use your actual signup image here

const SignUpPopup = ({ open, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

        {/* Right Side Form */}
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
          

          <Typography variant="h4" fontWeight="bold" sx={{ textTransform: "uppercase" }}>
            Sign Up
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
            or{" "}
            <Typography
              component="span"
              color="#FF6B00"
              fontWeight="500"
              sx={{ cursor: "pointer" }}
              onClick={onClose}
            >
              Log In to your Account
            </Typography>
          </Typography>

          {/* Form Fields */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              name="firstName"
              placeholder="Enter your First Name"
              variant="outlined"
              size="small"
              fullWidth
              value={form.firstName}
              onChange={handleChange}
            />
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
          <TextField
            name="mobile"
            placeholder="Enter your Mobile Number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
            value={form.mobile}
            onChange={handleChange}
          />
          <TextField
            name="email"
            placeholder="Enter your Email"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ mb: 3 }}
            value={form.email}
            onChange={handleChange}
          />

          {/* T&C */}
          <Typography variant="caption" sx={{ mb: 2 }}>
            By creating an account, I accept the{" "}
            <Typography component="span" color="#FF6B00">
              T&C & Privacy Policy
            </Typography>
          </Typography>

          {/* Submit Button */}
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
          >
            Send One Time Password
          </Button>

          {/* Divider */}
          <Divider sx={{ position: "relative", mb: 3 }}>
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
              }}
            >
              OR
            </Typography>
          </Divider>

          {/* Social Buttons */}
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
                "&:hover": { opacity: 0.9 },
              }}
            >
              Log In with Facebook
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SignUpPopup;
