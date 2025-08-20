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
  Divider,
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

// Constants
const BASE_PRICE_PER_DAY = 200;

// Helper functions for holidays/weekends
const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const { data, loading: holidaysLoading } = useAsync(
    AttributeServices.getAllHolidays
  );
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setHolidays(data.map((h) => dayjs(h.date).format("YYYY-MM-DD")));
    }
  }, [data]);
  return { holidays, holidaysLoading };
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
const calculatePlans = (holidays, childCount = 1) => {
  let startDate = dayjs().add(2, "day");

  // Adjust start date to the next working day if needed
  while (!isWorkingDay(startDate, holidays)) {
    startDate = startDate.add(1, "day");
  }

  // Different discounts based on number of children
  const discounts =
    childCount >= 2
      ? { 22: 0.05, 66: 0.15, 132: 0.2 } // 5% for 22 days, 15% for 66 days, 20% for 132 days when 2+ children
      : { 22: 0, 66: 0.05, 132: 0.1 }; // Original discounts for single child

  const plans = [
    {
      id: 1,
      label: `22 Working Days - Rs. ${Math.round(
        22 * BASE_PRICE_PER_DAY * (1 - discounts[22]) * childCount
      ).toLocaleString("en-IN")}${
        discounts[22] > 0 ? ` (${discounts[22] * 100}% OFF)` : ""
      }`,
      workingDays: 22,
      price: Math.round(
        22 * BASE_PRICE_PER_DAY * (1 - discounts[22]) * childCount
      ),
      discount: discounts[22],
      isOneMonth: true,
      startDate,
      endDate: calculateEndDateByWorkingDays(startDate, 22, holidays),
    },
    {
      id: 3,
      label: `66 Working Days - Rs. ${Math.round(
        66 * BASE_PRICE_PER_DAY * (1 - discounts[66]) * childCount
      ).toLocaleString("en-IN")} (${discounts[66] * 100}% OFF)`,
      workingDays: 66,
      price: Math.round(
        66 * BASE_PRICE_PER_DAY * (1 - discounts[66]) * childCount
      ),
      discount: discounts[66],
      isOneMonth: false,
      startDate,
      endDate: calculateEndDateByWorkingDays(startDate, 66, holidays),
    },
    {
      id: 6,
      label: `132 Working Days - Rs. ${Math.round(
        132 * BASE_PRICE_PER_DAY * (1 - discounts[132]) * childCount
      ).toLocaleString("en-IN")} (${discounts[132] * 100}% OFF)`,
      workingDays: 132,
      price: Math.round(
        132 * BASE_PRICE_PER_DAY * (1 - discounts[132]) * childCount
      ),
      discount: discounts[132],
      isOneMonth: false,
      startDate,
      endDate: calculateEndDateByWorkingDays(startDate, 132, holidays),
    },
  ];
  return plans;
};

