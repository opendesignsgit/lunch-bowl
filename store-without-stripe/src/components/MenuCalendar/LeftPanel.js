import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Edit } from "@mui/icons-material";
import dayjs from "dayjs";

const LeftPanel = ({
  isSmall,
  currentYear,
  currentMonth,
  activeChild,
  setActiveChild,
  dummyChildren,
  menuSelections,
  subscriptionStart,
  subscriptionEnd,
}) => {
  const formatDate = (day) =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

  return (
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
  );
};

export default LeftPanel;