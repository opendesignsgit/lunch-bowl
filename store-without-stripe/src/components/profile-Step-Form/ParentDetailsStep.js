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
import  useRegistration  from "@hooks/useRegistration";


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
});

const ParentDetailsStep = ({ formData, setFormData, nextStep, _id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const { submitHandler, loading } =
  useRegistration();

  const onSubmit = async(data) => {
    console.log("Form data submitted:", data);
    const res = await submitHandler({
      formData: data,
      step: 1,
      path: "step-Form-ParentDetails",
      _id,
    });
    if(res){
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
          <Button className="subbtn nextbtn" type="submit" variant="contained">
            {" "}
            <span className="nextspan">Next</span>{" "}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ParentDetailsStep;
