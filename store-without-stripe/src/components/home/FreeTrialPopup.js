import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Image from "next/image";
import freeTrialPopupImg from "../../../public/home/freeTrialPopup.png";

const timeOptions = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

// Styled Components (unchanged)
const ImageBox = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  maxHeight: "700px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const FormBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
}));

export default function FreeTrialPopup({ open, onClose }) {
  const [formData, setFormData] = useState({
    date: null,
    time: "",
    food: "",
    address: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when popup opens
  useEffect(() => {
    if (open) {
      setFormData({
        date: null,
        time: "",
        food: "",
        address: "",
        message: "",
      });
      setErrors({});
      setSubmitted(false);
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDateChange = (value) => {
    setFormData((prev) => ({ ...prev, date: value }));
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else if (formData.date.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();

      // Check if current time is 12:00 PM or later
      if (currentHour > 12 || (currentHour === 12 && currentMinute >= 0)) {
        newErrors.date = "Same-day delivery is closed after 12 PM";
      }
    }

    if (!formData.time) newErrors.time = "Please select a time";
    if (!formData.food) newErrors.food = "Please select a dish";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to disable dates in the DatePicker
  const shouldDisableDate = (date) => {
    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();
    const isAfterNoon =
      currentHour > 12 || (currentHour === 12 && currentMinute >= 0);

    return date.isSame(dayjs(), "day") && isAfterNoon;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxWidth: "900px",
          height: "700px",
          margin: 0,
          overflow: "hidden",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, height: "100%" }}>
        <Grid container sx={{ height: "100%" }}>
          {/* Left Image Section */}
          <Grid item xs={12} md={6} sx={{ height: "100%" }}>
            <ImageBox>
              <Image
                src={freeTrialPopupImg}
                alt="Free Trial"
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
            </ImageBox>
          </Grid>

          {/* Right Form Section */}
          <Grid item xs={12} md={6} sx={{ height: "100%", overflowY: "auto" }}>
            <FormBox component="form" onSubmit={handleSubmit}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                START YOUR FREE TRIAL
              </Typography>
              <Typography variant="body2" gutterBottom>
                Provide the required information in the form to get started
              </Typography>

              {submitted ? (
                <Box mt={5}>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Your order will be delivered on time.
                  </Typography>
                  <Typography variant="body1">
                    Delivery scheduled for:{" "}
                    {formData.date?.format("MMMM D, YYYY")} at {formData.time}
                  </Typography>
                  <Typography variant="body1" mt={1}>
                    Dish: {formData.food}
                  </Typography>
                  <Typography variant="body1">
                    Address: {formData.address}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="subtitle2" color="orange" mt={3}>
                    SELECT YOUR PREFERRED SLOT FOR DELIVERY*
                  </Typography>
                  <Box display="flex" gap={2} mt={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={formData.date}
                        onChange={handleDateChange}
                        minDate={dayjs()}
                        shouldDisableDate={shouldDisableDate}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            size="small"
                            error={!!errors.date}
                            helperText={errors.date}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <TextField
                      select
                      fullWidth
                      value={formData.time}
                      onChange={handleChange("time")}
                      size="small"
                      error={!!errors.time}
                      helperText={errors.time}
                    >
                      {timeOptions.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Typography variant="subtitle2" color="orange" mt={3}>
                    SELECT YOUR PREFERRED FOOD*
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={formData.food}
                    onChange={handleChange("food")}
                    size="small"
                    error={!!errors.food}
                    helperText={errors.food}
                  >
                    <MenuItem value="Paneer Butter Masala">
                      Paneer Butter Masala
                    </MenuItem>
                    <MenuItem value="Dal Tadka">Dal Tadka</MenuItem>
                    <MenuItem value="Aloo Gobi">Aloo Gobi</MenuItem>
                  </TextField>

                  <Typography variant="subtitle2" color="orange" mt={3}>
                    RESIDENTIAL ADDRESS*
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleChange("address")}
                    size="small"
                    error={!!errors.address}
                    helperText={errors.address}
                    placeholder="Enter your delivery address"
                  />

                  <Typography variant="subtitle2" mt={3}>
                    MESSAGE
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.message}
                    onChange={handleChange("message")}
                    placeholder="Feel free to type here if you'd like to share something with us."
                    size="small"
                  />

                  <Typography variant="caption" mt={2} display="block">
                    Submit your request before{" "}
                    <Typography component="span" color="error.main">
                      12 PM
                    </Typography>{" "}
                    for{" "}
                    <Typography component="span" color="warning.main">
                      Same-day Delivery
                    </Typography>
                    .
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    fullWidth
                    sx={{ mt: 3, py: 1.5 }}
                  >
                    Get Free Trial
                  </Button>
                </>
              )}
            </FormBox>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
