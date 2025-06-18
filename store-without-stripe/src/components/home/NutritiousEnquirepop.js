import React, { useState } from "react";
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

const NutritiousEnquire = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Split fullName into firstName and lastName for the API
      const [firstName, ...lastNameParts] = formData.fullName.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const enquiryData = {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: formData.mobile,
        schoolName: "Nutrition Enquiry", // Using this as identifier in email
        message: formData.message,
        email: formData.email, // Adding email since your form has it
      };

      await axios.post(
        "http://localhost:5055/api/admin/school-enquiry", // Using same endpoint
        enquiryData
      );

      alert("Thank you for your enquiry! We'll get back to you soon.");
      onClose();
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        message: "",
      });
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
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className="nutripopup compopups"
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
          {" "}
          <CloseIcon />{" "}
        </IconButton>
        <Box className="nutriPopBox Box flex bg-white relative h-full">
          <Box
            className="w-[50%]"
            sx={{
              backgroundImage: `url(/LogInSignUp/signuppopimg.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></Box>
          <Box className="w-[50%] self-center logboxcol p-[3vw]">
            <Box
              sx={{ textAlign: "left", marginBottom: "24px" }}
              className="poptitles"
            >
              <Typography
                variant="h4"
                color="#000"
                sx={{ textTransform: "uppercase", marginBottom: "4px" }}
              >
                {" "}
                Nutritious Enquire{" "}
              </Typography>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.{" "}
              </p>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
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
                margin="normal"
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
                margin="normal"
                placeholder="1234567890"
                className="fieldbox"
              />
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Message"
                type="tel"
                value={formData.message}
                onChange={handleChange}
                margin="normal"
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
                    backgroundColor: "#e55c12",
                  },
                }}
              >
                Sign Up
              </Button>
            </form>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default NutritiousEnquire;
