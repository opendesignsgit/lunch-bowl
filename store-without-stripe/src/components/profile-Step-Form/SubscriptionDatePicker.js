import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Event as EventIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

// Extended dummy holidays data
const HOLIDAYS = [
  { date: "2023-06-26", name: "Republic Day" },
  { date: "2023-06-08", name: "Holi" },
  { date: "2023-08-15", name: "Independence Day" },
  { date: "2023-10-02", name: "Gandhi Jayanti" },
  { date: "2023-12-25", name: "Christmas" },
  // Add more holidays as needed
];

const isWeekend = (date) => [0, 6].includes(dayjs(date).day()); // Sunday (0) or Saturday (6)
const isHoliday = (date) =>
    HOLIDAYS.some(
      (h) =>
        dayjs(h.date).month() === dayjs(date).month() &&
        dayjs(h.date).date() === dayjs(date).date()
    );
const isWorkingDay = (date) => !isWeekend(date) && !isHoliday(date);

const getLastWorkingDayOfMonth = (date) => {
  let lastDay = dayjs(date).endOf("month");
  while (!isWorkingDay(lastDay)) {
    lastDay = lastDay.subtract(1, "day");
  }
  return lastDay;
};

const SubscriptionDatePicker = ({
  type = "start",
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs(value).month());
  const [currentYear, setCurrentYear] = useState(dayjs(value).year());

  const handleMonthChange = (delta) => {
    const newDate = dayjs(`${currentYear}-${currentMonth + 1}-01`).add(
      delta,
      "month"
    );
    setCurrentMonth(newDate.month());
    setCurrentYear(newDate.year());
  };

  const generateCalendarDates = () => {
    const startOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
    const daysInMonth = startOfMonth.daysInMonth();
    const startDay = startOfMonth.day();

    return Array.from({ length: 42 }, (_, i) => {
      if (i < startDay || i >= startDay + daysInMonth) return null;
      return i - startDay + 1;
    });
  };

  const calendarDates = useMemo(generateCalendarDates, [
    currentMonth,
    currentYear,
  ]);

  const handleDateSelect = (day) => {
    if (!day) return;

    const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);

    if (type === "end") {
      // For end date, always select the last working day of the month
      const selectedDate = getLastWorkingDayOfMonth(date);
      onChange(selectedDate);
    } else {
      // For start date, allow selection of any working day except weekends
      if (!isWeekend(date)) {
        onChange(date);
      }
    }
  };

  const isDateDisabled = (date) => {
    const dayjsDate = dayjs(`${currentYear}-${currentMonth + 1}-${date}`);

    // Common disabled conditions
    if (dayjsDate.isBefore(minDate, "day")) return true;
    if (maxDate && dayjsDate.isAfter(maxDate, "day")) return true;

    // Additional conditions based on type
    if (type === "start") return isWeekend(dayjsDate);

    // Only allow the last working day for the end date
    if (type === "end") {
      const lastWorkingDay = getLastWorkingDayOfMonth(
        dayjs(`${currentYear}-${currentMonth + 1}-01`)
      );
      return !dayjsDate.isSame(lastWorkingDay, "day");
    }

    return false;
  };

  const lastWorkingDay = getLastWorkingDayOfMonth(
    dayjs(`${currentYear}-${currentMonth + 1}-01`)
  );

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<EventIcon />}
        sx={{ textTransform: "none" }}
      >
        {value ? dayjs(value).format("DD MMM YYYY") : `Select ${type} date`}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Select {type === "start" ? "Start" : "End"} Date
          <Box sx={{ mt: 1 }}>
            <Chip
              label={dayjs(`${currentYear}-${currentMonth + 1}-01`).format(
                "MMMM YYYY"
              )}
              color="primary"
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <IconButton onClick={() => handleMonthChange(-1)}>
                <ChevronLeft />
              </IconButton>
              <IconButton onClick={() => handleMonthChange(1)}>
                <ChevronRight />
              </IconButton>
            </Box>

            <Box
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
              textAlign="center"
              mb={1}
            >
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <Typography key={day} variant="caption" color="textSecondary">
                  {day}
                </Typography>
              ))}
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
              {calendarDates.map((date, idx) => {
                if (date === null) return <Box key={idx} />;

                const dateObj = dayjs(
                  `${currentYear}-${currentMonth + 1}-${date}`
                );
                const disabled = isDateDisabled(date);
                const isSelected = value && value.isSame(dateObj, "day");
                const isHolidayDate = isHoliday(dateObj);
                const isWeekendDate = isWeekend(dateObj);

                return (
                  <Box
                    key={idx}
                    onClick={() => !disabled && handleDateSelect(date)}
                    borderRadius="50%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height={36}
                    sx={{
                      cursor: disabled ? "default" : "pointer",
                      mx: "auto",
                      bgcolor: isSelected ? "primary.main" : "transparent",
                      color: isSelected
                        ? "common.white"
                        : disabled
                        ? "text.disabled"
                        : isHolidayDate
                        ? "error.main"
                        : isWeekendDate
                        ? "text.secondary"
                        : "text.primary",
                      "&:hover": !disabled && {
                        bgcolor: isSelected ? "primary.dark" : "action.hover",
                      },
                      opacity: disabled ? 0.3 : 1, // Fade out disabled dates
                    }}
                  >
                    <Typography variant="body2">{date}</Typography>
                  </Box>
                );
              })}
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Box>
                {type === "start" && (
                  <Typography variant="caption" color="text.secondary">
                    Weekends (Sat-Sun) are not selectable
                  </Typography>
                )}
                {type === "end" && (
                  <Typography variant="caption" color="text.secondary">
                    Only the last working day is selectable
                  </Typography>
                )}
              </Box>
              <Box>
                <Button onClick={() => setOpen(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  disabled={!value}
                >
                  Confirm
                </Button>
              </Box>
            </Box>

            {HOLIDAYS.some((h) =>
              dayjs(h.date).isSame(
                dayjs(`${currentYear}-${currentMonth + 1}-01`),
                "month"
              )
            ) && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Holidays this month:
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
                >
                  {HOLIDAYS.filter((h) =>
                    dayjs(h.date).isSame(
                      dayjs(`${currentYear}-${currentMonth + 1}-01`),
                      "month"
                    )
                  ).map((h) => (
                    <Chip
                      key={h.date}
                      label={`${dayjs(h.date).format("D")}: ${h.name}`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionDatePicker;
