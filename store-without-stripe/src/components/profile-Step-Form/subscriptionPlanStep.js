import React, { useState, useEffect } from "react";
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

// Function to calculate working days between two dates (excluding weekends)
const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    // Check if it's not Saturday (6) or Sunday (0)
    if (current.day() !== 0 && current.day() !== 6) {
      count++;
    }
    current = current.add(1, 'day');
  }
  
  return count;
};

// Function to calculate end date based on working days from start date
const calculateEndDateByWorkingDays = (startDate, workingDays) => {
  let count = 0;
  let current = dayjs(startDate);
  
  while (count < workingDays) {
    if (current.day() !== 0 && current.day() !== 6) {
      count++;
    }
    // Only move to next day if we haven't reached the required working days
    if (count < workingDays) {
      current = current.add(1, 'day');
    }
  }
  
  return current;
};

const SubscriptionPlanStep = ({ nextStep, prevStep }) => {
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [plans, setPlans] = useState([]);

  // Calculate plans based on current date
  useEffect(() => {
    const today = dayjs();
    const calculatedPlans = [
      {
        id: 1,
        label: "1 Month Plan",
        workingDays: calculateWorkingDays(today, today.endOf('month')),
        price: 0 // Will be calculated
      },
      {
        id: 2,
        label: "3 Months Plan",
        workingDays: calculateWorkingDays(today, today.add(3, 'month').endOf('month')),
        price: 0 // Will be calculated
      },
      {
        id: 3,
        label: "6 Months Plan",
        workingDays: calculateWorkingDays(today, today.add(6, 'month').endOf('month')),
        price: 0 // Will be calculated
      },
      {
        id: 4,
        label: "12 Months Plan",
        workingDays: calculateWorkingDays(today, today.add(12, 'month').endOf('month')),
        price: 0 // Will be calculated
      }
    ];

    // Calculate prices
    const plansWithPrices = calculatedPlans.map(plan => ({
      ...plan,
      price: plan.workingDays * 200,
      label: `${plan.workingDays} Working Days - Rs. ${(plan.workingDays * 200).toLocaleString('en-IN')}`
    }));

    setPlans(plansWithPrices);
    
    // Set initial end date based on first plan
    if (plansWithPrices.length > 0 && !endDate) {
      const initialEndDate = calculateEndDateByWorkingDays(today, plansWithPrices[0].workingDays);
      setEndDate(initialEndDate);
    }
  }, []);

  // Update end date when plan changes
  useEffect(() => {
    if (selectedPlan !== "byDate" && plans.length > 0) {
      const selected = plans.find(plan => plan.id.toString() === selectedPlan);
      if (selected) {
        const newEndDate = calculateEndDateByWorkingDays(startDate, selected.workingDays);
        setEndDate(newEndDate);
      }
    }
  }, [selectedPlan, startDate, plans]);

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
    setErrors({ startDate: false, endDate: false, dateOrder: false });
    if (e.target.value !== "byDate") {
      // Start date remains as is, end date will be updated in useEffect
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setErrors({
      ...errors,
      startDate: false,
      dateOrder: false,
    });

    // If not custom date plan, update end date based on selected plan
    if (selectedPlan !== "byDate" && plans.length > 0) {
      const selected = plans.find(plan => plan.id.toString() === selectedPlan);
      if (selected) {
        const newEndDate = calculateEndDateByWorkingDays(newValue, selected.workingDays);
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setErrors({
      ...errors,
      endDate: false,
      dateOrder: false,
    });
  };

  const handleNext = () => {
    if (selectedPlan === "byDate") {
      const newErrors = {
        startDate: !startDate,
        endDate: !endDate,
        dateOrder:
          endDate && startDate && dayjs(endDate).isBefore(dayjs(startDate)),
      };
      setErrors(newErrors);
      if (newErrors.startDate || newErrors.endDate || newErrors.dateOrder)
        return;
    }
    nextStep();
  };

  const renderDay = (dayNumber) => {
    const isWeekend = [0, 6].includes(dayjs().date(dayNumber).day());
    const isToday = dayNumber === dayjs().date();
    return (
      <Box
        key={dayNumber}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: isToday
            ? "#FF6A00"
            : isWeekend
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
            width: { xs: "100%", md: "45%" },
            backgroundImage: `url("/profileStepImages/stepThree.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            minHeight: 400,
          }}
        />

        {/* Right Form Section */}
        <Box sx={{ width: { xs: "100%", md: "55%" } }}>
          <div className="steptitles">
            <Typography variant="h6" fontWeight="bold">
              SUBSCRIPTION PLAN:
            </Typography>
          </div>
          <Typography
            sx={{ color: "#FF6A00", fontWeight: 600, mt: 2, mb: 1 }}
            variant="subtitle2"
          >
            SELECT YOUR SUBSCRIPTION PLAN*{" "}
            <Typography component="span" variant="caption" color="#888">
              (Taxes not included)
            </Typography>
          </Typography>
          <div className="subscrip">
          <RadioGroup value={selectedPlan} onChange={handlePlanChange} className="radiogroub">
            {plans.map((plan) => (
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
                  bgcolor:
                    selectedPlan === plan.id.toString() ? "#FF6A00" : "#fff",
                }}
              >
                <FormControlLabel  className="radiobtnlabel"
                  value={plan.id.toString()}
                  control={
                    <Radio className="radiobtn"
                      sx={{
                        color:
                          selectedPlan === plan.id.toString()
                            ? "#fff"
                            : "rgba(0, 0, 0, 0.6)",
                        "&.Mui-checked": {
                          color:
                            selectedPlan === plan.id.toString()
                              ? "#fff"
                              : "#FF6A00",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color:
                          selectedPlan === plan.id.toString()
                            ? "#fff"
                            : "inherit",
                        ml: 1,
                      }}
                    >
                      {plan.label}
                    </Typography>
                  }
                  sx={{ flex: 1 }}
                />
                {plan.id === 1 && (
                  <IconButton onClick={() => setCalendarOpen(true)} className="clanbtn">
                    <EventIcon
                      sx={{
                        cursor: "pointer",
                        color:
                          selectedPlan === plan.id.toString()
                            ? "#fff"
                            : "#FF6A00",
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
                      color:
                        selectedPlan === "byDate"
                          ? "#FF6A00"
                          : "rgba(0, 0, 0, 0.6)",
                      "&.Mui-checked": {
                        color: "#FF6A00",
                      },
                    }}
                  />
                }
                label={
                  <Typography 
                    variant="body2"
                    sx={{
                      color: selectedPlan === "byDate" ? "#FF6A00" : "inherit",
                    }}
                  >
                    Subscription By Date{" "}
                    <Typography component="span" fontSize={12} color="#777">
                      (Pre Book)
                    </Typography>
                  </Typography>
                }
              />
              {selectedPlan === "byDate" && (
                <Grid container mt={1} className="PreBookinput">
                  <Grid item >
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      shouldDisableDate={(date) =>
                        dayjs(date).isBefore(dayjs(), "day")
                      }
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error: errors.startDate,
                        },
                      }}
                    />
                    {errors.startDate && (
                      <FormHelperText error>
                        Please select a start date
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      shouldDisableDate={(date) => {
                        const isBeforeStartDate =
                          startDate &&
                          dayjs(date).isBefore(dayjs(startDate), "day");
                        return isBeforeStartDate;
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
                    {errors.endDate && (
                      <FormHelperText error>
                        Please select an end date
                      </FormHelperText>
                    )}
                    {errors.dateOrder && !errors.endDate && (
                      <FormHelperText error>
                        End date must be after start date
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              )}
            </Box>
          </RadioGroup>

          <Typography mt={1} fontSize={12} color="#888">
            End Date must be after Start Date.
          </Typography>

          {/* Show calculated working days and price for custom date selection */}
          {selectedPlan === "byDate" && startDate && endDate && (
            <Box mt={2}>
              <Typography variant="body2">
                <strong>Working Days:</strong> {calculateWorkingDays(startDate, endDate)} days
              </Typography>
              <Typography variant="body2">
                <strong>Total Price:</strong> Rs. {calculateWorkingDays(startDate, endDate) * 200}
              </Typography>
            </Box>
          )}

          {/* Offers */}
          <Box className="OffAvitbbox"
            mt={3}
          >
            <Typography
              sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }}
              variant="subtitle2"
            >
              OFFERS AVAILABLE
            </Typography>
            <ul style={{ margin: 0, }}>
              <li>
                <Typography fontSize={14}>
                  Save <strong>5%</strong> on the 150 Working Days Plan.
                </Typography>
              </li>
              <li>
                <Typography fontSize={14}>
                  Save <strong>10%</strong> on the 260 Working Days Plan.
                </Typography>
              </li>
            </ul>
          </Box>

          <Typography mt={2} fontSize={12}>
          <strong>Note: Per Day Meal = Rs. 200 (No. of Days X Rs. 200 = Subscription
            Amount)</strong>
          </Typography>

          {/* Action Buttons */}
          <Box className="subbtnrow" sx={{ mt: 4, display: "flex", gap: 3 }}>
            <Button variant="outlined" onClick={prevStep}  className="backbtn"> <span className="nextspan">Back</span> </Button>
            <Button variant="contained" onClick={handleNext} className="nextbtn"> <span className="nextspan">Next</span> </Button>
          </Box>
          </div>
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
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              width: 700,
              position: "relative",
              minHeight: 550,
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="relative"
              mb={1}
            >
              <Typography variant="h6" fontWeight="bold" align="center">
                LIST OF WORKING DAYS:
              </Typography>
              <IconButton
                onClick={() => setCalendarOpen(false)}
                sx={{ position: "absolute", right: 0 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography align="center" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>
              {dayjs().format('MMMM, YYYY')}
            </Typography>

            <Box
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
              textAlign="center"
              fontWeight="bold"
              fontSize="0.875rem"
              mb={2}
              gap={1}
            >
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                <Typography key={day}>{day}</Typography>
              ))}
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1.5}>
              {/* Empty days for start of month */}
              {[...Array(dayjs().startOf('month').day() - 1)].map((_, i) => (
                <Box key={`empty-start-${i}`} />
              ))}
              
              {/* Calendar days */}
              {[...Array(dayjs().daysInMonth())].map((_, i) => {
                const dayNumber = i + 1;
                const isWeekend = [6, 0].includes(dayjs().date(dayNumber).day());
                const isToday = dayNumber === dayjs().date();
                
                return (
                  <Box
                    key={dayNumber}
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      backgroundColor: isToday
                        ? "#FF6A00"
                        : isWeekend
                        ? "#FFE9E1"
                        : "transparent",
                      color: isToday ? "#fff" : "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      margin: "0 auto",
                    }}
                  >
                    {String(dayNumber).padStart(2, "0")}
                  </Box>
                );
              })}
            </Box>

            {/* Legend */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#FFE9E1",
                  mr: 1.5,
                }}
              />
              <Typography fontSize="0.875rem">
                Denotes Weekends & Holidays.
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </LocalizationProvider>
  );
};

export default SubscriptionPlanStep;