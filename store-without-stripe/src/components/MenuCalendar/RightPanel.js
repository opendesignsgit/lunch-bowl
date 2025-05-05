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
  Link
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
}) => {
  const [useMealPlan, setUseMealPlan] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [applyToAll, setApplyToAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  const selectedDateObj = dayjs(formatDate(selectedDate));
  const holiday = isHoliday(selectedDate);
  const isSelectedHoliday = !!holiday;
  const lessThan48Hours = isSelectedHoliday && selectedDateObj.diff(dayjs(), "hour") < 48;

  const mealPlans = [
    { 
      id: 1, 
      name: "Meal Plan 1",
      meals: meals
    },
    { 
      id: 2, 
      name: "Meal Plan 2",
      meals: [...meals].reverse()
    },
  ];

  const handlePlanChange = (childId, planId) => {
    setSelectedPlans(prev => ({
      ...prev,
      [childId]: planId
    }));
    
    // Open the meal plan dialog
    setMealPlanDialog({
      open: true,
      startDate: formatDate(selectedDate),
      plan: planId
    });
  };

  const handleViewPlan = (planId) => {
    setCurrentPlan(planId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentPlan(null);
  };

  const handleApplyToAllChange = (e) => {
    const { checked } = e.target;
    setApplyToAll(checked);

    if (checked && dummyChildren.length > 1) {
      const firstChildId = dummyChildren[0].id;
      const firstChildSelection = menuSelections[formatDate(selectedDate)]?.[firstChildId];

      dummyChildren.slice(1).forEach(child => {
        handleMenuChange(child.id, firstChildSelection || "");
      });
    }
  };

  const handleFirstChildMenuChange = (childId, value) => {
    handleMenuChange(childId, value);

    if (applyToAll && dummyChildren.length > 1) {
      dummyChildren.slice(1).forEach(child => {
        handleMenuChange(child.id, value);
      });
    }
  };

  useEffect(() => {
    if (editMode && dummyChildren.length > 0 && !useMealPlan) {
      const firstChildId = dummyChildren[0].id;
      const currentSelection = menuSelections[formatDate(selectedDate)]?.[firstChildId];
      if (!currentSelection) {
        handleMenuChange(firstChildId, dummyMenus[0]);
      }
    }
  }, [editMode, selectedDate, useMealPlan]);

  return (
    <Box className="MCRightPanel"
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
              onChange={(e) => setUseMealPlan(e.target.checked)} 
              sx={{ color: "#fff" }} 
            />
          }
          label={
            <Typography fontSize="0.8rem" color="#fff">
              Meal Plan Approved by Dietitian
            </Typography>
          }
          sx={{ mb: 1, alignSelf: 'flex-start' }}
        />
      </div>
      <div className="fixdatesboxs">
          <h2> {String(selectedDate).padStart(2, "0")} </h2>
          <h4> {getDayName(selectedDate).toUpperCase()} </h4>
      </div>
      {(() => {
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
              <Typography fontWeight="bold" fontSize="0.9rem">
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
              <Typography fontWeight="bold" fontSize="0.9rem">
                The Lunch Bowl is closed on Sundays.
              </Typography>
            </Box>
          );
        }

        return (
          <>
            <div className="childlistbox">              
              <div className="childinputbox">              
                <Typography fontWeight="bold" textAlign="center" className="sycmenu">
                  SELECT YOUR CHILD'S MENU
                </Typography>
                {useMealPlan ? (
                  <>
                    {dummyChildren.map((child) => (
                      <Box key={child.id} className="childmlist">
                        <Typography className="menuddtitle">
                          {child.name.toUpperCase()}
                        </Typography>
                        <Box className='radiobtngroup'>
                          <FormControl className="radiobtnss" component="fieldset" fullWidth>
                            <RadioGroup
                              value={selectedPlans[child.id] || ""}
                              onChange={(e) => handlePlanChange(child.id, parseInt(e.target.value))}
                            >
                              {mealPlans.map((plan) => (
                                <Box key={plan.id} display="flex" alignItems="center" mb={0.5}>
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
                                      color: '#f97316', 
                                      textDecoration: 'none',
                                      '&:hover': {
                                        textDecoration: 'underline'
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleViewPlan(plan.id);
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
                    {dummyChildren.map((child, index) => (
                      <Box key={child.id} className="childmlist">
                        <Typography className="menuddtitle">
                          {child.name.toUpperCase()}
                        </Typography>
                        <Box className="menuddlistbox" bgcolor="#fff" borderRadius={2} px={1} py={0.5}>
                          <Select 
                            className="menuddlist"
                            value={
                              menuSelections[formatDate(selectedDate)]?.[child.id] || ""
                            }
                            onChange={(e) => index === 0 
                              ? handleFirstChildMenuChange(child.id, e.target.value)
                              : handleMenuChange(child.id, e.target.value)
                            }
                            fullWidth
                            variant="standard"
                            disableUnderline
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 48 * 4.5,
                                },
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
                        {index === 0 && (
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
                {isSelectedHoliday ? (
                  <Box mb={2}>
                    <Typography variant="body2" fontStyle="italic" fontSize="0.8rem">
                      Note: This day is a holiday – additional charges apply.
                    </Typography>
                  </Box>
                ) : null}

                <Box display="flex" gap={2} className="btngroups">
                 
                  <Button 
                    variant="outlined" 
                    className="paysavebtn"
                  >
                    <span>{isSelectedHoliday ? "Pay" : "Save"}</span>
                  </Button>
                </Box>
              </div>
            </div>
          </>
        );
      })()}

      <MealPlanDialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        planId={currentPlan}
      />
    </Box>
  );
};

export default RightPanel;