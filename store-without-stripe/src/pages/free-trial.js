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
// Remove direct axios for schools
import axios from "axios";
import config from "@components/product/config";
import Marquee from "react-fast-marquee";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';

// Import your hook and service:
import CategoryServices from "@services/CategoryServices";
import useAsync from "@hooks/useAsync";

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";

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

const classOptions = [
  "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];

export default function FreeTrialPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Use your async hook and service for schools
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError
  } = useAsync(CategoryServices.getAllSchools);

  const [formData, setFormData] = useState({
    date: null,
    food: "",
    address: "",
    message: "",
    email: session?.user?.email || "",
    name: session?.user?.name || "",
    userId: session?.user?.id || "",
    school: "",
    class: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      date: null,
      food: "",
      address: "",
      message: "",
      email: session?.user?.email || "",
      name: session?.user?.name || "",
      userId: session?.user?.id || "",
      school: "",
      class: "",
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
    if (!formData.name || !formData.name.trim())
      newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.school)
      newErrors.school = "School is required";
    if (!formData.class)
      newErrors.class = "Class is required";
    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else if (formData.date.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      if (currentHour > 12 || (currentHour === 12 && currentMinute >= 0)) {
        newErrors.date = "Same-day delivery is closed after 12 PM";
      }
    }
    if (!formData.food) newErrors.food = "Please select a dish";
    if (!formData.address.trim()) newErrors.address = "Address is required";
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
      await axios.post("https://api.lunchbowl.co.in/api/admin/free-trial-enquiry", {
        firstName,
        lastName,
        email: formData.email,
        mobileNumber: "",
        address: formData.address,
        schoolName: formData.school,
        className: formData.class,
        message: `Dish: ${formData.food}\nDelivery Date: ${formData.date?.format("YYYY-MM-DD")
          }\n${formData.message}`,
        userId: formData.userId,
      });
      setSubmitted(true);
    } catch (err) {
      alert("Thank you for your enquiry! We'll get back to you soon.");
      setSubmitted(true);

    } finally {
      setLoading(false);
    }
  };

  // Helper to render school options (similar to your Letsfindout component)
  const renderSchoolOptions = () => {
    if (schoolsLoading) {
      return <MenuItem value="" disabled>Loading schools...</MenuItem>;
    }
    if (schoolsError) {
      return <MenuItem value="" disabled>Error loading schools</MenuItem>;
    }
    if (!schools || schools.length === 0) {
      return <MenuItem value="" disabled>No schools available</MenuItem>;
    }
    return schools.map((school) => (
      <MenuItem key={school._id} value={school.name}>
        {school.name} - {school.location}
      </MenuItem>
    ));
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
                  <span className="block firstspan">YOUR FIRST </span>
                  <span className="block">BOWL IS ON US</span>
                </h1>
                <p>
                  Worried if your little one will like it? Don’t worry we provide a <br />
                  free trial meal No risk- no commitments absolute !!FREE!!
                </p>
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
                        {formData.date?.format("MMMM D, YYYY")}
                      </Typography>
                      <Typography mt={1}>Dish: {formData.food}</Typography>
                      <Typography>School: {formData.school}</Typography>
                      <Typography>Class: {formData.class}</Typography>
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

                      {/* School - using async API */}
                      <Typography variant="subtitle2" mt={2} className="text-[#FF6514]">
                        SELECT SCHOOL*
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        value={formData.school}
                        onChange={handleChange("school")}
                        size="small"
                        error={!!errors.school}
                        helperText={errors.school}
                        sx={{ mt: 1 }}
                        disabled={schoolsLoading || schoolsError}
                      >
                        <MenuItem value="">Select School</MenuItem>
                        {renderSchoolOptions()}
                      </TextField>

                      {/* Class */}
                      <Typography variant="subtitle2" mt={2} className="text-[#FF6514]">
                        SELECT CLASS*
                      </Typography>
                      <TextField
                        select
                        fullWidth
                        value={formData.class}
                        onChange={handleChange("class")}
                        size="small"
                        error={!!errors.class}
                        helperText={errors.class}
                        sx={{ mt: 1 }}
                      >
                        <MenuItem value="">Select Class</MenuItem>
                        {classOptions.map(cls => (
                          <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                        ))}
                      </TextField>

                      {/* Date */}
                      <Typography variant="subtitle2" mt={3} className="text-[#FF6514]">
                        SELECT YOUR PREFERRED DATE FOR DELIVERY*
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
                        <MenuItem value="VEG ALFREDO PASTA - GARLIC BREAD">
                          VEG ALFREDO PASTA - GARLIC BREAD
                        </MenuItem>
                        <MenuItem value="COCONUT RICE – BROWN CHANA PORIYAL">
                          COCONUT RICE – BROWN CHANA PORIYAL
                        </MenuItem>
                        <MenuItem value="PHULKA – ALOO MUTTER">
                          PHULKA – ALOO MUTTER
                        </MenuItem>
                        <MenuItem value="Paneer Bao - with Butter garlic Sautte Vegetables">
                          PANEER BAO - WITH BUTTER GARLIC SAUTTE VEGETABLES
                        </MenuItem>
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