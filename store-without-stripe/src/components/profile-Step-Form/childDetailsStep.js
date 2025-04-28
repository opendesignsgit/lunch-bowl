import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import stepTwo from "../../../public/profileStepImages/stepTwo.png";

// Validation schema
const schema = yup.object().shape({
  childFirstName: yup.string().required("Child's first name is required"),
  childLastName: yup.string().required("Child's last name is required"),
  dob: yup.date().nullable().required("Date of Birth is required"),
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
            dob: null,
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
      dob: null,
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
    ["CHILD'S LUNCH TIME*", "lunchTime", "Select Lunch Time", ["12:30 PM", "1:00 PM", ":30 PM"]],
    [
      "SCHOOL*", 
      "school", 
      "Select School", 
      [
        "Akshar Arbol International School",
        "Asan Memorial Senior Secondary School",
        "D.A.V. Public School",
        "Don Bosco Matriculation Higher Secondary School",
        "Holy Angels Anglo Indian Higher Secondary School",
        "KC High School",
        "MCTM International School",
        "P.S. Higher Secondary School",
        "Padma Seshadri Bala Bhavan School",
        "Sishya School",
        "St. Patrick's Anglo Indian Higher Secondary School",
        "Vidya Mandir Senior Secondary School, Mylapore",
        "Bala Vidya Mandir",
        "Sharanalaya Montessori School",
        "Chetinad Harishree Vidyalayam",
        "Vidyodaya School",
        "Sprouts",
        "St Michael Academy",
        "Accord International School",
        "St Johns English School"
      ]
    ],
    
    ["LOCATION*", "location", "Select Location", ["Ambattur", "Pammal","Kotturpuram","Porur"]],
    ["CHILD CLASS*", "childClass", "Select Class", ["LKG", "UKG", "Grade 1","Grade 2","Grade 3","Grade 4"]],
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
          width: { xs: "100%", md: "45%" },
          backgroundImage: `url(${stepTwo.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          minHeight: 500,
        }}
      />

      {/* Form Side */}
      <Box sx={{ width: { xs: "100%", md: "55%" } }}>
        <div className="steptitles">
          <Typography variant="h5">CHILD DETAILS :</Typography>

          {/* Tabs */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }} className="adchildnav">
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" className="adchildul">
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
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  }
                  sx={{
                    bgcolor: activeTab === index ? "#FF6A00" : "transparent",
                    color: activeTab === index ? "#fff" : "inherit",
                  }}
                />
              ))}
            </Tabs>
            <Button variant="outlined" onClick={addChild} className="addanochildbtn">
              Add Another Child
            </Button>
          </Box>
        </div>

        <Grid container className="formboxrow">
          {/* Text Inputs */}
          {[
            ["CHILD'S FIRST NAME*", "childFirstName", "Enter Child's First Name"],
            ["CHILD'S LAST NAME*", "childLastName", "Enter Child's Last Name"],
          ].map(([label, name, placeholder]) => (
            <Grid item className="formboxcol" key={name}>
              <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
                {label}
              </Typography>
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

          {/* Date Picker */}
          <Grid item className="formboxcol" key="dob">
            <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              DATE OF BIRTH*
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        error={!!errors.dob}
                        helperText={errors.dob?.message}
                        sx={{ width: "300px", minWidth: "300px" }}
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* Dropdowns */}
          {dropdownFields.map(([label, name, placeholder, options]) => (
  <Grid item className="formboxcol" key={name}>
    <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>{label}</Typography>
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
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 200, // This will show about 4-5 items depending on their height
                  overflow: 'auto',
                },
              },
            },
          }}
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
          <Grid item className="formboxcol">
            <Typography variant="subtitle2" sx={{ color: "#FF6A00", fontWeight: 600, mb: 1 }}>
              DOES THE CHILD HAVE ANY ALLERGIES?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="If yes, please specify."
              {...register("allergies")}
              error={!!errors.allergies}
              helperText={errors.allergies?.message}
              sx={{ width: "625px", minWidth: "625px" }}
            />
          </Grid>

        </Grid>

        <Box className="subbtnrow" sx={{ mt: 4, display: "flex", gap:  3}}>
          <Button variant="outlined" onClick={prevStep} className="backbtn"> <span className="nextspan">Back</span> </Button>
          <Button type="submit" variant="contained" className="nextbtn"> <span className="nextspan">Next</span> </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChildDetailsStep;
