import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  FormControl,
  Link,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import dayjs from "dayjs";
import MealPlanDialog from "./MealPlanDialog";
import HolidayPayment from "./HolidayPayment";
import mealPlanData from "../../jsonHelper/meal_plan.json"; // Adjust the path if needed
import { useSession } from "next-auth/react";

const mealPlanArray = mealPlanData.meal_plan;

const RightPanel = ({
  isSmall,
  selectedDate,
  getDayName,
  isHoliday,
  dummyChildren,
  menuSelections,
  handleMenuChange,
  formatDate,
  onClose,
  editMode,
  setEditMode,
  sx,
  setMealPlanDialog,
  applyMealPlan,
  activeChild,
  setActiveChild,
  onSave,
  saveSelectedMeals,
}) => {
  const { data: session } = useSession();

  const [useMealPlan, setUseMealPlan] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [applyToAll, setApplyToAll] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [holidayPaymentOpen, setHolidayPaymentOpen] = useState(false);
  const [holidayPaymentData, setHolidayPaymentData] = useState([]);
  const [paidHolidayMeals, setPaidHolidayMeals] = useState([]);

  const selectedDateObj = dayjs(formatDate(selectedDate));
  const holiday = isHoliday(selectedDate);
  const isSelectedHoliday = !!holiday;
  const isWithin48Hours = selectedDateObj.diff(dayjs(), "hour") < 48;
  const isSunday = selectedDateObj.day() === 0;

  // Load paid meal data from localStorage for the current selected date
  useEffect(() => {
    const storedPaidMeals = localStorage.getItem("paidHolidayMeal");
    if (storedPaidMeals) {
      try {
        const parsed = JSON.parse(storedPaidMeals);
        // Filter payments specifically for current selected date
        const filtered = parsed.filter(
          (item) => item.mealDate === formatDate(selectedDate)
        );
        setPaidHolidayMeals(filtered);
      } catch (e) {
        setPaidHolidayMeals([]);
      }
    } else {
      setPaidHolidayMeals([]);
    }
  }, [selectedDate, formatDate]);

  const getDayMenu = (selectedDate) => {
    if (!mealPlanArray || mealPlanArray.length === 0) return [];
    const menuIndex = (selectedDate - 1) % mealPlanArray.length;
    return mealPlanArray[menuIndex]?.meals || [];
  };

  const mealPlans = [
    {
      id: 1,
      name: "Meal Plan 1",
      meals: mealPlanArray.map((day) => day.meals).flat(),
    },
    {
      id: 2,
      name: "Meal Plan 2",
      meals: mealPlanArray
        .slice()
        .reverse()
        .map((day) => day.meals)
        .flat(),
    },
  ];

  const handlePlanChange = (childId, planId) => {
    if (isWithin48Hours) return;
    setSelectedPlans((prev) => ({ ...prev, [childId]: planId }));
    const childIndex = dummyChildren.findIndex((child) => child.id === childId);
    if (childIndex !== -1) setActiveChild(childIndex);
    if (applyMealPlan) applyMealPlan(planId, childId);
  };

  const handleViewPlan1 = () => setDialogOpen1(true);
  const handleViewPlan2 = () => setDialogOpen2(true);
  const handleCloseDialog1 = () => setDialogOpen1(false);
  const handleCloseDialog2 = () => setDialogOpen2(false);

  const handleApplyToAllChange = (e) => {
    if (isWithin48Hours) return;
    const { checked } = e.target;
    setApplyToAll(checked);
    if (checked && dummyChildren.length > 1) {
      const firstChildId = dummyChildren[0].id;
      const firstChildSelection =
        menuSelections[formatDate(selectedDate)]?.[firstChildId];
      dummyChildren.slice(1).forEach((child) => {
        handleMenuChange(child.id, firstChildSelection || "");
      });
    }
  };

  const handleFirstChildMenuChange = (childId, value) => {
    if (isWithin48Hours) return;
    handleMenuChange(childId, value);
    if (applyToAll && dummyChildren.length > 1) {
      dummyChildren.slice(1).forEach((child) => {
        handleMenuChange(child.id, value);
      });
    }
  };

  const handleMenuSelectionChange = (childId, value) => {
    if (isWithin48Hours) return;
    handleMenuChange(childId, value);
  };

  const activeChildId = dummyChildren[activeChild]?.id;
  const activeChildDish =
    menuSelections[formatDate(selectedDate)]?.[activeChildId] || "";

  // Helper to check if a child has paid for this date
  const isChildPaid = (childId) => {
    return paidHolidayMeals.some((item) => item.childId === childId);
  };

  // Children that have a meal selected for this date
  const childrenWithSelectedMeals = dummyChildren.filter((child) => {
    const meal = menuSelections[formatDate(selectedDate)]?.[child.id];
    return meal && meal !== "";
  });

  // If any child has selected meal but is NOT paid => show "Pay"
  const hasUnpaidChild = childrenWithSelectedMeals.some(
    (child) => !isChildPaid(child.id)
  );

  return (
    <Box
      className="MCRightPanel"
      sx={{
        width: isSmall ? "100%" : "25%",
        bgcolor: "#f97316",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {isSmall && (
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>
      )}

      <div className="fixcheckboxs">
        <FormControlLabel
          control={
            <Checkbox
              checked={useMealPlan}
              onChange={(e) => !isWithin48Hours && setUseMealPlan(e.target.checked)}
              sx={{ color: "#fff" }}
              disabled={isWithin48Hours}
            />
          }
          label={
            <Typography fontSize="0.8rem" color="#fff">
              Meal Plan Approved by Dietitian
            </Typography>
          }
          sx={{ mb: 1, alignSelf: "flex-start" }}
        />
      </div>

      <div className="fixdatesboxs">
        <h2>{String(selectedDate).padStart(2, "0")}</h2>
        <h4>{getDayName(selectedDate).toUpperCase()}</h4>
      </div>

      {isWithin48Hours ? (
        <Box
          bgcolor="#fff"
          color="#000"
          borderRadius={2}
          p={2}
          textAlign="center"
          mb={2}
        >
          <Typography fontWeight="bold" fontSize="0.9rem">
            Orders must be placed at least 48 hours in advance.
          </Typography>
          <Typography fontSize="0.8rem" mt={1}>
            Menu selections cannot be changed for this date.
          </Typography>
        </Box>
      ) : isSunday ? (
        <Box
          bgcolor="#fff"
          color="#000"
          borderRadius={2}
          p={2}
          textAlign="center"
          mb={2}
        >
          <Typography fontWeight="bold" fontSize="0.9rem">
            The Lunch Bowl is closed on Sundays.
          </Typography>
        </Box>
      ) : (
        <>
          <div className="childlistbox">
            <div className="childinputbox">
              <Typography
                fontWeight="bold"
                textAlign="center"
                className="sycmenu"
              >
                SELECT YOUR CHILD'S MENU
              </Typography>
              {useMealPlan
                ? dummyChildren.map((child, childIndex) => (
                    <Box key={child.id} className="childmlist">
                      <Typography className="menuddtitle">
                        {(child.name || "").toUpperCase()}
                      </Typography>
                      <Box className="radiobtngroup">
                        <FormControl
                          className="radiobtnss"
                          component="fieldset"
                          fullWidth
                        >
                          <RadioGroup
                            value={selectedPlans[child.id] || ""}
                            onChange={(e) => {
                              handlePlanChange(
                                child.id,
                                parseInt(e.target.value)
                              );
                              setActiveChild(childIndex);
                            }}
                            className="RGradiobtnSSS"
                          >
                            {mealPlans.map((plan) => (
                              <Box
                                key={plan.id}
                                display="flex"
                                alignItems="center"
                                mb={0.5}
                                className="RGradiobtn"
                              >
                                <Radio
                                  value={plan.id}
                                  size="small"
                                  className="radiobtnsinput"
                                />
                                <Typography
                                  fontSize="0.8rem"
                                  color="#000"
                                  sx={{ flexGrow: 1 }}
                                  className="radiobtnstext"
                                >
                                  {plan.name}
                                </Typography>
                                <Link
                                  href="#"
                                  fontSize="0.8rem"
                                  sx={{
                                    color: "#f97316",
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    plan.id === 1
                                      ? handleViewPlan1()
                                      : handleViewPlan2();
                                  }}
                                >
                                  View Plan
                                </Link>
                              </Box>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Box>
                  ))
                : dummyChildren.map((child, childIndex) => (
                    <Box key={child.id} className="childmlist">
                      <Typography className="menuddtitle">
                        {(child.name || "").toUpperCase()}
                      </Typography>
                      <Box
                        className="menuddlistbox"
                        bgcolor="#fff"
                        borderRadius={2}
                        px={1}
                        py={0.5}
                      >
                        <Select
                          className="menuddlist"
                          value={
                            menuSelections[formatDate(selectedDate)]?.[child.id] ||
                            ""
                          }
                          onChange={(e) => {
                            childIndex === 0
                              ? handleFirstChildMenuChange(
                                  child.id,
                                  e.target.value
                                )
                              : handleMenuSelectionChange(
                                  child.id,
                                  e.target.value
                                );
                            setActiveChild(childIndex);
                          }}
                          fullWidth
                          variant="standard"
                          disableUnderline
                          MenuProps={{
                            PaperProps: {
                              style: { maxHeight: 48 * 4.5 },
                            },
                          }}
                        >
                          <MenuItem value="">Select Dish</MenuItem>
                          {getDayMenu(selectedDate).map((menu, i) => (
                            <MenuItem key={i} value={menu}>
                              {menu}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      {childIndex === 0 && (
                        <Box sx={{ mt: 1 }}>
                          <FormControlLabel
                            className="cbapplysbtn"
                            control={
                              <Checkbox
                                checked={applyToAll}
                                onChange={handleApplyToAllChange}
                                sx={{ color: "#fff" }}
                              />
                            }
                            label={
                              <Typography fontSize="0.8rem" color="#fff">
                                Apply the same menu for all children
                              </Typography>
                            }
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
            </div>

            <div className="childbtnsbox">
              {isSelectedHoliday && (
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    fontStyle="italic"
                    fontSize="0.8rem"
                  >
                    Note: This day is a holiday – additional charges apply.
                  </Typography>
                </Box>
              )}
              <Box display="flex" gap={2} className="btngroups">
                <Button
                  variant="outlined"
                  className="paysavebtn"
                  onClick={() => {
                    if (isSelectedHoliday && hasUnpaidChild) {
                      const formattedDate = formatDate(selectedDate);

                      // Prepare payment data only for unpaid children with selected meals
                      const data = dummyChildren
                        .map((child) => ({
                          userId: session?.user?.id,
                          childId: child.id,
                          mealDate: formattedDate,
                          mealName:
                            menuSelections[formattedDate]?.[child.id] || null,
                        }))
                        .filter((item) => !!item.mealName && !isChildPaid(item.childId));

                      setHolidayPaymentData(
                        data.map(({ childId, mealName }) => ({
                          childId,
                          dish: mealName,
                        }))
                      );

                      if (data.length > 0) {
                        // Save paid meal info to localStorage
                        const existingStored = localStorage.getItem("paidHolidayMeal");
                        let existing = [];
                        if (existingStored) {
                          try {
                            existing = JSON.parse(existingStored);
                          } catch {
                            existing = [];
                          }
                        }

                        // Append new paid data (you might want to update this based on real payment success)
                        const updatedPaidMeals = [...existing, ...data];
                        localStorage.setItem(
                          "paidHolidayMeal",
                          JSON.stringify(updatedPaidMeals)
                        );
                      }

                      setHolidayPaymentOpen(true);
                    } else if (typeof saveSelectedMeals === "function") {
                      saveSelectedMeals();
                    }
                  }}
                >
                  <span>{isSelectedHoliday && hasUnpaidChild ? "Pay" : "Save"}</span>
                </Button>
              </Box>
            </div>
          </div>
        </>
      )}

      <MealPlanDialog
        open={dialogOpen1}
        onClose={() => setDialogOpen1(false)}
        planId={1}
        startDate={formatDate(selectedDate)}
      />
      <MealPlanDialog
        open={dialogOpen2}
        onClose={() => setDialogOpen2(false)}
        planId={2}
        startDate={formatDate(selectedDate)}
      />

      <HolidayPayment
        open={holidayPaymentOpen}
        onClose={() => setHolidayPaymentOpen(false)}
        selectedDate={formatDate(selectedDate)}
        childrenData={holidayPaymentData} // array of { childId, dish }
      />
    </Box>
  );
};

export default RightPanel;
