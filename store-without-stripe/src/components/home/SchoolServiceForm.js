import React, { useState } from 'react';
import Image from "next/image";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography, Box} from '@mui/material';
import addSchoolPopUp from "../../../public/home/ready-to-serve-your-school.jpg";
import closeicon from "../../../public/menuclose-icon.svg";
import axios from "axios";

const SchoolServiceForm = ({ prefillSchool, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    schoolName: prefillSchool || "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (!formData.schoolName.trim())
      newErrors.schoolName = "School name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5055/api/admin/school-enquiry",
        formData
      );
      // Optionally show success toast/message here
      onClose();
    } catch (err) {
      // Optionally show error toast/message here
      alert("There was an error submitting the form. Please try again.");
    }
  };

  return (
    <Dialog
      className="compopup ssrpopups"
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          border: "5px solid #fff",
          maxWidth: "55vw",
        },
      }}
    >
      <Box sx={{ display: "flex", height: "100%" }}>
        <button className="popclosebtn" onClick={onClose}>
          <Image src={closeicon} alt="" />
        </button>

        {/* Left Side - Image Section */}
        <Box
          sx={{
            width: "45%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8fafc",
            overflow: "hidden",
          }}
        >
          <Image
            src={addSchoolPopUp}
            alt="School Service Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Right Side - Form */}
        <Box sx={{ width: "55%", p: 4 }}>
          <DialogTitle
            className="comffamily"
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              px: 0,
              pt: 0,
              color: "#1e293b",
            }}
          >
            {" "}
            Ready to Serve Your School!{" "}
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <form onSubmit={handleSubmit}>
              {/* FIRST NAME & LAST NAME */}
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    className="comffamily"
                    variant="subtitle2"
                    sx={{ fontWeight: "600", mb: 1, color: "#f97316" }}
                  >
                    {" "}
                    FIRST NAME*{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    placeholder="Enter your First Name"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    className="comffamily"
                    variant="subtitle2"
                    sx={{ fontWeight: "600", mb: 1, color: "#f97316" }}
                  >
                    {" "}
                    LAST NAME*{" "}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    placeholder="Enter your Last Name"
                  />
                </Box>
              </Box>

              {/* MOBILE NUMBER */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  className="comffamily"
                  variant="subtitle2"
                  sx={{ fontWeight: "600", mb: 1, color: "#f97316" }}
                >
                  {" "}
                  MOBILE NUMBER*{" "}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber}
                  placeholder="Enter your Mobile Number"
                />
              </Box>

              {/* SCHOOL NAME */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  className="comffamily"
                  variant="subtitle2"
                  sx={{ fontWeight: "600", mb: 1, color: "#f97316" }}
                >
                  {" "}
                  SCHOOL NAME*{" "}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  error={!!errors.schoolName}
                  helperText={errors.schoolName}
                  placeholder="Enter your School Name"
                />
              </Box>

              {/* MESSAGE */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  className="comffamily"
                  variant="subtitle2"
                  sx={{ mb: 1, color: "#f97316" }}
                >
                  {" "}
                  MESSAGE{" "}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Feel free to type here if you'd like to share something with us."
                />
              </Box>

              {/* SUBMIT */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#f97316",
                  color: "white",
                  "&:hover": { backgroundColor: "#ea580c" },
                  borderRadius: "8px",
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                {" "}
                Submit Request{" "}
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SchoolServiceForm;
