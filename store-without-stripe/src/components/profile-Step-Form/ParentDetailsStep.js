import React from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import stepOne from "../../../public/profileStepImages/stepOne.png";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  motherFirstName: yup.string().required("Mother first name is required"),
  motherLastName: yup.string().required("Mother last name is required"),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: yup.string().required("Residential address is required"),
});

const ParentDetailsStep = ({ formData, setFormData, nextStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    setFormData(data);
    nextStep();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 1, // reduced the spacing between image and form
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: { xs: "100%", md: "46%" }, // reduced from 48%
          backgroundImage: `url(${stepOne.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 400,
        }}
      />

      {/* Form Fields */}
      <Box sx={{ width: { xs: "100%", md: "46%" }, pr: { md: 2 } }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#000", mb: 0 }}
        >
          PARENT’S DETAILS:
        </Typography>
        <Divider
          sx={{ borderBottom: "1px solid #C0C0C0", mb: 2, width: "85%" }}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              PARENT FIRST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Parent First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              PARENT LAST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Parent Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          {/* NEW FIELDS: Mother First & Last Name */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              MOTHER FIRST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Mother First Name"
              {...register("motherFirstName")}
              error={!!errors.motherFirstName}
              helperText={errors.motherFirstName?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              MOTHER LAST NAME*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Mother Last Name"
              {...register("motherLastName")}
              error={!!errors.motherLastName}
              helperText={errors.motherLastName?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              MOBILE NUMBER*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Mobile Number"
              {...register("mobile")}
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              EMAIL*
            </Typography>
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              placeholder="Enter Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              RESIDENTIAL ADDRESS*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              maxRows={4}
              rows={5}
              placeholder="Enter your Residential Address"
              {...register("address")}
              sx={{
                width: "85%", // Decrease width
              }}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: "left" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#FF6A00",
              color: "#fff",
              px: 5,
              py: 1.5,
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 0,
              "&:hover": { backgroundColor: "#e65c00" },
            }}
          >
            Next ↗
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentDetailsStep;
