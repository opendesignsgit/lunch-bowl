import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Box, useMediaQuery, useTheme, Dialog } from "@mui/material";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import MealPlanDialog from "./MealPlanDialog";
import useDetails from "@hooks/useDetails";

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
  { date: "2025-05-09", name: "Mahavir Jayanti" },
  { date: "2025-04-16", name: "Tamil New Year" },
  { date: "2025-04-18", name: "Good Friday" },
];

const subscriptionStart = dayjs("2025-04-01");
const subscriptionEnd = dayjs("2025-05-31");

const MenuCalendar = () => {
  const today = dayjs();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const _id = "67ff446d67091f18f00d3c2d";

  const [currentMonth, setCurrentMonth] = useState(today.month());
  const [currentYear, setCurrentYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today.date());
  const [menuSelections, setMenuSelections] = useState({});
  const [activeChild, setActiveChild] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mealPlanDialog, setMealPlanDialog] = useState({
    open: false,
    startDate: null,
  });
  const { fetchDetailsHandler } = useDetails();
  // State for fetched data
  const [children, setChildren] = useState([]);
  const [subscriptionStart, setSubscriptionStart] = useState(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _id = "67ff446d67091f18f00d3c2d";

    const fetchDetails = async () => {
      try {
        // Replace with your API endpoint
        console.log("Fetching details for ID:", _id);

        const response = await axios.post("/customer/get-menu-calendar", {
          _id,
          path: "menu-Calendar-Page",
        });
        console.log("Fetched details:", response);
        const {
          startDate,
          endDate,
          children: fetchedChildren,
        } = response.data.data;

        setSubscriptionStart(dayjs(startDate));
        setSubscriptionEnd(dayjs(endDate));
        setChildren(fetchedChildren);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching details:", error);
        // setLoading(false);
      }
    };

    fetchDetails();
  }, [_id]);

  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const isHoliday = (day) => {
    const date = dayjs(formatDate(day));
    const isWeekend = date.day() === 0 || date.day() === 6; // Saturdays and Sundays
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
    if (editMode) {
      setEditMode(false);
      if (isSmall) setOpenDialog(false);
    }
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
      daysArray.push(i);
    }
    return daysArray;
  };

  const applyMealPlan = (planId) => {
    const selectedPlan = planId === 1 ? dummyMenus : [...dummyMenus].reverse();
    const updates = {};

    // Get the first and last day of the current month
    const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
    const daysInMonth = firstDayOfMonth.daysInMonth();

    // Iterate over all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = dayjs(
        `${currentYear}-${currentMonth + 1}-${String(day).padStart(2, "0")}`
      );

      // Skip weekends and holidays
      if (!isHoliday(day)) {
        const mealDate = currentDate.format("YYYY-MM-DD");
        const meal = selectedPlan[(day - 1) % selectedPlan.length]; // Cycle through meals
        updates[mealDate] = {
          ...(menuSelections[mealDate] || {}),
          [dummyChildren[activeChild].id]: meal,
        };
      }
    }

    // Update the menu selections state
    setMenuSelections((prev) => ({
      ...prev,
      ...updates,
    }));
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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEditMode(false);
    if (isSmall) {
      setOpenDialog(true);
    }
  };

  const handleEditClick = (dateString) => {
    const [year, month, day] = dateString.split("-");
    setCurrentMonth(parseInt(month) - 1);
    setCurrentYear(parseInt(year));
    setSelectedDate(parseInt(day));
    setEditMode(true);
    if (isSmall) {
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  return (
    <Box
      className="MCMainPanel"
      display="flex"
      flexDirection={isSmall ? "column" : "row"}
      bgcolor="#fff"
      mx="auto"
      borderRadius={2}
      boxShadow={2}
      overflow="hidden"
    >
      {isSmall && (
        <CenterPanel
          isSmall={isSmall}
          currentMonth={currentMonth}
          currentYear={currentYear}
          handleMonthChange={handleMonthChange}
          calendarDates={calendarDates}
          selectedDate={selectedDate}
          setSelectedDate={handleDateClick}
          isHoliday={isHoliday}
          dummyHolidays={dummyHolidays}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
        />
      )}

      {isSmall && (
        <LeftPanel
          isSmall={isSmall}
          currentYear={currentYear}
          currentMonth={currentMonth}
          activeChild={activeChild}
          setActiveChild={setActiveChild}
          dummyChildren={dummyChildren}
          menuSelections={menuSelections}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
          onEditClick={handleEditClick}
        />
      )}

      {!isSmall && (
        <>
          <LeftPanel
            isSmall={isSmall}
            currentYear={currentYear}
            currentMonth={currentMonth}
            activeChild={activeChild}
            setActiveChild={setActiveChild}
            dummyChildren={dummyChildren}
            menuSelections={menuSelections}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
            onEditClick={handleEditClick}
            sx={{ width: "29%" }}
          />

          <CenterPanel
            isSmall={isSmall}
            currentMonth={currentMonth}
            currentYear={currentYear}
            handleMonthChange={handleMonthChange}
            calendarDates={calendarDates}
            selectedDate={selectedDate}
            setSelectedDate={handleDateClick}
            isHoliday={isHoliday}
            dummyHolidays={dummyHolidays}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
            sx={{ width: "44%" }}
          />

          <RightPanel
            isSmall={isSmall}
            selectedDate={selectedDate}
            getDayName={getDayName}
            isHoliday={isHoliday}
            dummyChildren={dummyChildren}
            menuSelections={menuSelections}
            handleMenuChange={handleMenuChange}
            dummyMenus={dummyMenus}
            formatDate={formatDate}
            editMode={editMode}
            setEditMode={setEditMode}
            sx={{ width: "29%" }}
            setMealPlanDialog={setMealPlanDialog}
          />
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <RightPanel
          isSmall={isSmall}
          selectedDate={selectedDate}
          getDayName={getDayName}
          isHoliday={isHoliday}
          dummyChildren={dummyChildren}
          menuSelections={menuSelections}
          handleMenuChange={handleMenuChange}
          dummyMenus={dummyMenus}
          formatDate={formatDate}
          onClose={handleDialogClose}
          editMode={editMode}
          setEditMode={setEditMode}
          setMealPlanDialog={setMealPlanDialog}
        />
      </Dialog>

      <MealPlanDialog
        open={mealPlanDialog.open}
        onClose={() => setMealPlanDialog({ ...mealPlanDialog, open: false })}
        startDate={mealPlanDialog.startDate}
        onApplyPlan={applyMealPlan}
      />
    </Box>
  );
};

export default MenuCalendar;
