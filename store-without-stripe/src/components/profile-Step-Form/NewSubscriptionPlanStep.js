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
  calculatePlans
} from "./subscriptionUtils";
import { CustomDateDetails, OffersSection } from "./SubscriptionComponents";

const NewSubscriptionPlanStep = ({
  nextStep,
  prevStep,
  _id,
  numberOfChildren = 1,
  initialSubscriptionPlan = {},
  onSubscriptionPlanChange,
}) => {
  const router = useRouter();
  const { holidays, holidaysLoading } = useHolidays();
  const isWorkingDayMemo = useCallback(
    (date) => isWorkingDay(date, holidays),
    [holidays]
  );

  // Custom start dates for each plan
  const [customStartDates, setCustomStartDates] = useState({});
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
    const computedPlans = calculatePlans(holidays, numberOfChildren);

    // Initialize customStartDates from initialSubscriptionPlan startDate if plan is not 'byDate'
    let savedCustomStartDates = {};
    if (
      initialSubscriptionPlan &&
      initialSubscriptionPlan.planId &&
      initialSubscriptionPlan.planId !== "byDate" &&
      initialSubscriptionPlan.startDate
    ) {
      // Map saved start date for the selected plan id (assuming it's numeric)
      savedCustomStartDates[parseInt(initialSubscriptionPlan.planId, 10)] = dayjs(initialSubscriptionPlan.startDate);
    }

    setCustomStartDates(savedCustomStartDates);

    // Recalculate plans with saved custom dates
    const plansWithSavedDates = calculatePlans(holidays, numberOfChildren, savedCustomStartDates);
    setPlans(plansWithSavedDates);

    if (
      initialSubscriptionPlan &&
      initialSubscriptionPlan.planId // includes 'byDate' or numeric id
    ) {
      setSelectedPlan(initialSubscriptionPlan.planId.toString());

      if (initialSubscriptionPlan.planId === "byDate") {
        setStartDate(
          initialSubscriptionPlan.startDate
            ? dayjs(initialSubscriptionPlan.startDate)
            : null
        );
        setEndDate(
          initialSubscriptionPlan.endDate ? dayjs(initialSubscriptionPlan.endDate) : null
        );
      } else {
        const selectedPlanObj = plansWithSavedDates.find(
          (plan) => plan.id.toString() === initialSubscriptionPlan.planId.toString()
        );
        if (selectedPlanObj) {
          setStartDate(selectedPlanObj.startDate);
          setEndDate(selectedPlanObj.endDate);
        }
      }
    } else if (computedPlans.length > 0) {
      setSelectedPlan(computedPlans[0].id.toString());
      setStartDate(computedPlans[0].startDate);
      setEndDate(computedPlans[0].endDate);
    }
  }, [holidays, numberOfChildren, initialSubscriptionPlan]);

  const handlePlanChange = (e) => {
    const newPlanId = e.target.value;
    setSelectedPlan(newPlanId);
    setErrors({ startDate: false, endDate: false, dateOrder: false });
    onSubscriptionPlanChange({ planId: newPlanId });

    if (newPlanId === "byDate") {
      setStartDate(null);
      setEndDate(null);
      onSubscriptionPlanChange({ startDate: null, endDate: null });
    } else {
      const selectedPlanObj = plans.find(
        (plan) => plan.id.toString() === newPlanId
      );
      if (selectedPlanObj) {
        setStartDate(selectedPlanObj.startDate);
        setEndDate(selectedPlanObj.endDate);
        onSubscriptionPlanChange({
          startDate: selectedPlanObj.startDate,
          endDate: selectedPlanObj.endDate,
        });
      }
    }
  };

  // Handle custom start date for standard plans
  const handleCustomStartDateChange = (planId, newStartDate) => {
    setCustomStartDates({
      ...customStartDates,
      [planId]: newStartDate,
    });
    const selectedPlanObj = plans.find(
      (plan) => plan.id.toString() === planId.toString()
    );
    if (selectedPlanObj) {
      const newEndDate = calculateEndDateByWorkingDays(
        newStartDate,
        selectedPlanObj.workingDays,
        holidays
      );
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onSubscriptionPlanChange({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setErrors({ ...errors, startDate: false, dateOrder: false });
    onSubscriptionPlanChange({ startDate: newValue });

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
    onSubscriptionPlanChange({ endDate: newValue });
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
            SELECT YOUR SUBSCRIPTION PLAN*{" "}
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
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
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
                        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
                          <Typography fontSize={13} color="#888">
                            ({plan.workingDays} working days)
                          </Typography>
                          {plan.discount > 0 ? (
                            <>
                              <Typography fontSize={13} color="#888" sx={{ textDecoration: "line-through" }}>
                                Rs. {(plan.workingDays * BASE_PRICE_PER_DAY * numberOfChildren).toLocaleString("en-IN")}
                              </Typography>
                              <Typography fontSize={13} color="#FF6A00">
                                {plan.discount * 100}% OFF - Rs. {plan.price.toLocaleString("en-IN")}
                              </Typography>
                            </>
                          ) : (
                              <Typography fontSize={13} color="#232323">
                                Rs. {plan.price.toLocaleString("en-IN")}
                              </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                    sx={{ marginRight: 0, flex: 1 }}
                  />

                  {/* Start Date Picker for selected standard plan */}
                  {selectedPlan === plan.id.toString() && (
                    <Box sx={{ minWidth: 180, ml: 3 }}>
                      <SubscriptionDatePicker
                        type="start"
                        value={customStartDates[plan.id] || plan.startDate}
                        onChange={(newDate) =>
                          handleCustomStartDateChange(plan.id, newDate)
                        }
                        minDate={dayjs().add(2, "day")}
                        shouldDisableDate={(date) => !isWorkingDayMemo(date)}
                        label="Start Date"
                      />
                    </Box>
                  )}

                  {selectedPlan === plan.id.toString() && (
                    <IconButton
                      onClick={() => {
                        setHideMessage(false);
                        setCalendarOpen(true);
                      }}
                      sx={{ color: "#FF6A00", ml: 2 }}
                    >
                      <EventIcon />
                    </IconButton>
                  )}
                </Box>

                {/* Subscription Details */}
                {selectedPlan === plan.id.toString() && (
                  <Box mt={2} sx={{ width: "100%" }}>
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

          {selectedPlan === "byDate" && startDate && endDate && (
            <CustomDateDetails
              startDate={startDate}
              endDate={endDate}
              holidays={holidays}
              numberOfChildren={numberOfChildren}
            />
          )}

          <OffersSection numberOfChildren={numberOfChildren} />

          <Typography mt={2} fontSize={12}>
            <strong>
              Note: Per Day Meal = Rs. {BASE_PRICE_PER_DAY} (No. of Days × Rs. {BASE_PRICE_PER_DAY} × {numberOfChildren} {numberOfChildren > 1 ? "children" : "child"} = Subscription Amount)
              {selectedPlan === "byDate" && " No discounts apply to custom date selections."}
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

export default NewSubscriptionPlanStep;