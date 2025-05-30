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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import WorkingDaysCalendar from "./WorkingDaysCalendar";
import SubscriptionDatePicker from "./SubscriptionDatePicker";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";

// Helper functions for holidays/weekends
const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const { data } = useAsync(AttributeServices.getAllHolidays);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setHolidays(data.map((h) => dayjs(h.date).format("YYYY-MM-DD")));
    }
  }, [data]);
  return holidays;
};

const isWeekend = (date) => [0, 6].includes(dayjs(date).day());
const isHoliday = (date, holidays) =>
  holidays.includes(dayjs(date).format("YYYY-MM-DD"));
const isWorkingDay = (date, holidays) =>
  !isWeekend(date) && !isHoliday(date, holidays);

// Calculate working days including holidays
const calculateWorkingDays = (startDate, endDate, holidays) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    current = current.add(1, "day");
  }
  return count;
};

// Get the end date after a given number of working days from a start date
const calculateEndDateByWorkingDays = (startDate, workingDays, holidays) => {
  let count = 0;
  let current = dayjs(startDate);

  // First, ensure we start from a working day
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }

  // Count working days
  while (count < workingDays) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    if (count < workingDays) {
      current = current.add(1, "day");
    }
  }

  // Ensure we land on a working day
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }

  return current;
};

// Plan calculation functions
const calculatePlans = (holidays) => {
  // Start from tomorrow + 1 day (2 days from now)
  let startDate = dayjs().add(2, "day");

  // Adjust start date to the next working day if needed
  while (!isWorkingDay(startDate, holidays)) {
    startDate = startDate.add(1, "day");
  }

  const plans = [
    {
      id: 1,
      label: `1 Month Plan - 30 Working Days - Rs. ${(30 * 200).toLocaleString(
        "en-IN"
      )}`,
      workingDays: 30,
      price: 30 * 200,
      discount: 0,
      isOneMonth: true,
      startDate,
      endDate: calculateEndDateByWorkingDays(startDate, 30, holidays),
    },
    {
      id: 3,
      label: `3 Months Plan - 90 Working Days - Rs. ${(
        90 *
        200 *
        0.95
      ).toLocaleString("en-IN")} (5% OFF)`,
      workingDays: 90,
      price: Math.round(90 * 200 * 0.95),
      discount: 0.05,
      isOneMonth: false,
      startDate,
      endDate: calculateEndDateByWorkingDays(startDate, 90, holidays),
    },
    {
      id: 6,
      label: `6 Months Plan - 180 Working Days - Rs. ${(
        180 *
        200 *
        0.9
      ).toLocaleString("en-IN")} (10% OFF)`,
      workingDays: 180,
      price: Math.round(180 * 200 * 0.9),
      discount: 0.1,
      isOneMonth: false,
      startDate,
      endDate: calculateEndDateByWorkingDays(startDate, 180, holidays),
    },
  ];
  return plans;
};

