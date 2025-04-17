import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import stepOne from "../../../public/profileStepImages/stepOne.png"; 

const ParentDetailsStep = ({ formData, setFormData, nextStep }) => {
  return (
    <Box>
      {/* Title above form */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
      >
        PARENT’S DETAILS:
      </Typography>
      {/* Solid line under title */}
      <Divider sx={{ borderBottom: "2px solid #000", mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#FF6A00", fontWeight: 600 }}
          >
            PARENT FIRST NAME*
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Parent First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#FF6A00", fontWeight: 600 }}
          >
            PARENT LAST NAME*
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Parent Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#FF6A00", fontWeight: 600 }}
          >
            MOBILE NUMBER*
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Mobile Number"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#FF6A00", fontWeight: 600 }}
          >
            EMAIL*
          </Typography>
          <TextField
            fullWidth
            type="email"
            variant="outlined"
            placeholder="Enter Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#FF6A00", fontWeight: 600 }}
          >
            RESIDENTIAL ADDRESS*
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your Residential Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 6, textAlign: "left" }}>
        <Button
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
          onClick={nextStep}
        >
          Next ↗
        </Button>
      </Box>
    </Box>
  );
};

const StepHeader = ({ step }) => (
  <Box
    sx={{
      display: "flex",
      columnGap: 8,
      rowGap: 0,
      flexWrap: "wrap",
      justifyContent: "center",
      mb: 2,
    }}
  >
    <Box
      sx={{
        px: 2,
        py: 1,
        bgcolor: step === 1 ? "#FF6A00" : "transparent",
        borderRadius: 1,
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          color: step === 1 ? "#fff" : "#C0C0C0",
          fontSize: "1rem",
        }}
      >
        PARENT’S DETAILS
      </Typography>
    </Box>
    <Box
      sx={{
        px: 2,
        py: 1,
        bgcolor: step === 2 ? "#FF6A00" : "transparent",
        borderRadius: 1,
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          color: step === 2 ? "#fff" : "#C0C0C0",
          fontSize: "1rem",
        }}
      >
        CHILDREN’S DETAILS
      </Typography>
    </Box>
    <Box sx={{ px: 2, py: 1 }}>
      <Typography
        sx={{ fontWeight: "bold", color: "#C0C0C0", fontSize: "1rem" }}
      >
        SUBSCRIPTION PLAN
      </Typography>
    </Box>
    <Box sx={{ px: 2, py: 1 }}>
      <Typography
        sx={{ fontWeight: "bold", color: "#C0C0C0", fontSize: "1rem" }}
      >
        PAYMENT
      </Typography>
    </Box>
    {/* Dotted line under the step header */}
    <Box sx={{ width: "80%", mt: 2 }}>
      <Divider sx={{ borderStyle: "dotted", borderColor: "#C0C0C0" }} />
    </Box>
  </Box>
);

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    address: "",
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <StepHeader step={step} />
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          {/* Left Section with Image */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              backgroundImage: `url(${stepOne.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              minHeight: 400,
            }}
          />

          {/* Right Section with Form */}
          <Box sx={{ width: { xs: "100%", md: "50%" }, px: 4, pt: 4 }}>
            {step === 1 && (
              <ParentDetailsStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
              />
            )}

            {step === 2 && (
              <Box>
                <Typography variant="body1">
                  Step 2: Children Details (Coming Soon)
                </Typography>
                <Button variant="outlined" sx={{ mt: 4 }} onClick={prevStep}>
                  Back
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MultiStepForm;
