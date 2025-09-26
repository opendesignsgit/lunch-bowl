import React, { useState, useEffect, useCallback } from "react";
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
  LinearProgress,
  Checkbox,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import WorkingDaysCalendar from "./WorkingDaysCalendar";
import SubscriptionDatePicker from "./SubscriptionDatePicker";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";
import {
  useHolidays,
  BASE_PRICE_PER_DAY,
  isWorkingDay,
  calculateWorkingDays,
} from "./subscriptionUtils";
import { CustomDateDetails } from "./SubscriptionComponents";

const CustomDateSelection = ({
  selectedPlan,
  startDate,
  endDate,
  errors,
  onStartDateChange,
  onEndDateChange,
  isWorkingDay,
  numberOfChildren,
  openCalendar,
  setHideMessage
}) => (
  <Box
    className="custmontplan"
    sx={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      px: 2,
      py: 2,
      mt: 1,
      bgcolor: selectedPlan === "byDate" ? "#FFF3EB" : "#fff",
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <FormControlLabel
        value="byDate"
        control={
          <Radio
            sx={{
              color: selectedPlan === "byDate" ? "#FF6A00" : "rgba(0, 0, 0, 0.6)",
              "&.Mui-checked": { color: "#FF6A00" },
            }}
          />
        }
        label={
          <Typography
            variant="body2"
            sx={{ color: selectedPlan === "byDate" ? "#FF6A00" : "inherit" }}
          >
            Add Children by Date{" "}
            <Typography component="span" fontSize={12} color="#777">
              (Limited to current subscription period)
            </Typography>
            {numberOfChildren > 1 && (
              <Typography
                component="span"
                fontSize={12}
                color="#777"
                sx={{ ml: 1 }}
              >
                for {numberOfChildren} children
              </Typography>
            )}
          </Typography>
        }
      />
      {selectedPlan === "byDate" && startDate && endDate && (
        <IconButton onClick={() => {
          setHideMessage(true);
          openCalendar();
        }} sx={{ color: "#FF6A00" }}>
          <EventIcon />
        </IconButton>
      )}
    </Box>

    {selectedPlan === "byDate" && startDate && endDate && (
      <Box className="custdatepick" sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: "#666", mb: 2 }}>
          <strong>Subscription Period (Auto-calculated)</strong>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className="cusdpstart">
            <Typography variant="body2" gutterBottom sx={{ color: "#333" }}>
              <strong>Start Date:</strong>
            </Typography>
            <Typography variant="body1" sx={{ color: "#FF6A00", fontWeight: 600 }}>
              {startDate.format("DD MMM YYYY")}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              (48 hours from today)
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="cusdpend">
            <Typography variant="body2" gutterBottom sx={{ color: "#333" }}>
              <strong>End Date:</strong>
            </Typography>
            <Typography variant="body1" sx={{ color: "#FF6A00", fontWeight: 600 }}>
              {endDate.format("DD MMM YYYY")}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              (Current subscription end date)
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )}
  </Box>
);

