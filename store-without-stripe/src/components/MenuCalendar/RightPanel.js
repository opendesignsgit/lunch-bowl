import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
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
}) => {
  const selectedDateObj = dayjs(formatDate(selectedDate));
  const holiday = isHoliday(selectedDate);
  const isSelectedHoliday = !!holiday;
  const lessThan48Hours =
    isSelectedHoliday && selectedDateObj.diff(dayjs(), "hour") < 48;

  return (
    <Box
      width="100%"
      bgcolor="#f97316"
      color="#fff"
      p={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      {isSmall && (
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>
      )}
      
      <Typography fontSize="3rem" fontWeight="bold" textAlign="center">
        {String(selectedDate).padStart(2, "0")}
      </Typography>
      <Typography fontSize="1rem" fontWeight="500" textAlign="center" mb={2}>
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
                      menuSelections[formatDate(selectedDate)]?.[child.id] || ""
                    }
                    onChange={(e) => handleMenuChange(child.id, e.target.value)}
                    fullWidth
                    variant="standard"
                    disableUnderline
                    sx={{ fontSize: "0.875rem", color: "#000" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Select your Child's Dish</MenuItem>
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
                onClick={onClose}
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
  );
};

export default RightPanel;