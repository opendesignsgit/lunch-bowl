import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import the plugin
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import the plugin

// Extend dayjs with the plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const WorkingDaysCalendar = ({ 
  open, 
  onClose, 
  startDate, 
  workingDays 
}) => {
  if (!open) return null;

  // Calculate the end date based on working days
  const endDate = calculateEndDateByWorkingDays(startDate, workingDays);
  
  // Get month and year from start date
  const month = startDate.month();
  const year = startDate.year();
  const monthStart = dayjs().month(month).year(year).startOf('month');
  const daysInMonth = monthStart.daysInMonth();

  // Adjust start day to make Monday the first day (1)
  const adjustedStartDay = monthStart.day() === 0 ? 6 : monthStart.day() - 1;

  // Check if date is within the active period
  const isActiveDate = (day) => {
    const currentDate = monthStart.date(day);
    return (
      currentDate.isSameOrAfter(startDate, 'day') && 
      currentDate.isSameOrBefore(endDate, 'day') &&
      currentDate.day() !== 0 && 
      currentDate.day() !== 6
    );
  };

  // Check if date is in the past (before today)
  const isPastDate = (day) => {
    return monthStart.date(day).isBefore(dayjs(), 'day');
  };

  return (
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
            YOUR SUBSCRIPTION WORKING DAYS
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography align="center" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>
          {monthStart.format('MMMM, YYYY')}
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
          {[...Array(adjustedStartDay)].map((_, i) => (
            <Box key={`empty-start-${i}`} />
          ))}
          
          {/* Calendar days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const dayNumber = i + 1;
            const currentDate = monthStart.date(dayNumber);
            const isWeekend = [6, 0].includes(currentDate.day());
            const isActive = isActiveDate(dayNumber);
            const isPast = isPastDate(dayNumber);
            const isToday = currentDate.isSame(dayjs(), 'day');
            
            return (
              <Box
                key={dayNumber}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  backgroundColor: isToday
                    ? "#FF6A00"
                    : isActive
                    ? "#4CAF50" // Green for active working days
                    : isWeekend
                    ? "#FFE9E1" // Light orange for weekends
                    : "transparent",
                  color: isToday 
                    ? "#fff" 
                    : isActive
                    ? "#fff"
                    : isPast
                    ? "#9e9e9e" // Grey for past dates
                    : "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  margin: "0 auto",
                  opacity: isPast ? 0.5 : 1,
                  border: isActive ? "2px solid #2E7D32" : "none",
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
          gap={3}
          flexWrap="wrap"
        >
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">
              Your Working Days
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#FFE9E1",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">
              Weekends & Holidays
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                mr: 1,
              }}
            />
            <Typography fontSize="0.875rem">
              Past Dates
            </Typography>
          </Box>
        </Box>

        <Typography align="center" mt={2} fontSize="0.875rem">
          Subscription Period: {startDate.format('DD MMM YYYY')} - {endDate.format('DD MMM YYYY')}
        </Typography>
      </Paper>
    </Box>
  );
};

// Helper function to calculate end date (same as in parent component)
const calculateEndDateByWorkingDays = (startDate, workingDays) => {
  let count = 0;
  let current = dayjs(startDate).add(2, 'day');
  
  while (count < workingDays) {
    if (current.day() !== 0 && current.day() !== 6) {
      count++;
    }
    if (count < workingDays) {
      current = current.add(1, 'day');
    }
  }
  
  return current;
};

export default WorkingDaysCalendar;