const SubscriptionPlanStep = ({
  nextStep,
  prevStep,
  _id,
  numberOfChildren = 1,
}) => {
  const router = useRouter();
  const { holidays, holidaysLoading } = useHolidays();
  const isWorkingDayMemo = useCallback(
    (date) => isWorkingDay(date, holidays),
    [holidays]
  );

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
      const computedPlans = calculatePlans(holidays, numberOfChildren);
      setPlans(computedPlans);
      setStartDate(computedPlans[0].startDate);
      setEndDate(computedPlans[0].endDate);
    }
  }, [holidays, numberOfChildren]);

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
      // No discount applied for custom date selection, but multiply by number of children
      totalPrice = totalWorkingDays * BASE_PRICE_PER_DAY * numberOfChildren;
    }

    // Construct the payload
    const payload = {
      selectedPlan,
      workingDays: totalWorkingDays,
      totalPrice,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      numberOfChildren,
    };

    try {
      const res = await submitHandler({
        payload,
        step: 3,
        path: "step-Form-SubscriptionPlan",
        _id,
      });
      if (res) {
        nextStep();
      }
    } catch (error) {
      console.error("Error during subscription plan selection:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="subplnBoxss" display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* Left Illustration */}
        <Box className="spboximg"
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
        <Box className="spboxCont" sx={{ width: { xs: "100%", md: "55%" } }}>
          {/*<div className="steptitles">
            <Typography variant="h6" fontWeight="bold">
              SUBSCRIPTION PLAN:
            </Typography>
            {numberOfChildren > 1 && (
              <Typography color="primary" sx={{ mt: 1 }}>
                Pricing for {numberOfChildren} children
              </Typography>
            )}
          </div> */}

          {holidaysLoading && <LinearProgress />}

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
              {/* Render all plans with calculation for discounted ones */}
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
                        {plan.workingDays} Working Days -
                        {plan.discount > 0 ? (
                          <>
                            <span
                              style={{
                                textDecoration: "line-through",
                                marginLeft: 4,
                                color:
                                  selectedPlan === plan.id.toString()
                                    ? "#fff"
                                    : "inherit",
                              }}
                            >
                              Rs.{" "}
                              {(
                                plan.workingDays *
                                BASE_PRICE_PER_DAY *
                                numberOfChildren
                              ).toLocaleString("en-IN")}
                            </span>
                            <span
                              style={{
                                marginLeft: 4,
                                color:
                                  selectedPlan === plan.id.toString()
                                    ? "#fff"
                                    : "#FF6A00",
                              }}
                            >
                              ({plan.discount * 100}% OFF) - Rs.{" "}
                              {plan.price.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <span style={{ marginLeft: 4 }}>
                            Rs. {plan.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </Typography>
                    }
                    sx={{ flex: 1 }}
                  />
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
                isWorkingDay={isWorkingDayMemo}
                numberOfChildren={numberOfChildren}
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
                numberOfChildren={numberOfChildren}
              />
            )}

            {/* Show details for selected plan */}
            {currentPlan && (
              <Box
                mt={2}
                sx={{ border: "1px solid #eee", p: 2, borderRadius: 1 }}
              >
                <Typography variant="body2" gutterBottom>
                  <strong>Subscription Details:</strong>
                </Typography>
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
                <Typography variant="body2">
                  <strong>Price per day per child:</strong> Rs.{" "}
                  {BASE_PRICE_PER_DAY}
                </Typography>
                {numberOfChildren > 1 && (
                  <>
                    <Typography variant="body2">
                      <strong>Number of Children:</strong> {numberOfChildren}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Price Calculation:</strong>{" "}
                      {currentPlan.workingDays} days × Rs. {BASE_PRICE_PER_DAY}{" "}
                      × {numberOfChildren} children
                    </Typography>
                  </>
                )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  <strong>Total Price:</strong> Rs.{" "}
                  {currentPlan.price.toLocaleString("en-IN")}
                  {currentPlan.discount > 0 && (
                    <span style={{ color: "#FF6A00", marginLeft: "8px" }}>
                      (Saved Rs.{" "}
                      {Math.round(
                        currentPlan.workingDays *
                          BASE_PRICE_PER_DAY *
                          numberOfChildren *
                          currentPlan.discount
                      ).toLocaleString("en-IN")}
                      )
                    </span>
                  )}
                </Typography>
              </Box>
            )}

            {/* Offers section --->*/}
            <OffersSection numberOfChildren={numberOfChildren} />

            <Typography mt={2} fontSize={12}>
              <strong>
                Note: Per Day Meal = Rs. {BASE_PRICE_PER_DAY} (No. of Days × Rs.{" "}
                {BASE_PRICE_PER_DAY} × {numberOfChildren}{" "}
                {numberOfChildren > 1 ? "children" : "child"} = Subscription
                Amount)
                {selectedPlan === "byDate" &&
                  " No discounts apply to custom date selections."}
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
                disabled={loading || holidaysLoading}
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

// Extracted components
const CustomDateSelection = ({
  selectedPlan,
  startDate,
  endDate,
  errors,
  onStartDateChange,
  onEndDateChange,
  holidays,
  isWorkingDay,
  numberOfChildren,
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
    {selectedPlan === "byDate" && (
      <Grid container spacing={2} className="custdatepick">
        <Grid item xs={12} sm={6} className="cusdpstart">
          <Typography variant="subtitle2" gutterBottom>
            Start Date
          </Typography>
          <SubscriptionDatePicker
            type="start"
            value={startDate}
            onChange={onStartDateChange}
            minDate={dayjs().add(2, "day")}
            shouldDisableDate={(date) => !isWorkingDay(date)}
          />
          {errors.startDate && (
            <FormHelperText error>Start date is required</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sm={6} className="cusdpend">
          <Typography variant="subtitle2" gutterBottom>
            End Date
          </Typography>
          <SubscriptionDatePicker
            type="end"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate || dayjs().add(2, "day")}
            shouldDisableDate={(date) => !isWorkingDay(date)}
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

const CustomDateDetails = ({
  startDate,
  endDate,
  holidays,
  numberOfChildren = 1,
}) => {
  const days = calculateWorkingDays(startDate, endDate, holidays);
  const pricePerChild = days * BASE_PRICE_PER_DAY;
  const totalPrice = pricePerChild * numberOfChildren;

  return (
    <Box mt={2} sx={{ border: "1px solid #eee", p: 2, borderRadius: 1 }}>
      <Typography variant="body2" gutterBottom>
        <strong>Subscription Details:</strong>
      </Typography>
      <Typography variant="body2">
        <strong>Start Date:</strong> {startDate.format("DD MMM YYYY")}
      </Typography>
      <Typography variant="body2">
        <strong>End Date:</strong> {endDate.format("DD MMM YYYY")}
      </Typography>
      <Typography variant="body2">
        <strong>Total Working Days:</strong> {days} days
      </Typography>
      <Typography variant="body2">
        <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
      </Typography>
      <Typography variant="body2">
        <strong>Price per child:</strong> Rs.{" "}
        {pricePerChild.toLocaleString("en-IN")}({days} days × Rs.{" "}
        {BASE_PRICE_PER_DAY})
      </Typography>
      {numberOfChildren > 1 && (
        <>
          <Typography variant="body2">
            <strong>Number of Children:</strong> {numberOfChildren}
          </Typography>
          <Typography variant="body2">
            <strong>Total Price Calculation:</strong> {days} days × Rs.{" "}
            {BASE_PRICE_PER_DAY} × {numberOfChildren} children
          </Typography>
        </>
      )}
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" fontWeight="bold">
        <strong>Total Price:</strong> Rs. {totalPrice.toLocaleString("en-IN")}
      </Typography>
    </Box>
  );
};

const OffersSection = ({ numberOfChildren = 1 }) => (
  <Box mt={3}>
    <Typography
      sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }}
      variant="subtitle2"
    >
      OFFERS AVAILABLE
    </Typography>
    <ul style={{ margin: 0 }}>
      {numberOfChildren >= 2 ? (
        <>
          <li>
            <Typography fontSize={14}>
              Save <strong>5%</strong> on the 22 Working Days Plan (for 2+
              children).
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>15%</strong> on the 66 Working Days Plan (for 2+
              children).
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>20%</strong> on the 132 Working Days Plan (for 2+
              children).
            </Typography>
          </li>
        </>
      ) : (
        <>
          <li>
            <Typography fontSize={14}>
              Save <strong>5%</strong> on the 66 Working Days Plan.
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>10%</strong> on the 132 Working Days Plan.
            </Typography>
          </li>
        </>
      )}
      <li>
        <Typography fontSize={14} fontStyle="italic">
          Discounts do not apply to custom date selections.
        </Typography>
      </li>
    </ul>
  </Box>
);

export default SubscriptionPlanStep;