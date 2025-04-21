import React, { useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  ArrowForward,
} from "@mui/icons-material";

const dummyChildren = [
  { id: 1, name: "Child Name 1" },
  { id: 2, name: "Child Name 2" },
];

const dummyMenus = [
  "Veg Biriyani",
  "Phulka + Chole",
  "Pav Bhaji",
  "5 Spice Fried Rice",
  "Veg Noodles",
  "Alfredo Pasta",
  "Mac and Cheese",
  "Aloo Paratha",
  "Hummus and Pita",
  "Creamy Curry Rice",
  "Ghee Rice and Dal",
];

const dummyHolidays = [
  { date: "2025-04-10", name: "Mahavir Jayanti" },
  { date: "2025-04-16", name: "Tamil New Year" },
  { date: "2025-04-18", name: "Good Friday" },
];

const subscriptionStart = dayjs("2025-02-05");
const subscriptionEnd = dayjs("2025-06-25");

const MenuCalendar = () => {
  const today = dayjs();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentMonth, setCurrentMonth] = useState(today.month());
  const [currentYear, setCurrentYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today.date());
  const [menuSelections, setMenuSelections] = useState({});
  const [activeChild, setActiveChild] = useState(0);

  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const isHoliday = (day) => {
    const date = dayjs(formatDate(day));
    const isWeekend = date.day() === 0 || date.day() === 6;
    const isCustomHoliday = dummyHolidays.find(
      (h) => h.date === formatDate(day)
    );
    return isWeekend || isCustomHoliday;
  };

  const handleMenuChange = (childId, dish) => {
    const dateKey = formatDate(selectedDate);
    setMenuSelections((prev) => ({
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [childId]: dish,
      },
    }));
  };

  const getDayName = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getCalendarGridDates = () => {
    const daysInMonth = dayjs(
      `${currentYear}-${currentMonth + 1}`
    ).daysInMonth();
    const startDay =
      (dayjs(`${currentYear}-${currentMonth + 1}-01`).day() + 6) % 7;

    const daysArray = [];
    for (let i = 0; i < startDay; i++) {
      daysArray.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = dayjs(
        `${currentYear}-${currentMonth + 1}-${String(i).padStart(2, "0")}`
      );
      if (
        currentDate.isBefore(subscriptionStart) ||
        currentDate.isAfter(subscriptionEnd)
      ) {
        daysArray.push("disabled");
      } else {
        daysArray.push(i);
      }
    }
    return daysArray;
  };

  const calendarDates = getCalendarGridDates();

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    const newMonthStart = dayjs(`${newYear}-${newMonth + 1}-01`);
    const newMonthEnd = newMonthStart.endOf("month");

    if (
      newMonthEnd.isBefore(subscriptionStart) ||
      newMonthStart.isAfter(subscriptionEnd)
    ) {
      return;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const selectedFullDate = dayjs(formatDate(selectedDate));
  const isSelectedHoliday = isHoliday(selectedDate);
  const lessThan48Hours =
    isSelectedHoliday && selectedFullDate.diff(today, "hour") < 48;

  return (
    <Box
      display="flex"
      flexDirection={isSmall ? "column" : "row"}
      bgcolor="#fff"
      maxWidth="1100px"
      mx="auto"
      borderRadius={2}
      boxShadow={2}
      overflow="hidden"
    >
      {/* Left Panel */}
      <Box
        width={isSmall ? "100%" : "30%"}
        borderRight={isSmall ? "none" : "1px solid #ddd"}
        borderBottom={isSmall ? "1px solid #ddd" : "none"}
        p={2}
        maxHeight={isSmall ? "none" : "600px"}
        overflow="auto"
      >
        <Typography fontWeight="bold" align="center" mb={1}>
          {dayjs(`${currentYear}-${currentMonth + 1}`)
            .format("MMMM")
            .toUpperCase()}{" "}
          MENU LIST
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          color="#f97316"
          fontWeight="bold"
          mb={1}
        >
          <IconButton
            onClick={() =>
              setActiveChild(
                (activeChild - 1 + dummyChildren.length) % dummyChildren.length
              )
            }
          >
            <ChevronLeft />
          </IconButton>
          {dummyChildren[activeChild].name.toUpperCase()}
          <IconButton
            onClick={() =>
              setActiveChild((activeChild + 1) % dummyChildren.length)
            }
          >
            <ChevronRight />
          </IconButton>
        </Box>

        <Box
          borderTop="0.2px solid #ccc"
          borderBottom="0.5px solid #ccc"
          py={1}
          mb={1}
          display="flex"
          justifyContent="space-between"
        >
          <Typography fontSize="14px" fontWeight="bold">
            DATE
          </Typography>
          <Typography fontSize="14px" fontWeight="bold">
            FOOD LIST
          </Typography>
        </Box>

        {Array.from(
          {
            length: dayjs(`${currentYear}-${currentMonth + 1}`).daysInMonth(),
          },
          (_, i) => i + 1
        ).map((day) => {
          const dateKey = formatDate(day);
          const dish = menuSelections[dateKey]?.[dummyChildren[activeChild].id];
          const isOutOfRange =
            dayjs(dateKey).isBefore(subscriptionStart) ||
            dayjs(dateKey).isAfter(subscriptionEnd);
          return (
            <Box
              key={day}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={0.5}
              borderBottom="1px solid #eee"
              color={isOutOfRange ? "#bbb" : "inherit"}
            >
              <Typography variant="body2">{formatDate(day)}</Typography>
              <Box display="flex" alignItems="center" maxWidth="140px">
                <Typography variant="body2" noWrap>
                  {dish || "-"}
                </Typography>
                {!isOutOfRange && (
                  <Edit fontSize="small" sx={{ color: "#f97316", ml: 0.5 }} />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Center Panel */}
      <Box width={isSmall ? "100%" : "40%"} p={2}>
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

      {/* Right Panel */}
      <Box
        width={isSmall ? "100%" : "30%"}
        bgcolor="#f97316"
        color="#fff"
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography fontSize="3rem" fontWeight="bold" textAlign="center">
          {String(selectedDate).padStart(2, "0")}
        </Typography>
        <Typography fontSize="1rem" fontWeight="500" textAlign="center" mb={2}>
          {getDayName(selectedDate).toUpperCase()}
        </Typography>

        {(() => {
          const selectedDateObj = dayjs(formatDate(selectedDate));
          const holiday = isHoliday(selectedDate);
          const isSelectedHoliday = !!holiday;
          const lessThan48Hours =
            isSelectedHoliday && selectedDateObj.diff(dayjs(), "hour") < 48;

          if (lessThan48Hours) {
            return (
              <Box
                bgcolor="#fff"
                color="#000"
                borderRadius={2}
                p={2}
                textAlign="center"
                mb={2}
              >
                <Typography fontWeight="bold">
                  Orders must be placed at least 48 hours in advance.
                </Typography>
              </Box>
            );
          }

          if (selectedDateObj.day() === 0) {
            return (
              <Box
                bgcolor="#fff"
                color="#000"
                borderRadius={2}
                p={2}
                textAlign="center"
                mb={2}
              >
                <Typography fontWeight="bold">
                  The Lunch Bowl is closed on Sundays.
                </Typography>
              </Box>
            );
          }

          return (
            <>
              <Typography fontWeight="bold" textAlign="center" mb={2}>
                SELECT YOUR CHILD'S MENU
              </Typography>
              {dummyChildren.map((child) => (
                <Box key={child.id} mb={2}>
                  <Typography fontWeight="500" mb={0.5}>
                    {child.name.toUpperCase()}
                  </Typography>
                  <Box bgcolor="#fff" borderRadius={2} px={1.5} py={0.5}>
                    <Select
                      value={
                        menuSelections[formatDate(selectedDate)]?.[child.id] ||
                        ""
                      }
                      onChange={(e) =>
                        handleMenuChange(child.id, e.target.value)
                      }
                      fullWidth
                      variant="standard"
                      disableUnderline
                      sx={{ fontSize: "0.875rem", color: "#000" }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5, // each item ~48px height, show 4 items max before scroll
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Select your Child’s Dish</MenuItem>
                      {dummyMenus.map((menu, i) => (
                        <MenuItem key={i} value={menu}>
                          {menu}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Box>
              ))}

              {isSelectedHoliday ? (
                <Box mb={2}>
                  <Typography variant="body2" fontStyle="italic">
                    Note: This day is a holiday – additional charges apply.
                  </Typography>
                </Box>
              ) : (
                <FormControlLabel
                  control={<Checkbox sx={{ color: "white" }} />}
                  label={
                    <Typography variant="body2">
                      Save Selected Menus for Upcoming Months
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />
              )}

              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  sx={{
                    bgcolor: "#fff",
                    color: "#f97316",
                    borderColor: "#fff",
                    textTransform: "none",
                    px: 3,
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: "#fff",
                    color: "#f97316",
                    borderColor: "#fff",
                    textTransform: "none",
                    px: 3,
                    fontWeight: "bold",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  {isSelectedHoliday ? "Pay" : "Save"}
                </Button>
              </Box>
            </>
          );
        })()}
      </Box>
    </Box>
  );
};

export default MenuCalendar;
