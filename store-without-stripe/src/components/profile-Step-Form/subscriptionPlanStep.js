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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import EventIcon from "@mui/icons-material/Event";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/en";
import CalendarPopup from "@components/profile-Step-Form/CalendarPopup";

// ——— DAY.JS SETUP ———————————————————————————————————————
// Extend with plugins, set locale and start-of-week = Monday
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.locale("en");
dayjs.updateLocale("en", { weekStart: 1 });

const dummyPlans = [
  { id: 1, label: "24 Working Days - Rs. 4,800" },
  { id: 2, label: "72 Working Days - Rs. 14,400" },
  { id: 3, label: "144 Working Days - Rs. 28,800" },
  { id: 4, label: "288 Working Days - Rs. 57,600" },
];

const WEEKENDS_AND_HOLIDAYS = [5, 6, 10, 12, 13, 14, 18, 19, 20, 26, 27];
const TODAY = 8;

const SubscriptionPlanStep = ({ nextStep, prevStep }) => {
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    dateOrder: false,
  });

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
        dateOrder:
          endDate && startDate && dayjs(endDate).isBefore(startDate, "day"),
      };
      setErrors(newErrors);
      if (newErrors.startDate || newErrors.endDate || newErrors.dateOrder)
        return;
    }
    nextStep();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        {/* Left Image */}
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

        {/* Right Content */}
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Typography variant="h6" fontWeight="bold">
            SUBSCRIPTION PLAN:
          </Typography>
          <Typography
            sx={{ color: "#FF6A00", fontWeight: 600, mt: 2, mb: 1 }}
            variant="subtitle2"
          >
            SELECT YOUR SUBSCRIPTION PLAN*
            <Typography component="span" variant="caption" color="#888">
              {" "}
              (Taxes not included)
            </Typography>
          </Typography>

          <RadioGroup value={selectedPlan} onChange={handlePlanChange}>
            {dummyPlans.map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  mb: 1,
                  px: 2,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor:
                    selectedPlan === String(plan.id) ? "#FF6A00" : "#fff",
                }}
              >
                <FormControlLabel
                  value={String(plan.id)}
                  control={
                    <Radio
                      sx={{
                        color:
                          selectedPlan === String(plan.id)
                            ? "#fff"
                            : "rgba(0,0,0,0.6)",
                        "&.Mui-checked": {
                          color:
                            selectedPlan === String(plan.id)
                              ? "#fff"
                              : "#FF6A00",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        ml: 1,
                        color:
                          selectedPlan === String(plan.id) ? "#fff" : "inherit",
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
                        color:
                          selectedPlan === String(plan.id) ? "#fff" : "#FF6A00",
                      }}
                    />
                  </IconButton>
                )}
              </Box>
            ))}

            {/* Date‑Based Plan */}
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
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
                          : "rgba(0,0,0,0.6)",
                      "&.Mui-checked": { color: "#FF6A00" },
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
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newVal) => {
                        setStartDate(newVal);
                        setErrors((s) => ({
                          ...s,
                          startDate: false,
                          dateOrder: false,
                        }));
                      }}
                      shouldDisableDate={(date) =>
                        dayjs(date).isBefore(dayjs(), "day") ||
                        [0, 6].includes(date.day())
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

                  <Grid item xs={6}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                        setErrors({
                          ...errors,
                          endDate: false,
                          dateOrder: false,
                        });
                      }}
                      // don’t allow anything before the chosen start date
                      minDate={startDate || dayjs()}
                      // disable if it’s not the last day of its month OR if it’s Sat/Sun
                      shouldDisableDate={(date) => {
                        const isLastDayOfMonth = date.isSame(
                          date.endOf("month"),
                          "day"
                        );
                        const isWeekend = date.day() === 0 || date.day() === 6;
                        return !isLastDayOfMonth || isWeekend;
                      }}
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
            End Date must be the last day of the month and after Start Date.
          </Typography>

          <Box
            mt={3}
            p={2}
            bgcolor="#FFF3EB"
            borderRadius={1}
            border="1px solid #FFD6B8"
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }}
            >
              OFFERS AVAILABLE
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              <li>
                <Typography fontSize={14}>
                  Save 5% on the 150 Working Days Plan.
                </Typography>
              </li>
              <li>
                <Typography fontSize={14}>
                  Save 10% on the 260 Working Days Plan.
                </Typography>
              </li>
            </ul>
          </Box>

          <Typography mt={2} fontSize={12}>
            Note: Per Day Meal = Rs. 200 (No. of Days X Rs. 200 = Subscription
            Amount)
          </Typography>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={prevStep}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 0,
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                backgroundColor: "#FF6A00",
                borderRadius: 0,
                "&:hover": { backgroundColor: "#e65c00" },
              }}
            >
              Next ↗
            </Button>
          </Box>
        </Box>
      </Box>

      <CalendarPopup
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        weekendsAndHolidays={WEEKENDS_AND_HOLIDAYS}
        today={TODAY}
      />
    </LocalizationProvider>
  );
};

export default SubscriptionPlanStep;
