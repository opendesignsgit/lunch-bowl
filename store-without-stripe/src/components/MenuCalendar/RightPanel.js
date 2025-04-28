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
import MealPlanDialog from "./MealPlanDialog"; // Make sure to create this component

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
}) => {
  const [useMealPlan, setUseMealPlan] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  const selectedDateObj = dayjs(formatDate(selectedDate));
  const holiday = isHoliday(selectedDate);
  const isSelectedHoliday = !!holiday;
  const lessThan48Hours = isSelectedHoliday && selectedDateObj.diff(dayjs(), "hour") < 48;

  // Sample meal plans data
  const mealPlans = [
    { id: 1, name: "Meal Plan 1" },
    { id: 2, name: "Meal Plan 2" },
  ];

  const handlePlanChange = (childId, planId) => {
    setSelectedPlans(prev => ({
      ...prev,
      [childId]: planId
    }));
  };

  const handleViewPlan = (planId) => {
    setCurrentPlan(planId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentPlan(null);
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
            <Checkbox checked={useMealPlan} onChange={(e) => setUseMealPlan(e.target.checked)} sx={{ color: "#fff" }} />
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
                <Typography fontWeight="bold" textAlign="center" className="sycmenu">SELECT YOUR CHILD'S MENU</Typography>
                {useMealPlan ? (
                  <>
                    {dummyChildren.map((child) => (
                      <Box key={child.id} className="childmlist">
                        <Typography  className="menuddtitle">{child.name.toUpperCase()}</Typography>
                        <Box className='radiobtngroup'>
                          <FormControl  className="radiobtnss" component="fieldset" fullWidth>
                            <RadioGroup  className="radiobtrow"
                              value={selectedPlans[child.id] || ""}
                              onChange={(e) => handlePlanChange(child.id, e.target.value)}
                            >
                              {mealPlans.map((plan) => (
                                <Box key={plan.id} display="flex" alignItems="center" mb={0.5}>
                                  <Radio value={plan.id} size="small" className="radiobtnsinput"/>
                                  <Typography fontSize="0.8rem" color="#000" sx={{ flexGrow: 1 }} className="radiobtnstext">
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
                    {dummyChildren.map((child) => (
                      <Box key={child.id} className="childmlist">
                          <Typography className="menuddtitle"> {child.name.toUpperCase()} </Typography>
                          <Box className="menuddlistbox" bgcolor="#fff" borderRadius={2} px={1} py={0.5}>
                            <Select className="menuddlist"
                              value={
                                menuSelections[formatDate(selectedDate)]?.[child.id] || ""
                              }
                              onChange={(e) => handleMenuChange(child.id, e.target.value)}
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
                ) : (
                  !useMealPlan && (
                    <FormControlLabel className="checkboxbtn"
                      control={<Checkbox sx={{ color: "white" }} size="small" />}
                      label={
                        <Typography variant="body2" fontSize="0.8rem">
                          Save Selected Menus for Upcoming Months
                        </Typography>
                      }
                      sx={{ mb: 2 }}
                    />
                  )
                )}

                <Box display="flex" gap={2} className="btngroups">
                  <Button variant="outlined" onClick={onClose} className="cancelbtn"> <span>Cancel</span> </Button>
                  <Button variant="outlined" className="paysavebtn"> <span>{isSelectedHoliday ? "Pay" : "Save"}</span> </Button>
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