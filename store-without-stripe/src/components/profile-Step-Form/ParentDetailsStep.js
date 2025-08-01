import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import stepOne from "../../../public/profileStepImages/stepOne.png";
import useRegistration from "@hooks/useRegistration";
import pinCodeData from "../../jsonHelper/zipcode.json"; // Import your JSON data

const schema = yup.object().shape({
  fatherFirstName: yup.string().required("First name is required"),
  fatherLastName: yup.string().required("Last name is required"),
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
  pincode: yup.string().required("Pincode is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
});

const ParentDetailsStep = ({ formData, setFormData, nextStep, _id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      ...formData,
      country: "India", // Set default country
    },
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const { submitHandler, loading } = useRegistration();
  const [pinCodes, setPinCodes] = useState([]);

  // Load pin codes from JSON data
  useEffect(() => {
    setPinCodes(pinCodeData);
  }, []);

  // Watch for pincode changes to auto-fill other fields
  const selectedPincode = watch("pincode");
  useEffect(() => {
    if (selectedPincode) {
      const selectedLocation = pinCodes.find(
        (item) => item.Pincode === selectedPincode
      );
      if (selectedLocation) {
        setValue("city", selectedLocation.City);
        setValue("state", selectedLocation.State);
        setValue("country", "India"); // Always set country to India
      }
    }
  }, [selectedPincode, pinCodes, setValue]);

  const onSubmit = async (data) => {
    console.log("Form data submitted:", data);
    const res = await submitHandler({
      formData: data,
      step: 1,
      path: "step-Form-ParentDetails",
      _id,
    });
    if (res) {
      setFormData(data);
      nextStep();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
          backgroundImage: `url(${stepOne.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      />

      {/* Form Fields */}
      <Box sx={{ width: { xs: "100%", md: "55%" } }}>
        <div className="steptitles">
          <Typography variant="h5">PARENT'S DETAILS:</Typography>
        </div>

        <Grid className="formboxrow" container spacing={2}>
          {/* Parent Names */}
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              {" "}
              FATHER FIRST NAME*{" "}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Parent First Name"
              {...register("fatherFirstName")}
              error={!!errors.fatherFirstName}
              helperText={errors.fatherFirstName?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              {" "}
              FATHER LAST NAME*{" "}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Parent Last Name"
              {...register("fatherLastName")}
              error={!!errors.fatherLastName}
              helperText={errors.fatherLastName?.message}
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          {/* Mother Names */}
          <Grid className="formboxcol" item xs={12} sm={6}>
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
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
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
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          {/* Contact Info */}
          <Grid className="formboxcol" item xs={12} sm={6}>
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
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
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
              sx={{ width: "300px", minWidth: "300px" }}
            />
          </Grid>
          {/* Address (full width) */}
          {/* <Grid className="formboxcol" item xs={12}>
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
              sx={{ width: "625px", minWidth: "625px" }}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid> */}
          {/* New Address Fields */}
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              PINCODE*
            </Typography>
            <TextField
              select
              fullWidth
              variant="outlined"
              placeholder="Select Pincode"
              {...register("pincode")}
              error={!!errors.pincode}
              helperText={errors.pincode?.message}
              sx={{ width: "300px", minWidth: "300px" }}
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Limit dropdown height
                    },
                  },
                },
              }}
            >
              {pinCodes.map((option) => (
                <MenuItem key={option.Pincode} value={option.Pincode}>
                  {option.Pincode}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              CITY*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="City will auto-fill"
              {...register("city")}
              error={!!errors.city}
              helperText={errors.city?.message}
              sx={{
                width: "300px",
                minWidth: "300px",
                "& .MuiInputBase-input": {
                  color: (theme) => theme.palette.text.disabled, // Grey text color
                },
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              STATE*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="State will auto-fill"
              {...register("state")}
              error={!!errors.state}
              helperText={errors.state?.message}
              sx={{
                width: "300px",
                minWidth: "300px",
                "& .MuiInputBase-input": {
                  color: (theme) => theme.palette.text.disabled, // Grey text color
                },
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid className="formboxcol" item xs={12} sm={6}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}
            >
              COUNTRY*
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="India"
              defaultValue="India"
              {...register("country")}
              error={!!errors.country}
              helperText={errors.country?.message}
              sx={{
                width: "300px",
                minWidth: "300px",
                "& .MuiInputBase-input": {
                  color: (theme) => theme.palette.text.disabled, // Grey text color
                },
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">🇮🇳</InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Address (full width) */}
          <Grid className="formboxcol" item xs={12}>
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
              sx={{ width: "625px", minWidth: "625px" }}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
        </Grid>

        <Box className="subbtnrow">
          <Button
            className="subbtn nextbtn"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Processing..." : <span className="nextspan">Next</span>}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentDetailsStep;
