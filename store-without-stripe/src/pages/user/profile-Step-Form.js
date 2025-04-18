import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import ParentDetailsStep from "../../components/profile-Step-Form/ParentDetailsStep";
import ChildDetailsStep from "../../components/profile-Step-Form/childDetailsStep";

const StepHeader = ({ step }) => {
  const labels = [
    "PARENT’S DETAILS",
    "CHILDREN’S DETAILS",
    "SUBSCRIPTION PLAN",
    "PAYMENT",
  ];

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          columnGap: 8,
          rowGap: 0,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {labels.map((label, index) => (
          <Box
            key={index}
            sx={{
              px: 2,
              py: 1,
              bgcolor: step === index + 1 ? "#FF6A00" : "transparent",
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                color: step === index + 1 ? "#fff" : "#C0C0C0",
                fontSize: "1rem",
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ width: "75%", mx: "auto", mt: 2, paddingBottom: "30px" }}>
        <Divider
          sx={{
            borderStyle: "dotted",
            borderColor: "#C0C0C0",
            borderWidth: "1px",
          }}
        />
      </Box>
    </Box>
  );
};

const MultiStepForm = () => {
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    motherFirstName: "",
    motherLastName: "",
    mobile: "",
    email: "",
    address: "",
    children: [], // assuming an array of child objects
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <StepHeader step={step} />

        {step === 1 && (
          <ParentDetailsStep
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        )}

        {step === 2 && (
          <ChildDetailsStep
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}

        {/* Steps 3 and 4 would go here */}
      </Box>
    </Box>
  );
};

export default MultiStepForm;