const AddChildrenSubscriptionPlanStep = ({
  nextStep,
  prevStep,
  _id,
  numberOfChildren = 1,
  initialSubscriptionPlan = {},
  onSubscriptionPlanChange,
  existingSubscription = null,
}) => {
  const router = useRouter();
  const { holidays, holidaysLoading } = useHolidays();
  const isWorkingDayMemo = useCallback(
    (date) => isWorkingDay(date, holidays),
    [holidays]
  );

  const [selectedPlan, setSelectedPlan] = useState("byDate");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { submitHandler, loading } = useRegistration();
  const [hideMessage, setHideMessage] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);

  useEffect(() => {
    if (existingSubscription) {
      // For add-children mode, auto-calculate dates
      // Start date: 48 hours (2 days) from today, must be a working day
      let startFromDate = dayjs().add(2, 'day');
      
      // Ensure start date is a working day and within subscription period
      const subscriptionEndDate = dayjs(existingSubscription.endDate);
      
      while (!isWorkingDayMemo(startFromDate) || startFromDate.isAfter(subscriptionEndDate)) {
        startFromDate = startFromDate.add(1, 'day');
        // If we go beyond subscription end date, we can't add children
        if (startFromDate.isAfter(subscriptionEndDate)) {
          console.error("Cannot add children - no valid working days within subscription period");
          setErrors({ ...errors, dateOrder: true });
          return;
        }
      }
      
      // End date is always the existing subscription end date
      const restrictedEnd = subscriptionEndDate;
      
      // Auto-set the values for "by date" option
      setSelectedPlan("byDate");
      setStartDate(startFromDate);
      setEndDate(restrictedEnd);
      
      // Clear any errors since dates are auto-calculated
      setErrors({ startDate: false, endDate: false, dateOrder: false });
    }
  }, [holidays, existingSubscription, isWorkingDayMemo]);

  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    setSelectedPlan(newPlanId);
    setErrors({ startDate: false, endDate: false, dateOrder: false });
    if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
      onSubscriptionPlanChange({ planId: newPlanId });
    }

    if (newPlanId === "byDate" && existingSubscription) {
      // Auto-calculate start date (48 hours from today, working day)
      let startFromDate = dayjs().add(2, 'day');
      const subscriptionEndDate = dayjs(existingSubscription.endDate);
      
      while (!isWorkingDayMemo(startFromDate) || startFromDate.isAfter(subscriptionEndDate)) {
        startFromDate = startFromDate.add(1, 'day');
        if (startFromDate.isAfter(subscriptionEndDate)) {
          console.error("Cannot add children - no valid working days within subscription period");
          setErrors({ ...errors, dateOrder: true });
          return;
        }
      }
      
      const restrictedEnd = subscriptionEndDate;
      
      setStartDate(startFromDate);
      setEndDate(restrictedEnd);
      if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
        onSubscriptionPlanChange({
          startDate: startFromDate,
          endDate: restrictedEnd,
        });
      }
    }
  };

  const handleNext = async () => {
    if (!agreed) {
      setAgreedError(true);
      return;
    }
    setAgreedError(false);

    // Since dates are auto-calculated, just validate they exist
    if (!startDate || !endDate) {
      console.error("Start date or end date not set properly");
      return;
    }

    const totalWorkingDays = calculateWorkingDays(startDate, endDate, holidays);
    
    // Apply 5% discount for add children mode 
    let baseTotalPrice = totalWorkingDays * BASE_PRICE_PER_DAY * numberOfChildren;
    const totalPrice = Math.round(baseTotalPrice * 0.95); // 5% discount

    const payload = {
      selectedPlan,
      workingDays: totalWorkingDays,
      totalPrice,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      numberOfChildren,
      offerApplied: "5% Add Children Discount",
    };

    try {
      const res = await submitHandler({
        payload,
        step: 3,
        path: "add-children-plan",
        _id,
      });
      
      if (res) {
        // For add-children mode, pass the plan data to the next step
        if (typeof nextStep === 'function') {
          nextStep(payload);
        } else {
          nextStep();
        }
      }
    } catch (error) {
      console.error("Error during add-children plan selection:", error);
    }
  };

  const totalWorkingDays = startDate && endDate ? calculateWorkingDays(startDate, endDate, holidays) : 0;
  const baseCost = totalWorkingDays * BASE_PRICE_PER_DAY * numberOfChildren;
  const discountedCost = Math.round(baseCost * 0.95);
  const savings = baseCost - discountedCost;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        className="subplnBoxss"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
      >
        <Box
          className="spboximg"
          sx={{
            width: { xs: "100%", md: "45%" },
            backgroundImage: `url("/profileStepImages/stepThree.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            minHeight: 400,
          }}
        />

        <Box className="spboxCont" sx={{ width: { xs: "100%", md: "55%" } }}>
          {holidaysLoading && <LinearProgress />}
          
          <Typography
            sx={{ color: "#FF6A00", fontWeight: 600, mt: 2, mb: 1 }}
            variant="subtitle2"
          >
            ADD CHILDREN TO EXISTING SUBSCRIPTION*{" "}
            <Typography component="span" variant="caption" color="#888">
              (5% discount applied - All Taxes included)
            </Typography>
          </Typography>

          <RadioGroup
            value={selectedPlan}
            onChange={handlePlanChange}
            className="radiogroub"
          >
            {/* Render Custom By-Date Plan */}
            <CustomDateSelection
              selectedPlan={selectedPlan}
              startDate={startDate}
              endDate={endDate}
              errors={errors}
              onStartDateChange={() => {}} // No-op since dates are auto-calculated
              onEndDateChange={() => {}} // No-op since dates are auto-calculated
              isWorkingDay={isWorkingDayMemo}
              numberOfChildren={numberOfChildren}
              openCalendar={() => setCalendarOpen(true)}
              setHideMessage={setHideMessage}
            />
          </RadioGroup>

          {selectedPlan === "byDate" && startDate && endDate && (
            <>
              <CustomDateDetails
                startDate={startDate}
                endDate={endDate}
                holidays={holidays}
                numberOfChildren={numberOfChildren}
              />
              
              {/* Show discount information */}
              <Box mt={2} sx={{ border: "1px solid #4CAF50", p: 2, borderRadius: 1, bgcolor: "#f8fff8" }}>
                <Typography variant="body2" gutterBottom sx={{ color: "#4CAF50", fontWeight: 600 }}>
                  <strong>Add Children Discount Applied!</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>Original Cost:</strong> Rs. {baseCost.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                  <strong>Discount (5%):</strong> -Rs. {savings.toLocaleString("en-IN")}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  <strong>Final Cost:</strong> Rs. {discountedCost.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </>
          )}

          <Typography mt={2} fontSize={12}>
            <strong>
              Note: Start date is automatically set to 48 hours from today (next working day) and end date matches your existing subscription.
              A 5% discount is automatically applied for adding children.
              Per Day Meal = Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren} {numberOfChildren > 1 ? "children" : "child"}
            </strong>
          </Typography>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (agreedError) setAgreedError(false);
                  }}
                  sx={{ color: "#FF6A00" }}
                />
              }
              label={
                <Typography fontSize={14}>
                  I agree with the{" "}
                  <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6A00", textDecoration: "underline" }}>
                    Terms and Conditions
                  </a>{" "}
                  /{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6A00", textDecoration: "underline" }}>
                    Privacy Policy
                  </a>{" "}
                  /{" "}
                  <a href="/refund-cancellation-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6A00", textDecoration: "underline" }}>
                    Refund Cancellation Policy
                  </a>
                </Typography>
              }
            />
            {agreedError && (
              <FormHelperText error>
                You must agree to the terms and conditions to proceed.
              </FormHelperText>
            )}
          </Box>

          <Box className="subbtnrow" sx={{ mt: 4, display: "flex", gap: 3 }}>
            <Button variant="outlined" onClick={prevStep} className="backbtn">
              <span className="nextspan">Back</span>
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              className="nextbtn"
              disabled={loading || holidaysLoading}
              sx={{
                bgcolor: "#FF6A00",
                color: "#fff",
                boxShadow: 2,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#ff904b",
                },
              }}
            >
              <span className="nextspan">Next</span>
            </Button>
          </Box>
        </Box>
      </Box>

      <WorkingDaysCalendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={startDate}
        workingDays={totalWorkingDays}
        holidays={holidays}
        hideMessage={hideMessage}
      />
    </LocalizationProvider>
  );
};

export default AddChildrenSubscriptionPlanStep;