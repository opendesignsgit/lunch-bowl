import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormHelperText,
  IconButton,
  LinearProgress,
  Checkbox,
  Paper,
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
  calculateEndDateByWorkingDays,
} from "./subscriptionUtils";
import { CustomDateDetails, OffersSection } from "./SubscriptionComponents";

// Calculate renewal plans with existing subscription date merging
const calculateRenewalPlans = (holidays, childCount = 1, existingEndDate = null, existingStartDate = null) => {
  // For renewal, we want to merge dates - keep original start date and extend end date
  let startDate;
  if (existingStartDate) {
    // Use the original subscription start date to maintain historical data
    startDate = dayjs(existingStartDate);
  } else {
    // Fallback: Default behavior: start 2 days from today
    startDate = dayjs().add(2, "day");
    while (!isWorkingDay(startDate, holidays)) {
      startDate = startDate.add(1, "day");
    }
  }
  
  const discounts =
    childCount >= 2
      ? { 22: 0.05, 66: 0.15, 132: 0.2 }
      : { 22: 0, 66: 0.05, 132: 0.1 };

  // Calculate renewal end dates by extending from existing end date or from start date
  let renewalStartDate;
  if (existingEndDate) {
    // Start calculating additional working days from the day after existing subscription ends
    renewalStartDate = dayjs(existingEndDate).add(1, "day");
    // Ensure the renewal calculation start date is a working day
    while (!isWorkingDay(renewalStartDate, holidays)) {
      renewalStartDate = renewalStartDate.add(1, "day");
    }
  } else {
    renewalStartDate = startDate;
  }

  const plans = [
    {
      id: 1,
      label: discounts[22] > 0 
        ? `22 Working Days - Rs. ${Math.round(
            22 * BASE_PRICE_PER_DAY * (1 - discounts[22]) * childCount
          ).toLocaleString("en-IN")} (${discounts[22] * 100}% OFF)`
        : `22 Working Days - Rs. ${Math.round(
            22 * BASE_PRICE_PER_DAY * childCount
          ).toLocaleString("en-IN")}`,
      workingDays: 22,
      price: Math.round(
        22 * BASE_PRICE_PER_DAY * (1 - discounts[22]) * childCount
      ),
      discount: discounts[22],
      isOneMonth: true,
      startDate,
      endDate: calculateEndDateByWorkingDays(renewalStartDate, 22, holidays),
    },
    {
      id: 3,
      label: discounts[66] > 0
        ? `66 Working Days - Rs. ${Math.round(
            66 * BASE_PRICE_PER_DAY * (1 - discounts[66]) * childCount
          ).toLocaleString("en-IN")} (${discounts[66] * 100}% OFF)`
        : `66 Working Days - Rs. ${Math.round(
            66 * BASE_PRICE_PER_DAY * childCount
          ).toLocaleString("en-IN")}`,
      workingDays: 66,
      price: Math.round(
        66 * BASE_PRICE_PER_DAY * (1 - discounts[66]) * childCount
      ),
      discount: discounts[66],
      isOneMonth: false,
      startDate,
      endDate: calculateEndDateByWorkingDays(renewalStartDate, 66, holidays),
    },
    {
      id: 6,
      label: discounts[132] > 0
        ? `132 Working Days - Rs. ${Math.round(
            132 * BASE_PRICE_PER_DAY * (1 - discounts[132]) * childCount
          ).toLocaleString("en-IN")} (${discounts[132] * 100}% OFF)`
        : `132 Working Days - Rs. ${Math.round(
            132 * BASE_PRICE_PER_DAY * childCount
          ).toLocaleString("en-IN")}`,
      workingDays: 132,
      price: Math.round(
        132 * BASE_PRICE_PER_DAY * (1 - discounts[132]) * childCount
      ),
      discount: discounts[132],
      isOneMonth: false,
      startDate,
      endDate: calculateEndDateByWorkingDays(renewalStartDate, 132, holidays),
    },
  ];
  return plans;
};

