import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";

// Dummy holidays data
const dummyHolidays = [
  { date: "2023-01-26", name: "Republic Day" },
  { date: "2023-08-15", name: "Independence Day" },
  { date: "2023-10-02", name: "Gandhi Jayanti" },
  { date: "2023-12-25", name: "Christmas" },
  // Add more holidays as needed
];

const SubscriptionDatePicker = ({
  type = "start", // "start" or "end"
  value,
  onChange,
  minDate,
  maxDate,
}) => {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs(value).month());
  const [currentYear, setCurrentYear] = useState(dayjs(value).year());
  const [selectedDate, setSelectedDate] = useState(value);

  const isHoliday = (date) => {
    return dummyHolidays.some(
      (holiday) => dayjs(holiday.date).isSame(date, "day")
    );
  };

  const isWeekend = (date) => {
    const day = dayjs(date).day();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isDisabled = (date) => {
    if (type === "start") {
      // For start date, disable past dates and holidays/weekends
      return (
        dayjs(date).isBefore(minDate, "day") ||
        isHoliday(date) ||
        isWeekend(date)
      );
    } else {
      // For end date, only disable if before start date
      return dayjs(date).isBefore(minDate, "day");
    }
  };

  const handleMonthChange = (delta) => {
    const newDate = dayjs(`${currentYear}-${currentMonth + 1}-01`)
      .add(delta, "month");
    setCurrentMonth(newDate.month());
    setCurrentYear(newDate.year());
  };

  const generateCalendarDates = () => {
    const startOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
    const daysInMonth = startOfMonth.daysInMonth();
    const startDay = startOfMonth.day();

    const dates = [];
    // Add empty slots for days before the 1st of the month
    for (let i = 0; i < startDay; i++) {
      dates.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs(`${currentYear}-${currentMonth + 1}-${i}`);
      dates.push(i);
    }

    return dates;
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    
    const date = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
    
    if (type === "end") {
      // For end date, find the last working day of the month if selected date is month end
      const endOfMonth = dayjs(date).endOf("month");
      if (date.isSame(endOfMonth, "day")) {
        let lastWorkingDay = endOfMonth;
        while (isHoliday(lastWorkingDay)) {
          lastWorkingDay = lastWorkingDay.subtract(1, "day");
        }
        setSelectedDate(lastWorkingDay);
      } else {
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(date);
    }
  };

  const handleApply = () => {
    onChange(selectedDate);
    setOpen(false);
  };

  const calendarDates = generateCalendarDates();

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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Select {type === "start" ? "Start" : "End"} Date
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              p: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <IconButton onClick={() => handleMonthChange(-1)}>
                <ChevronLeft />
              </IconButton>
              <Typography fontWeight="bold">
                {dayjs(`${currentYear}-${currentMonth + 1}`)
                  .format("MMMM, YYYY")
                  .toUpperCase()}
              </Typography>
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

                const dateObj = dayjs(`${currentYear}-${currentMonth + 1}-${date}`);
                const disabled = isDisabled(dateObj);
                const isHolidayDate = isHoliday(dateObj);
                const isSelected = selectedDate && selectedDate.isSame(dateObj, "day");

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
                        : "text.primary",
                      "&:hover": {
                        bgcolor: !disabled && !isSelected && "action.hover",
                      },
                    }}
                  >
                    <Typography variant="body2">{date}</Typography>
                  </Box>
                );
              })}
            </Box>

            {type === "start" && (
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary">
                  Note: Start date must be a working day (Mon-Fri, non-holiday)
                </Typography>
              </Box>
            )}

            {type === "end" && (
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary">
                  Note: If month end falls on holiday, last working day will be selected
                </Typography>
              </Box>
            )}

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleApply}>
                Apply
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionDatePicker;