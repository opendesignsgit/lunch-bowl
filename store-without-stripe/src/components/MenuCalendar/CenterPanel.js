import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";

const CenterPanel = ({
  isSmall,
  currentMonth,
  currentYear,
  handleMonthChange,
  calendarDates,
  selectedDate,
  setSelectedDate,
  isHoliday,
  dummyHolidays,
  subscriptionStart,
  subscriptionEnd,
  sx,
}) => {
  return (
    <Box 
      sx={{ 
        width: isSmall ? "100%" : "45%",
        p: 2,
        ...sx 
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
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
        fontWeight="bold"
        fontSize="0.875rem"
        mb={1}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <Typography key={day}>{day}</Typography>
        ))}
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {calendarDates.map((date, idx) => {
          if (date === null) return <Box key={idx} />;
          if (date === "disabled") {
            const dayNumber =
              idx - dayjs(`${currentYear}-${currentMonth + 1}-01`).day() + 1;
            return (
              <Box
                key={idx}
                width={32}
                height={32}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="0.875rem"
                color="#ccc"
                sx={{ mx: "auto", pointerEvents: "none" }}
              >
                {String(dayNumber).padStart(2, "0")}
              </Box>
            );
          }

          const holiday = isHoliday(date);
          const isSelected = date === selectedDate;

          return (
            <Box
              key={idx}
              onClick={() => setSelectedDate(date)}
              bgcolor={isSelected ? "#f97316" : holiday ? "#fdecea" : "#fff"}
              color={isSelected ? "#fff" : holiday ? "#e53935" : "#000"}
              borderRadius="50%"
              width={32}
              height={32}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="0.875rem"
              fontWeight="bold"
              sx={{ cursor: "pointer", mx: "auto" }}
            >
              {String(date).padStart(2, "0")}
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography fontWeight="bold" textAlign="center" gutterBottom>
        HOLIDAY LIST
      </Typography>
      {dummyHolidays.map((h, i) => (
        <Typography
          key={i}
          fontSize="14px"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          🔸 {dayjs(h.date).format("MMM DD")} - {h.name}
        </Typography>
      ))}
      <Box display="flex" justifyContent="flex-end">
        <Typography variant="caption" mt={1} display="block">
          (<span style={{ color: "#e53935" }}>◯</span>) Denotes Holiday.
        </Typography>
      </Box>
    </Box>
  );
};

export default CenterPanel;