const RenewalSubscriptionPlanStep = ({
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
  const [hideMessage, setHideMessage] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreedError, setAgreedError] = useState(false);

  useEffect(() => {
    // Determine if there's an existing subscription for renewal mode
    const existingEndDate = initialSubscriptionPlan?.endDate 
      ? initialSubscriptionPlan.endDate 
      : null;
    
    const existingStartDate = existingSubscription?.startDate 
      ? existingSubscription.startDate 
      : null;
    
    const computedPlans = calculateRenewalPlans(holidays, numberOfChildren, existingEndDate, existingStartDate);
    setPlans(computedPlans);

    if (
      initialSubscriptionPlan &&
      initialSubscriptionPlan.planId // includes 'byDate' or numeric id
    ) {
      setSelectedPlan(initialSubscriptionPlan.planId.toString());
      if (initialSubscriptionPlan.planId === "byDate") {
        // Defensive null check and ensure dayjs conversion
        setStartDate(
          initialSubscriptionPlan.startDate
            ? dayjs(initialSubscriptionPlan.startDate)
            : null
        );
        setEndDate(
          initialSubscriptionPlan.endDate ? dayjs(initialSubscriptionPlan.endDate) : null
        );
      } else {
        const selectedPlanObj = computedPlans.find(
          (plan) => plan.id.toString() === initialSubscriptionPlan.planId.toString()
        );
        if (selectedPlanObj) {
          setStartDate(selectedPlanObj.startDate);
          setEndDate(selectedPlanObj.endDate);
        }
      }
    } else if (computedPlans.length > 0) {
      // fallback defaults
      setSelectedPlan(computedPlans[0].id.toString());
      setStartDate(computedPlans[0].startDate);
      setEndDate(computedPlans[0].endDate);
    }
  }, [holidays, numberOfChildren, initialSubscriptionPlan, existingSubscription]);

  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    setSelectedPlan(newPlanId);
    setErrors({ startDate: false, endDate: false, dateOrder: false });
    if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
      onSubscriptionPlanChange({ planId: newPlanId });
    }

    if (newPlanId === "byDate") {
      setStartDate(null);
      setEndDate(null);
      if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
        onSubscriptionPlanChange({ startDate: null, endDate: null });
      }
    } else {
      const selectedPlanObj = plans.find(
        (plan) => plan.id.toString() === newPlanId
      );
      if (selectedPlanObj) {
        setStartDate(selectedPlanObj.startDate);
        setEndDate(selectedPlanObj.endDate);
        if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
          onSubscriptionPlanChange({
            startDate: selectedPlanObj.startDate,
            endDate: selectedPlanObj.endDate,
          });
        }
      }
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setErrors({ ...errors, startDate: false, dateOrder: false });
    if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
      onSubscriptionPlanChange({ startDate: newValue });
    }

    if (selectedPlan !== "byDate") {
      const selected = plans.find((plan) => plan.id.toString() === selectedPlan);
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
    if (onSubscriptionPlanChange && typeof onSubscriptionPlanChange === 'function') {
      onSubscriptionPlanChange({ endDate: newValue });
    }
  };

  const currentPlan =
    selectedPlan !== "byDate"
      ? plans.find((plan) => plan.id.toString() === selectedPlan)
      : null;

  const handleNext = async () => {
    if (!agreed) {
      setAgreedError(true);
      return;
    }
    setAgreedError(false);

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
      totalPrice = totalWorkingDays * BASE_PRICE_PER_DAY * numberOfChildren;
    }

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
        path: "renewal-subscription-plan",
        _id,
      });
      
      if (res) {
        // For renewal mode, pass the plan data to the next step
        if (typeof nextStep === 'function') {
          nextStep(payload);
        } else {
          nextStep();
        }
      }
    } catch (error) {
      console.error("Error during renewal subscription plan selection:", error);
    }
  };

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
            SELECT YOUR RENEWAL SUBSCRIPTION PLAN*{" "}
            <Typography component="span" variant="caption" color="#888">
              (All Taxes included)
            </Typography>
          </Typography>

          <RadioGroup
            value={selectedPlan}
            onChange={handlePlanChange}
            className="radiogroub"
          >
            {/* Render Standard Plans */}
            {plans.map((plan) => (
              <Paper
                key={plan.id}
                elevation={selectedPlan === plan.id.toString() ? 8 : 2}
                sx={{
                  borderRadius: "12px",
                  mb: 2,
                  px: 2,
                  py: 2,
                  border: selectedPlan === plan.id.toString()
                    ? "2px solid #FF6A00"
                    : "1px solid #ddd",
                  boxShadow: selectedPlan === plan.id.toString()
                    ? "0 4px 15px rgba(255,106,0,0.07)"
                    : undefined,
                  bgcolor: selectedPlan === plan.id.toString()
                    ? "#FFFAF4"
                    : "#fff",
                  transition: "box-shadow .2s",
                }}
              >
                <FormControlLabel
                  value={plan.id.toString()}
                  control={
                    <Radio
                      sx={{
                        color: selectedPlan === plan.id.toString()
                          ? "#FF6A00"
                          : "rgba(0, 0, 0, 0.55)",
                        "&.Mui-checked": { color: "#FF6A00" },
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: "#232323" }} variant="body1">
                        {plan.label}
                      </Typography>
                      <Typography fontSize={13} color="#888">
                        ({plan.workingDays} working days)
                      </Typography>
                    </Box>
                  }
                />

                {/* Subscription Details for selected plan */}
                {selectedPlan === plan.id.toString() && (
                  <Box mt={2} sx={{ ml: 4 }}>
                    <Typography fontSize={13} color="#232323">
                      <strong>Start Date:</strong>{" "}
                      {startDate && startDate.format("DD MMM YYYY")}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>End Date:</strong>{" "}
                      {endDate && endDate.format("DD MMM YYYY")}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>Total Working Days:</strong> {plan.workingDays}
                    </Typography>
                    <Typography fontSize={13} color="#232323">
                      <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
                    </Typography>
                    {numberOfChildren > 1 && (
                      <>
                        <Typography fontSize={13} color="#232323">
                          <strong>Number of Children:</strong> {numberOfChildren}
                        </Typography>
                        <Typography fontSize={13} color="#232323">
                          <strong>Total Price Calculation:</strong> {plan.workingDays} days × Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren}
                        </Typography>
                      </>
                    )}
                    {plan.discount > 0 && (
                      <Typography
                        fontSize={13}
                        color="#FF6A00"
                        sx={{ mt: 1, fontWeight: 600 }}
                      >
                        Saved Rs.{" "}
                        {Math.round(
                          plan.workingDays *
                          BASE_PRICE_PER_DAY *
                          numberOfChildren *
                          plan.discount
                        ).toLocaleString("en-IN")}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
            ))}
          </RadioGroup>

          <OffersSection numberOfChildren={numberOfChildren} />

          <Typography mt={2} fontSize={12}>
            <strong>
              Note: Your renewal will extend your current subscription period, maintaining your original start date.
              Per Day Meal = Rs. {BASE_PRICE_PER_DAY} (No. of Days × Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren} {numberOfChildren > 1 ? "children" : "child"} = Subscription Amount)
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
        workingDays={
          selectedPlan !== "byDate" && currentPlan
            ? currentPlan.workingDays
            : calculateWorkingDays(startDate, endDate, holidays)
        }
        holidays={holidays}
        hideMessage={hideMessage}
      />
    </LocalizationProvider>
  );
};

export default RenewalSubscriptionPlanStep;