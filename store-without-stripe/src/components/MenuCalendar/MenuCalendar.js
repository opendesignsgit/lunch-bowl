import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  useMediaQuery,
  useTheme,
  Dialog,
  CircularProgress,
} from "@mui/material";
import LeftPanel from "./LeftPanel";
import CenterPanel from "./CenterPanel";
import RightPanel from "./RightPanel";
import MealPlanDialog from "./MealPlanDialog";
import useRegistration from "@hooks/useRegistration";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MenuCalendar = () => {
  const today = dayjs();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    data,

    reload,
  } = useAsync(AttributeServices.getAllHolidays);
  console.log("====================================");
  console.log("data", data);
  console.log("====================================");
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

  const [children, setChildren] = useState([]);
  const [menus, setMenus] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [subscriptionStart, setSubscriptionStart] = useState(dayjs());
  const [subscriptionEnd, setSubscriptionEnd] = useState(dayjs());
  const [menuData, setMenuData] = useState([]);

  const { submitHandler, loading } = useRegistration();

  useEffect(() => {
    if (data && Array.isArray(data) && subscriptionStart && subscriptionEnd) {
      const apiHolidays = data
        .map((h) => ({
          date: dayjs(h.date).format("YYYY-MM-DD"),
          name: h.name,
        }))
        .filter(
          (h) =>
            dayjs(h.date).isSameOrAfter(subscriptionStart, "day") &&
            dayjs(h.date).isSameOrBefore(subscriptionEnd, "day")
        );
      setHolidays(apiHolidays);
    }
  }, [data, subscriptionStart, subscriptionEnd]);

  const fetchSavedMealPlans = async () => {
    try {
      const res = await submitHandler({
        _id: "663fa6b9ae09bfe5c4812c2e",
        path: "get-saved-meals",
      });

      if (res.success && res.data) {
        const { menuSelections, holidays } = res.data;

        // Update menu selections state
        setMenuSelections((prev) => ({
          ...prev,
          ...menuSelections,
        }));

        // Update holidays if needed
        setHolidays((prev) => [...prev, ...(holidays || [])]);

        console.log("Saved meals loaded successfully");
      }
    } catch (error) {
      console.error("Error loading saved meals:", error);
    } finally {
      setInitialLoadComplete(true);
    }
  };

  const fetchInitialData = async () => {
    try {
      const res = await submitHandler({
        _id: "663fa6b9ae09bfe5c4812c2e",
        path: "get-Menu-Calendar",
      });

      if (res.success) {
        const childrenWithNames =
          res.data.children?.map((child, index) => ({
            id: `child-${index}`, // Create an ID if not provided
            name: `${child.firstName} ${child.lastName}`.trim(), // Combine first and last name
            ...child,
          })) || [];

        setChildren(childrenWithNames);
        setMenus([
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
        ]);

        setSubscriptionStart(dayjs(res.data.startDate));
        setSubscriptionEnd(dayjs(res.data.endDate));
        setCurrentMonth(dayjs(res.data.startDate).month());
        setCurrentYear(dayjs(res.data.startDate).year());
        setSelectedDate(dayjs(res.data.startDate).date());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await fetchInitialData();

        await fetchSavedMealPlans();
      } catch (error) {
        console.error("Error in initial data loading:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleMenuDataChange = (data) => {
    setMenuData(data);
  };

  // In MenuCalendar.js
  const getAllMenuData = () => {
    const allMenuData = [];

    // Create a dayjs object for the subscription start date
    let currentDate = dayjs(subscriptionStart);
    const endDate = dayjs(subscriptionEnd);

    // Loop through each day from subscription start to end
    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const dateKey = currentDate.format("YYYY-MM-DD");
      const day = currentDate.date();
      const month = currentDate.month();
      const year = currentDate.year();

      children.forEach((child) => {
        // Find or create the child's data object
        let childData = allMenuData.find((c) => c.childId === child.id);
        if (!childData) {
          childData = {
            childId: child.id,
            childName: child.name,
            meals: [],
          };
          allMenuData.push(childData);
        }

        // Check if the date is not a holiday
        if (!isHoliday(day, month, year)) {
          const dish = menuSelections[dateKey]?.[child.id];
          if (dish) {
            childData.meals.push({
              mealDate: currentDate.toDate(),
              mealName: dish,
            });
          }
        }
      });

      // Move to the next day
      currentDate = currentDate.add(1, "day");
    }

    return allMenuData;
  };

  // Add this function to handle the save button click
  const handleSave = async () => {
    const allMenuData = getAllMenuData();

    const payload = {
      userId: "663fa6b9ae09bfe5c4812c2e", // Replace with actual user ID
      children: allMenuData.map((child) => ({
        childId: child.childId,
        meals: child.meals,
      })),
    };
    try {
      const allMenuData = getAllMenuData();

      const payload = {
        userId: "663fa6b9ae09bfe5c4812c2e", // Replace with actual user ID
        children: allMenuData.map((child) => ({
          childId: child.childId,
          meals: child.meals,
        })),
      };

      const res = await submitHandler({
        _id: "663fa6b9ae09bfe5c4812c2e",
        path: "save-meals",
        data: payload,
      });

      if (res.success) {
        // Show success notification
      } else {
        console.error("Failed to save meals:", res.message);
        // Show error notification
      }
    } catch (error) {
      console.error("Error saving meals:", error);
      // Show error notification
    }
  };

  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  const isHoliday = (day, month = currentMonth, year = currentYear) => {
    // Handle case where only day is provided (for backward compatibility)
    if (arguments.length === 1) {
      const date = dayjs(formatDate(day));
      return (
        date.day() === 0 ||
        date.day() === 6 ||
        holidays.some((h) => h.date === date.format("YYYY-MM-DD"))
      );
    }

    // Normal case with all parameters
    const date = dayjs(`${year}-${month + 1}-${day}`);
    const isWeekend = date.day() === 0 || date.day() === 6;
    const dateString = date.format("YYYY-MM-DD");
    const isCustomHoliday = holidays.some((h) => h.date === dateString);
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
    for (let i = 0; i < startDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
    return daysArray;
  };

  const applyMealPlan = (planId, childId) => {
    const selectedPlan = planId === 1 ? menus : [...menus].reverse();
    const updates = {};

    const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-01`);
    const daysInMonth = firstDayOfMonth.daysInMonth();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = dayjs(
        `${currentYear}-${currentMonth + 1}-${String(day).padStart(2, "0")}`
      );
      if (!isHoliday(day, currentMonth, currentYear)) {
        // Pass all three params
        const mealDate = currentDate.format("YYYY-MM-DD");
        const meal = selectedPlan[(day - 1) % selectedPlan.length];
        updates[mealDate] = {
          ...(menuSelections[mealDate] || {}),
          [childId]: meal,
        };
      }
    }

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

  if (loading || !children.length) {
    return <CircularProgress />;
  }

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
          isHoliday={(day) => isHoliday(day, currentMonth, currentYear)}
          dummyHolidays={holidays}
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
          dummyChildren={children}
          menuSelections={menuSelections}
          subscriptionStart={subscriptionStart}
          subscriptionEnd={subscriptionEnd}
          onEditClick={handleEditClick}
          onMenuDataChange={handleMenuDataChange}
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
            dummyChildren={children}
            menuSelections={menuSelections}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
            onEditClick={handleEditClick}
            onMenuDataChange={handleMenuDataChange}
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
            isHoliday={(day) => isHoliday(day, currentMonth, currentYear)}
            dummyHolidays={holidays}
            subscriptionStart={subscriptionStart}
            subscriptionEnd={subscriptionEnd}
            sx={{ width: "44%" }}
          />

          <RightPanel
            isSmall={isSmall}
            selectedDate={selectedDate}
            getDayName={getDayName}
            isHoliday={isHoliday}
            dummyChildren={children}
            menuSelections={menuSelections}
            handleMenuChange={handleMenuChange}
            dummyMenus={menus}
            formatDate={formatDate}
            editMode={editMode}
            setEditMode={setEditMode}
            sx={{ width: "29%" }}
            applyMealPlan={applyMealPlan} // Pass the function
            setMealPlanDialog={setMealPlanDialog}
            activeChild={activeChild} // Add this
            setActiveChild={setActiveChild}
            onSave={handleSave}
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
          dummyChildren={children}
          menuSelections={menuSelections}
          handleMenuChange={handleMenuChange}
          dummyMenus={menus}
          formatDate={formatDate}
          onClose={handleDialogClose}
          editMode={editMode}
          setEditMode={setEditMode}
          applyMealPlan={applyMealPlan} // Pass the function
          setMealPlanDialog={setMealPlanDialog}
          activeChild={activeChild} // Add this
          setActiveChild={setActiveChild}
          onSave={handleSave}
        />
      </Dialog>

      <MealPlanDialog
        open={mealPlanDialog.open}
        onClose={() => setMealPlanDialog({ ...mealPlanDialog, open: false })}
        startDate={mealPlanDialog.startDate}
        planId={mealPlanDialog.plan} // Pass the selected plan ID
      />
    </Box>
  );
};

export default MenuCalendar;
