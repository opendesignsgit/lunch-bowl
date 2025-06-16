import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from "@components/faq/Accordion";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices";

const StepHeader = ({ label }) => (
  <Box className="SetpTabNav" sx={{ textAlign: "center", mb: 6 }}>
    <Box
      className="SetpTabul"
      sx={{
        display: "flex",
        columnGap: 2,
        rowGap: 0,
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 2,
        border: 0,
        borderBottomStyle: "dashed",
        borderBottomColor: "#C0C0C0",
        borderBottomWidth: "1px",
      }}
    >
      <Box className="SetpTabli" sx={{ bgcolor: "#FF6A00" }}>
        <Typography sx={{ color: "#fff" }}>{label}</Typography>
      </Box>
    </Box>
    <Box
      sx={{
        height: "2px",
        borderRadius: "4px",
        overflow: "hidden",
        mt: "-2px",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `100%`,
          backgroundColor: "#FF6A00",
          transition: "width 0.4s ease",
        }}
      />
    </Box>
  </Box>
);

const MyAccount = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editable state for email and mobile
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const userId = session?.user?.id;

  // Unified get (and update) function using AccountServices
  const fetchAccountDetails = async (updateField, updateValue) => {
    setLoading(true);
    try {
      const updateData =
        updateField && updateValue
          ? {
              field: updateField,
              value: updateValue,
            }
          : null;

      const res = await AccountServices.getAccountDetails(userId, updateData);
      setUserDetails(res.data);
    } catch {
      setUserDetails(null);
    } finally {
      setLoading(false);
      setSaving(false);
      setEditField(null);
      setEditValue("");
    }
  };

  useEffect(() => {
    if (userId) fetchAccountDetails();
    // eslint-disable-next-line
  }, [userId]);

  // Handle edit initiation
  const handleEdit = (field) => {
    setEditField(field);
    setEditValue(
      field === "email"
        ? userDetails?.parentDetails?.email
        : userDetails?.parentDetails?.mobile
    );
  };

  // Handle save
  const handleSave = (field) => {
    if (!editValue) return;
    setSaving(true);
    fetchAccountDetails(field, editValue);
  };

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  }

  // FAQ items...
  const faqItems = [
    {
      title: "How do you ensure the food is nutritious and safe for my child?",
      content:
        "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies.",
    },
    {
      title: "What if my child has specific dietary restrictions or allergies?",
      content:
        "We take effort to accommodate allergies and provide menus that may be customized. We prevent cross-contamination with strict protocols.",
    },
    {
      title:
        "How does the delivery process work, and can I trust it will arrive on time?",
      content:
        "For prompt delivery in temperature-controlled trucks, we work with schools. Confirmations will be sent to you, and any delays will be quickly communicated.",
    },
    {
      title:
        "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
      content:
        "Our lunch dishes are tightly sealed with leak-proof, tamper-evident canisters. To assist preserve the freshness of the food and temperature until noon, we use insulated bags for delivery.",
    },
    {
      title:
        "Over time, what type of variation can I anticipate in the lunch bowl options?",
      content:
        "We make an effort to provide a varied and ever-changing menu to keep your child engaged. In order to provide a variety of wholesome and enticing options, our culinary team frequently introduces new recipes and seasonal ingredients.",
    },
    {
      title:
        "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
      content:
        "Our cooking facilities are kept to the greatest hygienic standards. All surfaces and equipment are routinely sterilized, our employees wear the proper protective gear, and they adhere to stringent handwashing guidelines. We perform regular inspections and follow food safety laws.",
    },
    {
      title:
        "How can I go about giving comments or resolving any issues I might have with the lunch bowls?",
      content:
        "We appreciate your input and invite you to contact our customer service department by phone or email. We are dedicated to immediately resolving any difficulties to ensure your child's satisfaction since we take all complaints seriously.",
    },
  ];

  return (
    <div className="steppage">
      <Mainheader title="My Account" description="User Account Details" />
      <div className="pagebody">
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-row textFF6514">
                  <span className="block">My</span>
                  <span className="block firstspan ml-2">Account</span>
                </h1>
                <p>Here you can view and update your account details.</p>
              </div>
            </div>
          </div>
        </section>
        <Box
          className="SetpContainer"
          sx={{
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            paddingTop: 12,
            paddingBottom: 15,
          }}
        >
          <Box
            className="DetlsSepBox"
            sx={{ width: "100%", maxWidth: "800px" }}
          >
            <StepHeader label="ACCOUNT DETAILS" />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
              </Box>
            ) : userDetails ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Parent Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>
                  <b>Father's Name:</b>{" "}
                  {userDetails.parentDetails?.fatherFirstName}{" "}
                  {userDetails.parentDetails?.fatherLastName}
                </Typography>
                <Typography>
                  <b>Mother's Name:</b>{" "}
                  {userDetails.parentDetails?.motherFirstName}{" "}
                  {userDetails.parentDetails?.motherLastName}
                </Typography>
                <Typography>
                  <b>Email:</b>{" "}
                  {editField === "email" ? (
                    <>
                      <TextField
                        size="small"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        onClick={() => handleSave("email")}
                        color="primary"
                        disabled={saving}
                        size="small"
                      >
                        <SaveIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {userDetails.parentDetails?.email}
                      <IconButton
                        onClick={() => handleEdit("email")}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  )}
                </Typography>
                <Typography>
                  <b>Mobile:</b>{" "}
                  {editField === "mobile" ? (
                    <>
                      <TextField
                        size="small"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        onClick={() => handleSave("mobile")}
                        color="primary"
                        disabled={saving}
                        size="small"
                      >
                        <SaveIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {userDetails.parentDetails?.mobile}
                      <IconButton
                        onClick={() => handleEdit("mobile")}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </>
                  )}
                </Typography>
                <Typography>
                  <b>Address:</b> {userDetails.parentDetails?.address}
                </Typography>

                <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                  Children
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {userDetails.children && userDetails.children.length > 0 ? (
                  userDetails.children.map((child, idx) => (
                    <Box key={child._id || idx} sx={{ mb: 2, pl: 2 }}>
                      <Typography>
                        <b>Name:</b> {child.childFirstName}{" "}
                        {child.childLastName}
                      </Typography>
                      <Typography>
                        <b>Date of Birth:</b> {formatDate(child.dob)}
                      </Typography>
                      <Typography>
                        <b>School:</b> {child.school}
                      </Typography>
                      <Typography>
                        <b>Class:</b> {child.childClass}
                      </Typography>
                      <Typography>
                        <b>Section:</b> {child.section}
                      </Typography>
                      <Typography>
                        <b>Lunch Time:</b> {child.lunchTime}
                      </Typography>
                      <Typography>
                        <b>Location:</b> {child.location}
                      </Typography>
                      <Typography>
                        <b>Allergies:</b> {child.allergies || "None"}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography>No children details available.</Typography>
                )}

                <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
                  Subscription
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {userDetails.subscriptionPlan ? (
                  <Box>
                    <Typography>
                      <b>Plan ID:</b> {userDetails.subscriptionPlan.planId}
                    </Typography>
                    <Typography>
                      <b>Start Date:</b>{" "}
                      {formatDate(userDetails.subscriptionPlan.startDate)}
                    </Typography>
                    <Typography>
                      <b>End Date:</b>{" "}
                      {formatDate(userDetails.subscriptionPlan.endDate)}
                    </Typography>
                    <Typography>
                      <b>Working Days:</b>{" "}
                      {userDetails.subscriptionPlan.workingDays}
                    </Typography>
                    <Typography>
                      <b>Price:</b> ₹{userDetails.subscriptionPlan.price}
                    </Typography>
                  </Box>
                ) : (
                  <Typography>No subscription found.</Typography>
                )}
                <Typography>
                  <b>Payment Status:</b>{" "}
                  {userDetails.paymentStatus ? "Paid" : "Not Paid"}
                </Typography>
              </Box>
            ) : (
              <Typography color="error" sx={{ mt: 4 }}>
                Could not fetch user details. Please try again later.
              </Typography>
            )}
          </Box>
        </Box>
        <section className="HfaqSec senddesfaq relative bg-4AB138 flex">
          <div className="Hfaqinrow w-full relative py-[12vh]">
            <div className="container mx-auto">
              <div className="faqcontain py-[6vw] px-[8vw] bg-white relative">
                <div className="hfaqTitle combtntb comtilte mb-[4vh]">
                  <h4 className="text-[#000000]">Frequently Asked</h4>
                  <h3 className="flex flex-col text4AB138">
                    <span className="block">Questions</span>
                  </h3>
                </div>
                <div className="hfaqAccordion ">
                  <Accordion items={faqItems} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Mainfooter />
    </div>
  );
};

export default MyAccount;
