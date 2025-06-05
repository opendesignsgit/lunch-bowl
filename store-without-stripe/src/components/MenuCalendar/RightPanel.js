import React, { useState } from "react";
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
import { ArrowForward, Close } from "@mui/icons-material";
import dayjs from "dayjs";
import MealPlanDialog from "./MealPlanDialog";

const meals = [
  "Veg Biryani and Raita",
  "Burnt garlic veg fried rice and Veg in black bean sauce",
  "Pav Bhaji",
  "Aglio E Olio Veg Pasta and cheesy garlic bread",
  "Veg Noodles and gravy",
  "Alfredo Pasta Garlic bread",
  "Mac and Cheese, Garlic Bread",
  "Aloo Paratha",
  "Hummus and Pita, Jalapeno Cheese Poppers",
  "Creamy curd rice and potato roast",
  "Ghee rice and Paneer curry",
  "Phulka+ Paneer butter masala",
  "Avocado sandwich and Hash brown potatoes",
  "Arabiata Pasta and Garlic bread",
  "Edamame Momos and Crispy lotus stem",
  "Veg spring roll and Pan fried noodles with Veggies",
  "Phulka and Chanamasala",
  "Veg Hakka Noodles",
  "5 spice fried rice and Baby Corn",
  "Hummus and Pita, Jalapeno Cheese Poppers",
  "Veg Noodles and gravy",
  "Creamy curd rice and potato roast",
  "Aloo Paratha",
  "Alfredo Pasta Garlic bread",
  "Phulka+ Paneer butter masala",
  "Mac and Cheese, Garlic Bread",
  "Edamame Momos and Crispy lotus stem",
  "Mac and Cheese, Garlic Bread",
  "Ghee rice and Paneer curry",
  "Pav Bhaji",
];

const RightPanel = ({
  isSmall,
  selectedDate,
  getDayName,
  isHoliday,
  dummyChildren,
  menuSelections,
  handleMenuChange,
  dummyMenus,
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
}) => {
  const [useMealPlan, setUseMealPlan] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [applyToAll, setApplyToAll] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);

  const selectedDateObj = dayjs(formatDate(selectedDate));
  const holiday = isHoliday(selectedDate);
  const isSelectedHoliday = !!holiday;
  const isWithin48Hours = selectedDateObj.diff(dayjs(), "hour") < 48;
  const isSunday = selectedDateObj.day() === 0;

  const mealPlans = [
    { id: 1, name: "Meal Plan 1", meals: meals },
    { id: 2, name: "Meal Plan 2", meals: [...meals].reverse() },
  ];

  const handlePlanChange = (childId, planId) => {
    if (isWithin48Hours) return; // Prevent changes within 48 hours

    setSelectedPlans((prev) => ({ ...prev, [childId]: planId }));

    // Find the child index to set as active
    const childIndex = dummyChildren.findIndex((child) => child.id === childId);
    if (childIndex !== -1) {
      setActiveChild(childIndex);
    }

    // Apply the meal plan for this specific child
    if (applyMealPlan) {
      applyMealPlan(planId, childId);
    }
  };

  const handleViewPlan1 = () => {
    setDialogOpen1(true);
  };

  const handleViewPlan2 = () => {
    setDialogOpen2(true);
  };

  const handleCloseDialog1 = () => {
    setDialogOpen1(false);
  };

  const handleCloseDialog2 = () => {
    setDialogOpen2(false);
  };

  const handleApplyToAllChange = (e) => {
    if (isWithin48Hours) return; // Prevent changes within 48 hours

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
    if (isWithin48Hours) return; // Prevent changes within 48 hours

    handleMenuChange(childId, value);
    if (applyToAll && dummyChildren.length > 1) {
      dummyChildren.slice(1).forEach((child) => {
        handleMenuChange(child.id, value);
      });
    }
  };

  const handleMenuSelectionChange = (childId, value) => {
    if (isWithin48Hours) return; // Prevent changes within 48 hours
    handleMenuChange(childId, value);
  };

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
              onChange={(e) =>
                !isWithin48Hours && setUseMealPlan(e.target.checked)
              }
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
              {useMealPlan ? (
                <>
                  {dummyChildren.map((child, childIndex) => (
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
                          >
                            {mealPlans.map((plan) => (
                              <Box
                                key={plan.id}
                                display="flex"
                                alignItems="center"
                                mb={0.5}
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
                                    "&:hover": {
                                      textDecoration: "underline",
                                    },
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
                  ))}
                </>
              ) : (
                <>
                  {dummyChildren.map((child, childIndex) => (
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
                            menuSelections[formatDate(selectedDate)]?.[
                              child.id
                            ] || ""
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
                          {dummyMenus.map((menu, i) => (
                            <MenuItem key={i} value={menu}>
                              {menu}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      {childIndex === 0 && (
                        <Box sx={{ mt: 1 }}>
                          <FormControlLabel
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
                </>
              )}
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
                    if (typeof onSave === "function") {
                      onSave();
                    }
                  }}
                >
                  <span>{isSelectedHoliday ? "Pay" : "Save"}</span>
                </Button>
              </Box>
            </div>
          </div>
        </>
      )}

      <MealPlanDialog
        open={dialogOpen1}
        onClose={handleCloseDialog1}
        planId={1}
        startDate={formatDate(selectedDate)}
      />
      <MealPlanDialog
        open={dialogOpen2}
        onClose={handleCloseDialog2}
        planId={2}
        startDate={formatDate(selectedDate)}
      />
    </Box>
  );
};

export default RightPanel;
