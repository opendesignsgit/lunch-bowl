import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
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

const ChildDetailsStep = ({ formData, setFormData, nextStep, prevStep }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [children, setChildren] = useState(
    formData.children.length > 0
      ? formData.children
      : [
          {
            childFirstName: "",
            childLastName: "",
            dob: "",
            lunchTime: "",
            school: "",
            location: "",
            childClass: "",
            section: "",
            allergies: "",
          },
        ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm({
    defaultValues: children[activeTab],
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    reset(children[activeTab]);
  }, [activeTab]);

  useEffect(() => {
    const subscription = watch((values) => {
      setChildren((prevChildren) => {
        const updated = [...prevChildren];
        updated[activeTab] = { ...updated[activeTab], ...values };
        return updated;
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addChild = () => {
    const newChild = {
      childFirstName: "",
      childLastName: "",
      dob: "",
      lunchTime: "",
      school: "",
      location: "",
      childClass: "",
      section: "",
      allergies: "",
    };
    setChildren([...children, newChild]);
    setActiveTab(children.length);
  };

  const removeChild = (index) => {
    if (children.length === 1) return;
    const updatedChildren = children.filter((_, i) => i !== index);
    setChildren(updatedChildren);
    if (index === activeTab && activeTab > 0) {
      setActiveTab(activeTab - 1);
    } else if (index < activeTab) {
      setActiveTab(activeTab - 1);
    }
  };

  const onSubmit = () => {
    const validateAll = async () => {
      const results = await Promise.all(
        children.map((child) =>
          schema.validate(child, { abortEarly: false }).catch((err) => err)
        )
      );
      const hasErrors = results.some((res) => res.name === "ValidationError");
      if (hasErrors) {
        const firstInvalidIndex = results.findIndex(
          (res) => res.name === "ValidationError"
        );
        setActiveTab(firstInvalidIndex);
        return;
      }
      setFormData({ ...formData, children });
      nextStep();
    };
    validateAll();
  };

  const dropdownFields = [
    ["CHILD'S LUNCH TIME*", "lunchTime", "Select Lunch Time", ["10:00 AM", "12:00 PM", "1:00 PM"]],
    ["SCHOOL*", "school", "Select School", ["Greenwood", "Springfield"]],
    ["LOCATION*", "location", "Select Location", ["Campus A", "Campus B"]],
    ["CHILD CLASS*", "childClass", "Select Class", ["Nursery", "KG", "Grade 1"]],
    ["CHILD SECTION*", "section", "Select Section", ["A", "B", "C"]],
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}
    >
      {/* Image Side */}
      <Box
        sx={{
          width: { xs: "100%", md: "46%" },
          backgroundImage: `url(${stepTwo.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      />

      {/* Form Side */}
      <Box sx={{ width: { xs: "100%", md: "54%" } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0, paddingBottom: "20px" }}>
          CHILD DETAILS :
        </Typography>

        {/* Tabs */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: "auto",
              "& .MuiTab-root": {
                minHeight: "auto",
                py: 1,
                px: 2,
                fontSize: "0.875rem",
                textTransform: "none",
              },
            }}
          >
            {children.map((child, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>CHILD {index + 1}</Typography>
                    {children.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeChild(index);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
                sx={{
                  bgcolor: activeTab === index ? "#FF6A00" : "transparent",
                  color: activeTab === index ? "#fff" : "inherit",
                  borderRadius: 1,
                  mr: 1,
                }}
              />
            ))}
          </Tabs>
          <Button
            variant="outlined"
            onClick={addChild}
            sx={{
              ml: 2,
              px: 2,
              py: 1,
              borderRadius: 0,
              borderColor: "#FF6A00",
              color: "#FF6A00",
              "&:hover": {
                borderColor: "#FF6A00",
                backgroundColor: "rgba(255, 106, 0, 0.08)",
              },
            }}
          >
            Add Child
          </Button>
        </Box>

        <Divider sx={{ borderBottom: "1px solid #C0C0C0", mb: 3, width: "85%" }} />

        <Grid container spacing={2}>
          {/* Text Inputs */}
          {[
            ["CHILD'S FIRST NAME*", "childFirstName", "Enter Child's First Name"],
            ["CHILD'S LAST NAME*", "childLastName", "Enter Child's Last Name"],
            ["DATE OF BIRTH*", "dob", "DD/MM/YYYY"],
          ].map(([label, name, placeholder]) => (
            <Grid item xs={12} sm={6} key={name}>
              <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>{label}</Typography>
              <TextField
                fullWidth
                placeholder={placeholder}
                {...register(name)}
                error={!!errors[name]}
                helperText={errors[name]?.message}
                sx={{ width: "300px", minWidth: "300px" }}
              />
            </Grid>
          ))}

          {/* Dropdowns */}
          {dropdownFields.map(([label, name, placeholder, options]) => (
            <Grid item xs={12} sm={6} key={name}>
              <Typography sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>{label}</Typography>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label={placeholder}
                    {...field}
                    error={!!errors[name]}
                    helperText={errors[name]?.message}
                    sx={{ width: "300px", minWidth: "300px" }}
                  >
                    <MenuItem value="" disabled>
                      {placeholder}
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          ))}

          {/* Allergies */}
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
              sx={{ width: "625px", minWidth: "625px" }}
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
              "&:hover": {
                backgroundColor: "#e65c00",
              },
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