const SubscriptionPlanStep = ({ nextStep, prevStep, _id }) => {
  const router = useRouter();
  const holidays = useHolidays();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { submitHandler, loading } = useRegistration();

  // Initialize plans and dates
  useEffect(() => {
    if (holidays.length >= 0) {
      // Changed condition to work even with empty holidays array
      const computedPlans = calculatePlans(holidays);
      setPlans(computedPlans);
      setStartDate(computedPlans[0].startDate);
      setEndDate(computedPlans[0].endDate);
    }
  }, [holidays]);

  // Handle plan selection change
  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    setSelectedPlan(newPlanId);
    setErrors({ startDate: false, endDate: false, dateOrder: false });

    if (newPlanId !== "byDate") {
      const selectedPlanObj = plans.find(
        (plan) => plan.id.toString() === newPlanId
      );
      if (selectedPlanObj) {
        setStartDate(selectedPlanObj.startDate);
        setEndDate(selectedPlanObj.endDate);
      }
    }
  };

  // Handle custom date selection changes
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setErrors({ ...errors, startDate: false, dateOrder: false });

    if (selectedPlan !== "byDate") {
      const selected = plans.find(
        (plan) => plan.id.toString() === selectedPlan
      );
      if (selected) {
        const newEndDate = calculateEndDateByWorkingDays(
          newValue,
          selected.workingDays,
          holidays
        );
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setErrors({ ...errors, endDate: false, dateOrder: false });
  };

  // Get the currently selected plan details
  const currentPlan =
    selectedPlan !== "byDate"
      ? plans.find((plan) => plan.id.toString() === selectedPlan)
      : null;

  const handleNext = async () => {
    // Validation for custom date selection
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

    let totalWorkingDays, totalPrice;
    if (selectedPlan !== "byDate") {
      totalWorkingDays = currentPlan?.workingDays;
      totalPrice = currentPlan?.price;
    } else {
      totalWorkingDays = calculateWorkingDays(startDate, endDate, holidays);
      totalPrice = totalWorkingDays * 200;
    }

    // Construct the payload
    const payload = {
      selectedPlan,
      workingDays: totalWorkingDays,
      totalPrice,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };

    try {
      const res = await submitHandler({
        payload,
        path: "step-Form-SubscriptionPlan",
        _id,
      });
      if (res.status === 200) {
        nextStep();
        router.push("/menuCalendarPage");
      }
    } catch (error) {
      console.error("Error during subscription plan selection:", error);
    }
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
            <RadioGroup
              value={selectedPlan}
              onChange={handlePlanChange}
              className="radiogroub"
            >
              {/* Render all plans */}
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
                  <FormControlLabel
                    value={plan.id.toString()}
                    control={
                      <Radio
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
                  {/* Show calendar icon only for 1-month plan */}
                  {plan.isOneMonth && (
                    <IconButton onClick={() => setCalendarOpen(true)}>
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

              {/* Custom date selection option */}
              <CustomDateSelection
                selectedPlan={selectedPlan}
                startDate={startDate}
                endDate={endDate}
                errors={errors}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                holidays={holidays}
              />
            </RadioGroup>

            <Typography mt={1} fontSize={12} color="#888">
              End Date must be after Start Date.
            </Typography>

            {/* Show details for custom date selection */}
            {selectedPlan === "byDate" && startDate && endDate && (
              <CustomDateDetails
                startDate={startDate}
                endDate={endDate}
                holidays={holidays}
              />
            )}

            {/* Show details for selected plan */}
            {currentPlan && (
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>Start Date:</strong>{" "}
                  {currentPlan.startDate.format("DD MMM YYYY")}
                </Typography>
                <Typography variant="body2">
                  <strong>End Date:</strong>{" "}
                  {currentPlan.endDate.format("DD MMM YYYY")}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Working Days:</strong> {currentPlan.workingDays}
                </Typography>
              </Box>
            )}

            {/* Offers section */}
            <OffersSection />

            <Typography mt={2} fontSize={12}>
              <strong>
                Note: Per Day Meal = Rs. 200 (No. of Days X Rs. 200 =
                Subscription Amount)
              </strong>
            </Typography>

            {/* Action Buttons */}
            <Box className="subbtnrow" sx={{ mt: 4, display: "flex", gap: 3 }}>
              <Button variant="outlined" onClick={prevStep} className="backbtn">
                {" "}
                <span className="nextspan">Back</span>{" "}
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                className="nextbtn"
                disabled={loading}
              >
                {" "}
                <span className="nextspan">Next</span>{" "}
              </Button>
            </Box>
          </div>
        </Box>
      </Box>

      {/* Calendar Popup */}
      <WorkingDaysCalendar
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        startDate={startDate}
        workingDays={
          selectedPlan !== "byDate" && currentPlan
            ? currentPlan.workingDays
            : calculateWorkingDays(startDate, endDate, holidays)
        }
        holidays={holidays}
      />
    </LocalizationProvider>
  );
};

// Extracted components for better organization
const CustomDateSelection = ({
  selectedPlan,
  startDate,
  endDate,
  errors,
  onStartDateChange,
  onEndDateChange,
  holidays,
}) => (
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
            "&.Mui-checked": { color: "#FF6A00" },
          }}
        />
      }
      label={
        <Typography
          variant="body2"
          sx={{ color: selectedPlan === "byDate" ? "#FF6A00" : "inherit" }}
        >
          Subscription By Date{" "}
          <Typography component="span" fontSize={12} color="#777">
            (Pre Book)
          </Typography>
        </Typography>
      }
    />
    {selectedPlan === "byDate" && (
      <Grid container spacing={2}>
        {/* Start Date Picker */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            Start Date
          </Typography>
          <SubscriptionDatePicker
            type="start"
            value={startDate}
            onChange={onStartDateChange}
            minDate={dayjs().add(2, "day")}
            shouldDisableDate={(date) => !isWorkingDay(date, holidays)}
            holidays={holidays}
          />
          {errors.startDate && (
            <FormHelperText error>Start date is required</FormHelperText>
          )}
        </Grid>

        {/* End Date Picker */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            End Date
          </Typography>
          <SubscriptionDatePicker
            type="end"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate || dayjs().add(2, "day")}
            shouldDisableDate={(date) => !isWorkingDay(date, holidays)}
            holidays={holidays}
          />
          {errors.endDate && (
            <FormHelperText error>End date is required</FormHelperText>
          )}
          {errors.dateOrder && (
            <FormHelperText error>
              End date must be after start date
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    )}
  </Box>
);

const CustomDateDetails = ({ startDate, endDate, holidays }) => {
  const days = calculateWorkingDays(startDate, endDate, holidays);
  return (
    <Box mt={2}>
      <Typography variant="body2">
        <strong>Working Days:</strong> {days} days
      </Typography>
      <Typography variant="body2">
        <strong>Total Price:</strong> Rs. {(days * 200).toLocaleString("en-IN")}
      </Typography>
    </Box>
  );
};

const OffersSection = () => (
  <Box mt={3}>
    <Typography
      sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }}
      variant="subtitle2"
    >
      OFFERS AVAILABLE
    </Typography>
    <ul style={{ margin: 0 }}>
      <li>
        <Typography fontSize={14}>
          Save <strong>5%</strong> on the 90 Working Days Plan.
        </Typography>
      </li>
      <li>
        <Typography fontSize={14}>
          Save <strong>10%</strong> on the 180 Working Days Plan.
        </Typography>
      </li>
    </ul>
  </Box>
);

export default SubscriptionPlanStep;