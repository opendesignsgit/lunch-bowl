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
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

const MealPlanDialog = ({ 
  open, 
  onClose, 
  startDate,
  onApplyPlan 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = React.useState(0);

  const mealPlans = {
    1: {
      name: "Meal Plan 1",
      meals: meals
    },
    2: {
      name: "Meal Plan 2",
      meals: [...meals].reverse()
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleApply = () => {
    onApplyPlan(tabValue + 1);
    onClose();
  };

  const renderPlan = (planId) => {
    const plan = mealPlans[planId];
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
          <Box width="40%">DATE</Box>
          <Box width="30%">MEAL</Box>
        </Box>
        {data.map((item, idx) => {
          const dayNumber = startIndex + idx + 1;
          const mealDate = dayjs(startDate).add(dayNumber - 1, 'day').format("MMM D, YYYY");
          
          return (
            <Box key={idx} display="flex" py={0.5} borderBottom="1px solid #f0f0f0">
              <Box width="30%" color="#666">
                Day {String(dayNumber).padStart(2, "0")}
              </Box>
              <Box width="40%" color="#666">
                {mealDate}
              </Box>
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
    <Dialog
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
      <DialogTitle
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
        Meal Plans
        <IconButton
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Meal Plan 1" />
          <Tab label="Meal Plan 2" />
        </Tabs>
      </Box>

      <DialogContent
        dividers
        sx={{
          px: isMobile ? 2 : 4,
          pt: 2,
          overflowY: "auto",
          maxHeight: isMobile ? "calc(100vh - 180px)" : "auto",
        }}
      >
        {renderPlan(tabValue + 1)}
      </DialogContent>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 2,
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <button
          onClick={handleApply}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          APPLY THIS MEAL PLAN
        </button>
      </Box>
    </Dialog>
  );
};

export default MealPlanDialog;