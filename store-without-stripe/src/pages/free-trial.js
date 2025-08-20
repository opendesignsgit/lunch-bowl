import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import config from "@components/product/config";
import Marquee from "react-fast-marquee";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";

console.log("Config:", config);


const timeOptions = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

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
  paddingBottom: theme.spacing(8),
  width: "100%",
}));

export default function FreeTrialPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: null,
    time: "",
    food: "",
    address: "",
    message: "",
    email: session?.user?.email || "",
    name: session?.user?.name || "",
    userId: session?.user?.id || "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset form when session updates
  useEffect(() => {
    setFormData({
      date: null,
      time: "",
      food: "",
      address: "",
      message: "",
      email: session?.user?.email || "",
      name: session?.user?.name || "",
      userId: session?.user?.id || "",
    });
    setErrors({});
    setSubmitted(false);
  }, [session]);

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
      if (currentHour > 12 || (currentHour === 12 && currentMinute >= 0)) {
        newErrors.date = "Same-day delivery is closed after 12 PM";
      }
    }
    if (!formData.time) newErrors.time = "Please select a time";
    if (!formData.food) newErrors.food = "Please select a dish";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.name || !formData.name.trim())
      newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const shouldDisableDate = (date) => {
    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();
    const isAfterNoon =
      currentHour > 12 || (currentHour === 12 && currentMinute >= 0);
    return date.isSame(dayjs(), "day") && isAfterNoon;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const [firstName, ...lastNameParts] = (formData.name || "").split(" ");
    const lastName = lastNameParts.join(" ");

    try {
      await axios.post("https://api.lunchbowl.co.in/api/admin/school-enquiry", {
        firstName,
        lastName,
        email: formData.email,
        mobileNumber: "",
        address: formData.address,
        schoolName: "Free Trial",
        message: `Dish: ${formData.food}\nDelivery Date: ${
          formData.date?.format("YYYY-MM-DD")
        }\nTime: ${formData.time}\n${formData.message}`,
        userId: formData.userId,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({
        submit:
          "There was an error submitting your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="freetrilpage">
      <Mainheader title="Free Trial" description="This is Free Trial page" />
      <div className="pagebody">
        <section className="pagebansec freetrilbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-col textFF6514">
                  <span className="block firstspan">YOUR FIRST BOWL IS <br />ON US — GET YOUR </span>
                  <span className="block">FREE TRIAL DESCRIPTION:</span>
                </h1>
                <p className="">Worried if your little one will like it? Don’t worry we provide a free trial <br />meal No risk- no commitments absolute !!FREE!! </p>
                <Breadcrumbs />
              </div>
            </div>
            <div className="abbanIconss">
              <div className="abbanicn iconone absolute">
                <Image
                  src={abbanicon1}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="abbanicn icontwo absolute">
                <Image src={abbanicon2} priority alt="Icon" />
              </div>
            </div>
          </div>
        </section>

        <section className="freetrilsec relative secpaddblock">
          <div className="container mx-auto relative">
            <Box className="freetrilRow flex">
              {/* Left Image */}
              <Box className="freetrilCol ftLCol">
                <ImageBox className="ftLImg">
                  <Image
                    src={"/LogInSignUp/signuppopimg.jpg"}
                    alt="Free Trial"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                  />
                </ImageBox>
              </Box>

              {/* Right Form */}
              <Box className="freetrilCol ftRCol">
                <FormBox component="form" onSubmit={handleSubmit}>
                  <Typography variant="h4" fontWeight="bold" mb={2}>
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
                      <Typography>
                        Delivery scheduled for:{" "}
                        {formData.date?.format("MMMM D, YYYY")} at {formData.time}
                      </Typography>
                      <Typography mt={1}>Dish: {formData.food}</Typography>
                      <Typography>Address: {formData.address}</Typography>
                      <Button
                        sx={{ mt: 3 }}
                        variant="contained"
                        color="primary"
                        onClick={() => router.push("/user/profile-Step-Form")}
                      >
                        Complete your registration
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {/* Name */}
                      <Typography variant="subtitle2" className="text-[#FF6514]" mt={2}>
                        FULL NAME*
                      </Typography>
                      <TextField
                        fullWidth
                        value={formData.name}
                        onChange={handleChange("name")}
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mt: 1 }}
                      />

                        {/* Email */}
                        <Typography variant="subtitle2" mt={2} className="text-[#FF6514]">
                          EMAIL ADDRESS*
                        </Typography>
                        <TextField
                          fullWidth
                          value={formData.email}
                          onChange={handleChange("email")}
                          size="small"
                          error={!!errors.email}
                          helperText={errors.email}
                          sx={{ mt: 1 }}
                        />

                        {/* Date & Time */}
                        <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
                          SELECT YOUR PREFERRED SLOT FOR DELIVERY*
                        </Typography>
                        <Box display="flex" gap={2} mt={1} flexWrap="wrap">
                          <Box flex={1}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                value={formData.date}
                                onChange={handleDateChange}
                                minDate={dayjs()}
                                shouldDisableDate={shouldDisableDate}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    size: "small",
                                    error: !!errors.date,
                                  },
                                }}
                              />
                            </LocalizationProvider>
                            {errors.date && (
                              <FormHelperText error>{errors.date}</FormHelperText>
                            )}
                          </Box>
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

                        {/* Food */}
                        <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
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
                          sx={{ mt: 1 }}
                        >
                          <MenuItem value="Paneer Butter Masala">
                            Paneer Butter Masala
                          </MenuItem>
                          <MenuItem value="Dal Tadka">Dal Tadka</MenuItem>
                          <MenuItem value="Aloo Gobi">Aloo Gobi</MenuItem>
                        </TextField>

                        {/* Address */}
                        <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
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
                          sx={{ mt: 1 }}
                        />

                        {/* Message */}
                        <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
                          MESSAGE
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={formData.message}
                          onChange={handleChange("message")}
                          placeholder="Optional message"
                          size="small"
                          sx={{ mt: 1 }}
                        />

                        {errors.submit && (
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        )}

                        <Typography fontSize={14} mt={2}>
                          Submit your request before{" "}
                          <span className="text-[#FF6514]">12 PM</span> for{" "}
                          <span className="text-[#FF6514]">Same-day Delivery</span>.
                        </Typography>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="contained"
                        color="warning"
                        fullWidth
                        sx={{ mt: 2, py: 1.5 }}
                        disabled={loading}
                        endIcon={loading && <CircularProgress size={20} />}
                      >
                        Get Free Trial
                      </Button>
                    </>
                  )}
                </FormBox>
              </Box>
            </Box>
          </div>
        </section>

      </div>
      <Mainfooter />
    </div>

  );
}
