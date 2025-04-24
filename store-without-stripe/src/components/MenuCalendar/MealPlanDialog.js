import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MealPlanDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const meals = [
    "Veg Biryani and Raita",
    "Burnt garlic veg fried rice and Veg in black bean sauce",
    "Pav Bhaji",
    "Aglio E Olio Veg Pasta and cheesy garlic bread",
    "Veg Noodles and gravy",
    "Alfredo Pasta Garlic bread",
    "Mc and Cheese, Garlic Bread",
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
    "Mc and Cheese, Garlic Bread",
    "Edamame Momos and Crispy lotus stem",
    "Mc and Cheese, Garlic Bread",
    "Ghee rice and Paneer curry",
    "Pav Bhaji",
  ];

  const firstCol = meals.slice(0, 15);
  const secondCol = meals.slice(15);

  const renderColumn = (data, startIndex) => (
    <Box>
      <Box
        display="flex"
        fontWeight="bold"
        borderBottom="1px solid #e0e0e0"
        pb={1}
        mb={1}
      >
        <Box width="30%">NO OF DAYS</Box>
        <Box width="70%">FOOD LIST</Box>
      </Box>
      {data.map((item, idx) => (
        <Box key={idx} display="flex" py={0.5} borderBottom="1px solid #f0f0f0">
          <Box width="30%" color="#666">
            Day {String(startIndex + idx + 1).padStart(2, "0")}
          </Box>
          <Box width="70%" color="#333">
            {item}
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile} // 👈 mobile goes full screen
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
        Meal Plan 1 List
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

      <DialogContent
        dividers
        sx={{
          px: isMobile ? 2 : 4,
          pt: 2,
          overflowY: "auto",
          maxHeight: isMobile ? "calc(100vh - 80px)" : "auto",
        }}
      >
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={4}>
          <Box flex={1}>{renderColumn(firstCol, 0)}</Box>
          <Box flex={1}>{renderColumn(secondCol, 15)}</Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanDialog;
