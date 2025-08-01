import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";
import useRegistration from "@hooks/useRegistration";

const PaymentSuccess = () => {
  const router = useRouter();
  const { submitHandler } = useRegistration();

  useEffect(() => {
    const savePaidMeals = async () => {
      try {
        // Get ALL holiday paid meals info for multiple children as array
        const paidMeals = JSON.parse(localStorage.getItem("paidHolidayMeal"));
        if (!Array.isArray(paidMeals) || paidMeals.length === 0) return;

        // Group meals by userId to one API call per user (almost always one user)
        const grouped = {};
        paidMeals.forEach(({ userId, childId, mealDate, mealName }) => {
          if (!grouped[userId]) grouped[userId] = {};
          if (!grouped[userId][childId]) grouped[userId][childId] = [];
          grouped[userId][childId].push({ mealDate, mealName });
        });

        // For each userId, call the save-meals API with all children/meals
        for (const userId in grouped) {
          const children = Object.entries(grouped[userId]).map(
            ([childId, meals]) => ({
              childId,
              meals,
            })
          );

          const payload = {
            userId,
            children,
          };

          const res = await submitHandler({
            _id: userId,
            path: "save-meals",
            data: payload,
          });

          if (res.success) {
            console.log("Holiday meals saved for user", userId);
          } else {
            console.error("Failed to save holiday meals:", res.message);
          }
        }

        localStorage.removeItem("paidHolidayMeal");
      } catch (err) {
        console.error("Error saving holiday meals on payment success:", err);
      }
    };

    savePaidMeals();
  }, [submitHandler]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Thank you for your payment. Your subscription is now active.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/dashboard")}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default PaymentSuccess;
