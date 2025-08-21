import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  IconButton,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import LogIn from "../../../public/LogInSignUp/LogIn.jpg";

const GetinTouch = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  // Reset form and errors whenever dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        message: "",
      });
      setErrors({});
    }
  }, [open]);

  // Validation (message now optional)
  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required!";
    if (!formData.email.trim()) {
      errs.email = "Email is required!";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      errs.email = "Enter a valid email.";
    }
    if (!formData.mobile.trim()) {
      errs.mobile = "Mobile Number is required!";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errs.mobile = "Enter a valid 10-digit mobile number.";
    }
    // message is optional, no error
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currErrs = validate();
    setErrors(currErrs);
    if (Object.keys(currErrs).length > 0) return;

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const enquiryData = {
        firstName,
        lastName,
        mobileNumber: formData.mobile,
        schoolName: "General Enquiry", // Using a distinguishable name
        message: formData.message,
        email: formData.email,
      };

      await axios.post(
        "http://localhost:5055/api/admin/school-enquiry",
        enquiryData
      );

      alert("Thank you for your enquiry! We'll get back to you soon.");
      onClose();
      // Reset handled by useEffect on close/open
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        className="gintpopus compopups"
        sx={{
          "& .MuiDialog-paper": {
            height: "auto",
          },
        }}
      >
        <IconButton
          className="popClose"
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 99 }}
        >
          <CloseIcon />
        </IconButton>
        <Box className="gintPopBox gintPopRow Box flex bg-white relative h-full">
          <Box
            className="w-[50%] gintPopCol gintLCol"
            sx={{
              backgroundImage: `url(${LogIn.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Box>
          <Box className="w-[50%] gintPopCol gintRCol self-center logboxcol p-[3vw]">
            <div className="gintPinRow">
              <Box sx={{ textAlign: "left", marginBottom: "24px" }} className="poptitles">
                <Typography variant="h4" color="#000" sx={{ textTransform: "uppercase", marginBottom: "4px" }} > ! NEED TO CLEAR YOUR QUIRIES? !   </Typography>
                <p>We are here to lend hands from order details to partnership opportunities our team will reach you promptly.</p>
              </Box>
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  margin="normal"
                  variant="outlined"
                  placeholder="Joe Bloggs"
                  className="fieldbox"
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  variant="outlined"
                  placeholder="example@domain.com"
                  className="fieldbox"
                />
                <TextField
                  fullWidth
                  id="mobile"
                  name="mobile"
                  label="Mobile Number"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  margin="normal"
                  variant="outlined"
                  placeholder="1234567890"
                  className="fieldbox"
                />
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label="Message"
                  type="text"
                  value={formData.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  helperText={errors.message}
                  margin="normal"
                  variant="outlined"
                  placeholder="Message"
                  className="fieldbox"
                />
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    mt: 3,
                    backgroundColor: "#ff6514",
                    "&:hover": {
                      backgroundColor: "#e55c12", // Slightly darker on hover
                    },
                  }}
                >
                  Submit
                </Button>
              </form>
            </div>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default GetinTouch;