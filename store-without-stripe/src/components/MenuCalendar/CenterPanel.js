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
      className="MCMiddlePanel"
      sx={{
        width: isSmall ? "100%" : "45%",
        p: 2,
        ...sx,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="childslidebox"
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

      <div className="clandybox">
        <Box
          className="clandhead"
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          textAlign="center"
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Typography key={day}>
              <span>{day}</span>
            </Typography>
          ))}
        </Box>

        <Box
          className="clandbody"
          display="grid"
          gridTemplateColumns="repeat(7, 1fr)"
          gap={1}
        >
          {calendarDates.map((date, idx) => {
            if (date === null) return <Box key={idx} />;
            if (date === "disabled") {
              const dayNumber =
                idx - dayjs(`${currentYear}-${currentMonth + 1}-01`).day() + 1;
              return (
                <Box
                  key={idx}
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="0.875rem"
                  color="#ccc"
                  sx={{ mx: "auto", pointerEvents: "none" }}
                >
                  <span>{String(dayNumber).padStart(2, "0")}</span>
                </Box>
              );
            }

            const fullDate = dayjs(
              `${currentYear}-${currentMonth + 1}-${String(date).padStart(
                2,
                "0"
              )}`
            );
            const isBeforeStart = fullDate.isBefore(subscriptionStart, "day");
            const holiday = isHoliday(date);
            const isSelected = date === selectedDate;

            return (
              <Box
                className={`daybox ${
                  isSelected ? "selectday" : holiday ? "holiday" : "normalday"
                }`}
                key={idx}
                onClick={() => {
                  if (!isBeforeStart) {
                    setSelectedDate(date);
                  }
                }}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="0.875rem"
                fontWeight="bold"
                sx={{
                  cursor: isBeforeStart ? "default" : "pointer",
                  color: isBeforeStart ? "#ccc" : "inherit",
                  opacity: isBeforeStart ? 0.5 : 1,
                  mx: "auto",
                }}
              >
                <span>{String(date).padStart(2, "0")}</span>
              </Box>
            );
          })}
        </Box>
      </div>

      <div className="holylistbox">
        <h4 gutterBottom className="holylistitle">
          {" "}
          HOLIDAY LIST{" "}
        </h4>
        <ul className="holylisul">
          {dummyHolidays.map((h, i) => (
            <li key={i}>
              <strong>{dayjs(h.date).format("MMM DD")}</strong> - {h.name}
            </li>
          ))}
        </ul>
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="caption" mt={1} display="block">
            (<span style={{ color: "#e53935" }}>◯</span>) Denotes Holiday.
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default CenterPanel;
