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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import WorkingDaysCalendar from "./WorkingDaysCalendar";
import SubscriptionDatePicker from "./SubscriptionDatePicker";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";

// Helper functions
const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (current.day() !== 0 && current.day() !== 6) {
      count++;
    }
    current = current.add(1, "day");
  }

  return count;
};

const calculateEndDateByWorkingDays = (startDate, workingDays) => {
  let count = 0;
  let current = dayjs(startDate);

  while (count < workingDays) {
    if (current.day() !== 0 && current.day() !== 6) {
      count++;
    }
    if (count < workingDays) {
      current = current.add(1, "day");
    }
  }

  return current;
};

// Plan calculation functions
const calculateOneMonthPlan = () => {
  const startDate = dayjs().add(2, "day"); // Start after 48 hours
  const endOfMonth = dayjs(startDate).endOf("month");

  let endDate = endOfMonth;
  while (endDate.day() === 0 || endDate.day() === 6) {
    // Skip weekends
    endDate = endDate.subtract(1, "day");
  }

  const workingDays = calculateWorkingDays(startDate, endDate);

  return {
    id: 1,
    label: `1 Month Plan - ${workingDays} Working Days - Rs. ${(
      workingDays * 200
    ).toLocaleString("en-IN")}`,
    workingDays,
    price: workingDays * 200,
    isOneMonth: true,
    startDate,
    endDate,
  };
};

const calculateMultiMonthPlans = () => {
  const startDate = dayjs().add(2, "day"); // Start after 48 hours for all plans
  return [3, 6, 12].map((months) => {
    const endOfMonth = dayjs(startDate)
      .add(months - 1, "month")
      .endOf("month");

    let endDate = endOfMonth;
    while (endDate.day() === 0 || endDate.day() === 6) {
      // Skip weekends
      endDate = endDate.subtract(1, "day");
    }

    const workingDays = calculateWorkingDays(startDate, endDate);

    return {
      id: months,
      label: `${months} Months Plan - ${workingDays} Working Days - Rs. ${(
        workingDays * 200
      ).toLocaleString("en-IN")}`,
      workingDays,
      price: workingDays * 200,
      isOneMonth: false,
      startDate,
      endDate,
    };
  });
};

const SubscriptionPlanStep = ({ nextStep, prevStep, _id }) => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [startDate, setStartDate] = useState(dayjs().add(2, "day"));
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const { submitHandler, loading } = useRegistration();

  // Initialize plans and dates
  useEffect(() => {
    const oneMonthPlan = calculateOneMonthPlan();
    const multiMonthPlans = calculateMultiMonthPlans();

    setPlans([oneMonthPlan, ...multiMonthPlans]);
    setStartDate(oneMonthPlan.startDate);
    setEndDate(oneMonthPlan.endDate);
  }, []);

  // Handle plan selection change
  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    setSelectedPlan(newPlanId);
    setErrors({ startDate: false, endDate: false, dateOrder: false });

    if (newPlanId !== "byDate") {
      const selectedPlan = plans.find(
        (plan) => plan.id.toString() === newPlanId
      );
      if (selectedPlan) {
        setStartDate(selectedPlan.startDate);
        setEndDate(selectedPlan.endDate);
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
          selected.workingDays
        );
        setEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setErrors({ ...errors, endDate: false, dateOrder: false });
  };

  const handleNext = async () => {
    console.log("Selected Plan:", selectedPlan);

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

    // Construct the payload
    const payload = {
      selectedPlan,
      workingDays:
        selectedPlan !== "byDate"
          ? currentPlan?.workingDays
          : calculateWorkingDays(startDate, endDate),
      totalPrice:
        selectedPlan !== "byDate"
          ? currentPlan?.price
          : calculateWorkingDays(startDate, endDate) * 200,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };

    try {
      const res = await submitHandler({
        payload,
        path: "step-Form-SubscriptionPlan",
        _id,
      });
      // Proceed to the next step
      if (res.status !== 200) {
        nextStep();
        router.push("/menuCalendarPage"); // Redirect to the menu calendar page
      }
    } catch (error) {
      console.error("Error during subscription plan selection:", error);
    }
  };

  // Get the currently selected plan details
  const currentPlan =
    selectedPlan !== "byDate"
      ? plans.find((plan) => plan.id.toString() === selectedPlan)
      : null;

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
              />
            </RadioGroup>

            <Typography mt={1} fontSize={12} color="#888">
              End Date must be after Start Date.
            </Typography>

            {/* Show details for custom date selection */}
            {selectedPlan === "byDate" && startDate && endDate && (
              <CustomDateDetails startDate={startDate} endDate={endDate} />
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
            : calculateWorkingDays(startDate, endDate)
        }
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
  onStartDateChange, // This is handleStartDateChange from parent
  onEndDateChange, // This is handleEndDateChange from parent
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
        {/* Start Date Picker - Fixed */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            Start Date
          </Typography>
          <SubscriptionDatePicker
            type="start"
            value={startDate}
            onChange={onStartDateChange}
            minDate={dayjs().add(2, "day")}
          />
          {errors.startDate && (
            <FormHelperText error>Start date is required</FormHelperText>
          )}
        </Grid>

        {/* End Date Picker - Fixed */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>
            End Date
          </Typography>
          <SubscriptionDatePicker
            type="end"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate || dayjs().add(2, "day")}
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

const CustomDateDetails = ({ startDate, endDate }) => (
  <Box mt={2}>
    <Typography variant="body2">
      <strong>Working Days:</strong> {calculateWorkingDays(startDate, endDate)}{" "}
      days
    </Typography>
    <Typography variant="body2">
      <strong>Total Price:</strong> Rs.{" "}
      {calculateWorkingDays(startDate, endDate) * 200}
    </Typography>
  </Box>
);

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
);

export default SubscriptionPlanStep;
