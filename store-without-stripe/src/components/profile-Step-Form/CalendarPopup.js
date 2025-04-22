import React from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CalendarPopup = ({ open, onClose, weekendsAndHolidays, today }) => {
  if (!open) return null;

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
        <Box display="flex" justifyContent="center" alignItems="center" position="relative" mb={1}>
          <Typography variant="h6" fontWeight="bold">LIST OF WORKING DAYS:</Typography>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography align="center" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>
          APRIL, 2025
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
          {[...Array(1)].map((_, i) => (
            <Box key={`empty-${i}`} />
          ))}
          {[...Array(30)].map((_, i) => {
            const dayNumber = i + 1;
            const isHoliday = weekendsAndHolidays.includes(dayNumber);
            const isToday = dayNumber === today;

            return (
              <Box
                key={dayNumber}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  backgroundColor: isToday
                    ? "#FF6A00"
                    : isHoliday
                    ? "#FFE9E1"
                    : "transparent",
                  color: isToday ? "#fff" : "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  margin: "0 auto",
                }}
              >
                {String(dayNumber).padStart(2, "0")}
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default CalendarPopup;
