import React from "react";
import dayjs from "dayjs"; // Add this import at the top
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const meals = [
  "Pav Bhaji",
  "Creamy Spinach & Corn Augratin",
  "Paneer Bao -Butter and Garlic Saute Vegetables",
  "Coconut Rice & Brown Chana Poriyal",
  "Veg Pulav & Raita",
  "Veg Noodle - Veg Manchurian",
  "Veg Biriyani - Raita",
  "Veg Alfredo Pasta - Garlic Bread",
  "Veg Fried Rice - Veg in Black Bean Sauce",
  "Lemon Rice & Sliced Potato Fry",
  "Jeera Rice - Aloo Mutter",
  "Paneer Katti Roll - Katta Meeta Sauce",
  "Multi Millet Chapati - Paneer Lababdar",
  "Ragi Arabiata pasta and garlic bread",
  "Phulka - Paneer Butter Masala",
  "Steamed Momos and Hot Garlic sauce",
  "Multi Millet Chapati - Paneer Lababdar",
  "Thai Green Curry - Butter Rice",
  "Aglio E Olio Pasta - Cheesy Garlic Bread",
  "Coconut Pulav with Crispy Bhindi and Peanut Fry",
  "Phulka - Channa Masala",
  "Creamy Curd Rice with Potato Roast",
  "Pav Bhaji",
  "Creamy Spinach & Corn Augratin",
  "Paneer Bao - Butter and Garlic Saute Vegetables",
  "Coconut Rice & Brown Chana Poriyal",
  "Veg Pulav & Raita",
  "Veg Noodle - Veg Manchurian",
  "Veg Biriyani - Raita",
  "Veg Alfredo Pasta - Garlic Bread",
  "Veg Fried Rice - Veg in Black Bean Sauce",
];

const MealPlanDialog = ({
  open,
  onClose,
  startDate,
  planId = 1, // Add this prop
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [tabValue, setTabValue] = React.useState(planId ? planId - 1 : 0);

  const mealPlans = {
    1: {
      name: "Meal Plan ",
      meals: meals,
    },
    2: {
      name: "Meal Plan 2",
      meals: [...meals].reverse(),
    },
  };

  // const handleTabChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  // const handleApply = () => {
  //   onApplyPlan(tabValue + 1);
  //   onClose();
  // };
  const plan = mealPlans[planId] || mealPlans[1];
  const renderPlan = (planId) => {
    //const plan = mealPlans[planId];
    const firstCol = plan.meals.slice(0, Math.ceil(plan.meals.length / 2));
    const secondCol = plan.meals.slice(Math.ceil(plan.meals.length / 2));

    const renderColumn = (data, startIndex) => (
      <Box>
        <Box
          display="flex"
          fontWeight="bold"
          borderBottom="1px solid #e0e0e0"
          pb={1}
          mb={1}
        >
          <Box width="30%">DAY</Box>
          {/* <Box width="40%">DATE</Box> */}
          <Box width="30%">MEAL</Box>
        </Box>
        {data.map((item, idx) => {
          const dayNumber = startIndex + idx + 1;
          const mealDate = dayjs(startDate)
            .add(dayNumber - 1, "day")
            .format("MMM D, YYYY");

          return (
            <Box
              key={idx}
              display="flex"
              py={0.5}
              borderBottom="1px solid #f0f0f0"
            >
              <Box width="30%" color="#666">
                Day {String(dayNumber).padStart(2, "0")}
              </Box>
              {/* <Box width="40%" color="#666">
                {mealDate}
              </Box> */}
              <Box width="30%" color="#333">
                {item}
              </Box>
            </Box>
          );
        })}
      </Box>
    );

    return (
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={4}>
        <Box flex={1}>{renderColumn(firstCol, 0)}</Box>
        <Box flex={1}>{renderColumn(secondCol, firstCol.length)}</Box>
      </Box>
    );
  };

  return (
    <Dialog className="MenuplanDialogpop"
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "1500px",
          maxWidth: isMobile ? "100%" : "1500px",
          height: isMobile ? "100%" : "auto",
          borderRadius: isMobile ? 0 : 3,
          p: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle className="poptitle"
        sx={{
          width: "100%",
          textAlign: "center",
          color: "#f97316",
          fontWeight: "bold",
          fontSize: "1.8rem",
          textTransform: "uppercase",
          letterSpacing: 1,
          pb: 0,
          position: "relative",
        }}
      >
        {mealPlans[planId]?.name}
        <IconButton className="popclose"
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#999",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{renderPlan()}</DialogContent>
    </Dialog>
  );
};

export default MealPlanDialog;