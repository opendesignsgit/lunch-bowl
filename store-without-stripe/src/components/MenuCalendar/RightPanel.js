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
    <Box
      sx={{
        width: isSmall ? "100%" : "25%",
        bgcolor: "#f97316",
        color: "#fff",
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
      
      <Typography fontSize="2.5rem" fontWeight="bold" textAlign="center">
        {String(selectedDate).padStart(2, "0")}
      </Typography>
      <Typography fontSize="0.9rem" fontWeight="500" textAlign="center" mb={2}>
        {getDayName(selectedDate).toUpperCase()}
      </Typography>

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
            <Typography fontWeight="bold" textAlign="center" mb={2} fontSize="0.9rem">
              SELECT YOUR CHILD'S MENU
            </Typography>

            {useMealPlan ? (
              <>
                {dummyChildren.map((child) => (
                  <Box key={child.id} mb={2}>
                    <Typography fontSize="0.9rem" fontWeight="500" mb={0.5}>
                      {child.name.toUpperCase()}
                    </Typography>
                    <Box bgcolor="#fff" borderRadius={2} px={1} py={0.5}>
                      <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                          value={selectedPlans[child.id] || ""}
                          onChange={(e) => handlePlanChange(child.id, e.target.value)}
                        >
                          {mealPlans.map((plan) => (
                            <Box key={plan.id} display="flex" alignItems="center" mb={0.5}>
                              <Radio value={plan.id} size="small" />
                              <Typography fontSize="0.8rem" color="#000" sx={{ flexGrow: 1 }}>
                                {plan.name}
                              </Typography>
                              <Link 
                                href="#" 
                                fontSize="0.8rem"
                                sx={{ color: '#f97316', textDecoration: 'none' }}
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
                  <Box key={child.id} mb={2}>
                    <Typography fontSize="0.9rem" fontWeight="500" mb={0.5}>
                      {child.name.toUpperCase()}
                    </Typography>
                    <Box bgcolor="#fff" borderRadius={2} px={1} py={0.5}>
                      <Select
                        value={
                          menuSelections[formatDate(selectedDate)]?.[child.id] || ""
                        }
                        onChange={(e) => handleMenuChange(child.id, e.target.value)}
                        fullWidth
                        variant="standard"
                        disableUnderline
                        sx={{ 
                          fontSize: "0.8rem", 
                          color: "#000",
                          maxWidth: "100%",
                        }}
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

            {isSelectedHoliday ? (
              <Box mb={2}>
                <Typography variant="body2" fontStyle="italic" fontSize="0.8rem">
                  Note: This day is a holiday – additional charges apply.
                </Typography>
              </Box>
            ) : (
              !useMealPlan && (
                <FormControlLabel
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

            <Box display="flex" justifyContent="space-between" gap={1}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  bgcolor: "#fff",
                  color: "#f97316",
                  borderColor: "#fff",
                  textTransform: "none",
                  px: 2,
                  fontSize: "0.8rem",
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
                  px: 2,
                  fontSize: "0.8rem",
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
  );
};

export default RightPanel;