import React from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import stepTwo from "../../../public/profileStepImages/stepTwo.png";

const schema = yup.object().shape({
  childFirstName: yup.string().required("Child's first name is required"),
  childLastName: yup.string().required("Child's last name is required"),
  dob: yup.string().required("Date of Birth is required"),
  lunchTime: yup.string().required("Lunch time is required"),
  school: yup.string().required("School is required"),
  location: yup.string().required("Location is required"),
  childClass: yup.string().required("Child class is required"),
  section: yup.string().required("Section is required"),
  allergies: yup.string(),
});

const ChildDetailsStep = ({ childData, setChildData, nextStep, prevStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: childData,
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    setChildData(data);
    nextStep();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2, // space between the image and form fields
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "46%" },
          backgroundImage: `url(${stepTwo.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 400, // Adjust height as needed
        }}
      />

      {/* Form Section */}
      <Box sx={{ width: { xs: "100%", md: "54%" }, pr: { md: 2 } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", mb: 0 }}>
          CHILD 1:
        </Typography>
        <Divider sx={{ borderBottom: "1px solid #C0C0C0", mb: 3, width: "85%" }} />
        <Grid container spacing={2}>
          {/* Row 1: First Name & Last Name */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              CHILD'S FIRST NAME*
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Child's First Name"
              {...register("childFirstName")}
              error={!!errors.childFirstName}
              helperText={errors.childFirstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              CHILD'S LAST NAME*
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Child's Last Name"
              {...register("childLastName")}
              error={!!errors.childLastName}
              helperText={errors.childLastName?.message}
            />
          </Grid>

          {/* Row 2: DOB & Lunch Time */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              DATE OF BIRTH*
            </Typography>
            <TextField
              fullWidth
              placeholder="DD/MM/YYYY"
              {...register("dob")}
              error={!!errors.dob}
              helperText={errors.dob?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              CHILD'S LUNCH TIME*
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Select Lunch Time"
              {...register("lunchTime")}
              error={!!errors.lunchTime}
              helperText={errors.lunchTime?.message}
            >
              <MenuItem value="10:00 AM">10:00 AM</MenuItem>
              <MenuItem value="12:00 PM">12:00 PM</MenuItem>
              <MenuItem value="1:00 PM">1:00 PM</MenuItem>
            </TextField>
          </Grid>

          {/* Row 3: School & Location */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              SCHOOL*
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Select School"
              {...register("school")}
              error={!!errors.school}
              helperText={errors.school?.message}
            >
              <MenuItem value="Greenwood">Greenwood</MenuItem>
              <MenuItem value="Springfield">Springfield</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              LOCATION*
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Select Location"
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message}
            >
              <MenuItem value="Campus A">Campus A</MenuItem>
              <MenuItem value="Campus B">Campus B</MenuItem>
            </TextField>
          </Grid>

          {/* Row 4: Class & Section */}
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              CHILD CLASS*
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Select Class"
              {...register("childClass")}
              error={!!errors.childClass}
              helperText={errors.childClass?.message}
            >
              <MenuItem value="Nursery">Nursery</MenuItem>
              <MenuItem value="KG">KG</MenuItem>
              <MenuItem value="Grade 1">Grade 1</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              CHILD SECTION*
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Select Section"
              {...register("section")}
              error={!!errors.section}
              helperText={errors.section?.message}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </TextField>
          </Grid>

          {/* Row 5: Allergies (full width) */}
          <Grid item xs={12}>
            <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              DOES THE CHILD HAVE ANY ALLERGIES?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="If yes, please specify."
              {...register("allergies")}
              error={!!errors.allergies}
              helperText={errors.allergies?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={prevStep}>
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#FF6A00",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
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

export default ChildDetailsStep;
