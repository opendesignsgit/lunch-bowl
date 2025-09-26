import React from "react";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { BASE_PRICE_PER_DAY, calculateWorkingDays } from "./subscriptionUtils";

export const CustomDateDetails = ({
  startDate,
  endDate,
  holidays,
  numberOfChildren = 1,
}) => {
  const days = calculateWorkingDays(startDate, endDate, holidays);
  const pricePerChild = days * BASE_PRICE_PER_DAY;
  const totalPrice = pricePerChild * numberOfChildren;

  return (
    <Box mt={2} sx={{ border: "1px solid #eee", p: 2, borderRadius: 1 }}>
      <Typography variant="body2" gutterBottom>
        <strong>Subscription Details:</strong>
      </Typography>
      <Typography variant="body2">
        <strong>Start Date:</strong> {startDate.format("DD MMM YYYY")}
      </Typography>
      <Typography variant="body2">
        <strong>End Date:</strong> {endDate.format("DD MMM YYYY")}
      </Typography>
      <Typography variant="body2">
        <strong>Total Working Days:</strong> {days} days
      </Typography>
      <Typography variant="body2">
        <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
      </Typography>
      <Typography variant="body2">
        <strong>Price per child:</strong> Rs.{" "}
        {pricePerChild.toLocaleString("en-IN")}({days} days × Rs. {BASE_PRICE_PER_DAY})
      </Typography>
      {numberOfChildren > 1 && (
        <>
          <Typography variant="body2">
            <strong>Number of Children:</strong> {numberOfChildren}
          </Typography>
          <Typography variant="body2">
            <strong>Total Price Calculation:</strong> {days} days × Rs.{" "}
            {BASE_PRICE_PER_DAY} × {numberOfChildren} children
          </Typography>
        </>
      )}
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" fontWeight="bold">
        <strong>Total Price:</strong> Rs. {totalPrice.toLocaleString("en-IN")}
      </Typography>
    </Box>
  );
};

export const OffersSection = ({ numberOfChildren = 1 }) => (
  <Box mt={3}>
    <Typography sx={{ fontWeight: 600, color: "#FF6A00", mb: 1 }} variant="subtitle2">
      OFFERS AVAILABLE
    </Typography>
    <ul style={{ margin: 0 }}>
      {numberOfChildren >= 2 ? (
        <>
          <li>
            <Typography fontSize={14}>
              Save <strong>5%</strong> on the 22 Working Days Plan (for 2+ children).
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>15%</strong> on the 66 Working Days Plan (for 2+ children).
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>20%</strong> on the 132 Working Days Plan (for 2+ children).
            </Typography>
          </li>
        </>
      ) : (
        <>
          <li>
            <Typography fontSize={14}>
              Save <strong>5%</strong> on the 66 Working Days Plan.
            </Typography>
          </li>
          <li>
            <Typography fontSize={14}>
              Save <strong>10%</strong> on the 132 Working Days Plan.
            </Typography>
          </li>
        </>
      )}
      <li>
        <Typography fontSize={14} fontStyle="italic">
          Discounts do not apply to custom date selections.
        </Typography>
      </li>
    </ul>
  </Box>
);