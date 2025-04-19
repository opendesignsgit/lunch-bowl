
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText,
  IconButton,
  Paper,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const dummyPlans = [
  { id: 1, label: "24 Working Days - Rs. 4,800" },
  { id: 2, label: "72 Working Days - Rs. 14,400" },
  { id: 3, label: "144 Working Days - Rs. 28,800" },
  { id: 4, label: "288 Working Days - Rs. 57,600" },
];

const weekendsAndHolidays = [5, 6, 10, 12, 13, 14, 18, 19, 20, 26, 27];
const today = 8;

const SubscriptionPlanStep = ({ nextStep, prevStep }) => {
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });

  const [calendarOpen, setCalendarOpen] = useState(false);

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
    setErrors({ startDate: false, endDate: false, dateOrder: false });
    if (e.target.value !== "byDate") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleNext = () => {
    if (selectedPlan === "byDate") {
      const newErrors = {
        startDate: !startDate,
        endDate: !endDate,
        dateOrder: endDate && startDate && dayjs(endDate).isBefore(dayjs(startDate)),
      };
      setErrors(newErrors);
      if (newErrors.startDate || newErrors.endDate || newErrors.dateOrder) return;
    }
    nextStep();
  };

  const renderDay = (dayNumber) => {
    const isHoliday = weekendsAndHolidays.includes(dayNumber);
    const isToday = dayNumber === today;
    return (
      <Box
        key={dayNumber}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: isToday
            ? "#FF6A00"
            : isHoliday
            ? "#FFE9E1"
            : "transparent",
          color: isToday ? "#fff" : "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 500,
          fontSize: "14px",
        }}
      >
        {String(dayNumber).padStart(2, "0")}
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* Left Illustration */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            backgroundImage: `url("/profileStepImages/stepThree.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            minHeight: 400,
          }}
        />

        {/* Right Form Section */}
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Typography variant="h6" fontWeight="bold">
            SUBSCRIPTION PLAN:
          </Typography>

          <Typography sx={{ color: "#FF6A00", fontWeight: 600, mt: 2, mb: 1 }} variant="subtitle2">
            SELECT YOUR SUBSCRIPTION PLAN*{" "}
            <Typography component="span" variant="caption" color="#888">
              (Taxes not included)
            </Typography>
          </Typography>

          <RadioGroup value={selectedPlan} onChange={handlePlanChange}>
            {dummyPlans.map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  mb: 1,
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: selectedPlan === plan.id.toString() ? "#FF6A00" : "#fff",
                }}
              >
                <FormControlLabel
                  value={plan.id.toString()}
                  control={
                    <Radio
                      sx={{
                        color: selectedPlan === plan.id.toString() ? "#fff" : "rgba(0, 0, 0, 0.6)",
                        "&.Mui-checked": {
                          color: selectedPlan === plan.id.toString() ? "#fff" : "#FF6A00",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: selectedPlan === plan.id.toString() ? "#fff" : "inherit",
                        ml: 1,
                      }}
                    >
                      {plan.label}
                    </Typography>
                  }
                  sx={{ flex: 1 }}
                />
                {plan.id === 1 && (
                  <IconButton onClick={() => setCalendarOpen(true)}>
                    <EventIcon
                      sx={{
                        cursor: "pointer",
                        color: selectedPlan === plan.id.toString() ? "#fff" : "#FF6A00",
                      }}
                    />
                  </IconButton>
                )}
              </Box>
            ))}

            {/* Subscription by Date Option */}
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                px: 2,
                py: 2,
                mt: 1,
                bgcolor: selectedPlan === "byDate" ? "#FFF3EB" : "#fff",
              }}
            >
              <FormControlLabel
                value="byDate"
                control={
                  <Radio
                    sx={{
                      color: selectedPlan === "byDate" ? "#FF6A00" : "rgba(0, 0, 0, 0.6)",
                      "&.Mui-checked": {
                        color: "#FF6A00",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: selectedPlan === "byDate" ? "#FF6A00" : "inherit" }}>
                    Subscription By Date{" "}
                    <Typography component="span" fontSize={12} color="#777">
                      (Pre Book)
                    </Typography>
                  </Typography>
                }
              />
              {selectedPlan === "byDate" && (
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                        setErrors({ ...errors, startDate: false, dateOrder: false });
                      }}
                      shouldDisableDate={(date) => dayjs(date).isBefore(dayjs(), "day")}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error: errors.startDate,
                        },
                      }}
                    />
                    {errors.startDate && <FormHelperText error>Please select a start date</FormHelperText>}
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                        setErrors({ ...errors, endDate: false, dateOrder: false });
                      }}
                      shouldDisableDate={(date) => {
                        const isLastDayOfMonth = dayjs(date).endOf("month").isSame(date, "day");
                        const isBeforeStartDate = startDate && dayjs(date).isBefore(dayjs(startDate), "day");
                        return !isLastDayOfMonth || isBeforeStartDate;
                      }}
                      minDate={startDate || dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error: errors.endDate || errors.dateOrder,
                        },
                      }}
                    />
                    {errors.endDate && <FormHelperText error>Please select an end date</FormHelperText>}
                    {errors.dateOrder && !errors.endDate && (
                      <FormHelperText error>End date must be after start date</FormHelperText>
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          </RadioGroup>

          <Typography mt={1} fontSize={12} color="#888">
            End Date must be the last day of the month and after Start Date.
          </Typography>

          {/* Offers */}
          <Box mt={3} p={2} bgcolor="#FFF3EB" borderRadius="8px" border="1px solid #FFD6B8">
            <Typography sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }} variant="subtitle2">
              OFFERS AVAILABLE
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              <li>
                <Typography fontSize={14}>Save 5% on the 150 Working Days Plan.</Typography>
              </li>
              <li>
                <Typography fontSize={14}>Save 10% on the 260 Working Days Plan.</Typography>
              </li>
            </ul>
          </Box>

          <Typography mt={2} fontSize={12}>
            Note: Per Day Meal = Rs. 200 (No. of Days X Rs. 200 = Subscription Amount)
          </Typography>

          {/* Action Buttons */}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={prevStep}
              sx={{
                borderRadius: 0,
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                borderColor: "#000",
                color: "#000",
                textTransform: "none",
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                backgroundColor: "#FF6A00",
                color: "#fff",
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 0,
                textTransform: "none",
                "&:hover": { backgroundColor: "#e65c00" },
              }}
            >
              Next ↗
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Centered Calendar Popup */}
      {calendarOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: 360, position: "relative" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                LIST OF WORKING DAYS:
              </Typography>
              <IconButton onClick={() => setCalendarOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography align="center" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
              APRIL, 2025
            </Typography>

            <Grid container spacing={1} justifyContent="center">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <Grid item key={day}>
                  <Typography fontWeight={600} fontSize="14px">
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
              {[...Array(1)].map((_, i) => (
                <Grid item key={`empty-${i}`} sx={{ width: 36, height: 36 }} />
              ))}
              {[...Array(30)].map((_, i) => (
                <Grid item key={i}>
                  {renderDay(i + 1)}
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#FFE9E1",
                  mr: 1,
                }}
              />
              <Typography fontSize="13px">Denotes Weekends & Holidays.</Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </LocalizationProvider>
  );
};

export default SubscriptionPlanStep;