import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from "@components/faq/Accordion";
import ParentDetailsStep from "@components/profile-Step-Form/ParentDetailsStep";
import ChildDetailsStep from "@components/profile-Step-Form/childDetailsStep";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import PaymentStep from "@components/profile-Step-Form/PaymentStep";
import { useSession } from "next-auth/react";
import AccountServices from "@services/AccountServices"; // ✅ integrate API
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

const StepHeader = ({ step }) => {
  const labels = ["PARENT’S DETAILS", "CHILDREN’S DETAILS", "SUBSCRIPTION PLAN", "PAYMENT"];
  const totalSteps = labels.length;
  const progressPercentage = (step / totalSteps) * 100;

  return (
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
        {labels.map((label, index) => (
          <Box
            className="SetpTabli"
            key={index}
            sx={{
              bgcolor: step === index + 1 ? "#FF6A00" : "transparent",
            }}
          >
            <Typography
              sx={{
                color: step === index + 1 ? "#fff" : "#C0C0C0",
              }}
            >
              {label}
            </Typography>
          </Box>
        ))}
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
            width: `${progressPercentage}%`,
            backgroundColor: "#FF6A00",
            transition: "width 0.4s ease",
          }}
        />
      </Box>
    </Box>
  );
};

const MultiStepForm = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;

  const [step, setStep] = useState(1);
  const [childCount, setChildCount] = useState(1);
  const [formData, setFormData] = useState({
    fatherFirstName: "",
    fatherLastName: "",
    motherFirstName: "",
    motherLastName: "",
    mobile: "",
    email: "",
    address: "",
    children: [],
    subscriptionPlan: {},
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch account-details
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!_id) return;
      try {
        const response = await AccountServices.getAccountDetails(_id);
        if (response.success && response.data) {
          const data = response.data;

          setFormData({
            ...formData,
            ...data.parentDetails,
            children: data.children || [],
            subscriptionPlan: data.subscriptionPlan || {},
          });

          setChildCount(data.children?.length || 1);

          // resume on saved step
          if (data.step) setStep(data.step);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  if (loading) {
    return (
      <div className="steppage">
        <Mainheader title="Home" description="This is Home page" />
        <div className="pagebody flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
        <Mainfooter />
      </div>
    );
  }

  const faqItems = [
    {
      title: "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
      content:
        "Our lunch dishes are tightly sealed with leak-proof, tamper-evident canisters. To assist preserve the freshness of the food and temperature until noon, we use insulated bags for delivery.",
    },
    {
      title: "Over time, what type of variation can I anticipate in the lunch bowl options?",
      content:
        "We make an effort to provide a varied and ever-changing menu to keep your child engaged. In order to provide a variety of wholesome and enticing options, our culinary team frequently introduces new recipes and seasonal ingredients.",
    },
    {
      title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
      content:
        "Our cooking facilities are kept to the greatest hygienic standards. All surfaces and equipment are routinely sterilized, our employees wear the proper protective gear, and they adhere to stringent handwashing guidelines. We perform regular inspections and follow food safety laws.",
    },
    {
      title: "How can I go about giving comments or resolving any issues I might have with the lunch bowls? ",
      content:
        "We appreciate your input and invite you to contact our customer service department by phone or email. We are dedicated to immediately resolving any difficulties to ensure your child's satisfaction since we take all complaints seriously.",
    },
    {
      title: "How do you ensure the food is nutritious and safe for my child?",
      content:
        "Our meals are nutritionist designed, made with fresh, high-quality ingredients, and prepared under strict hygiene standards. We also customise for dietary needs and take extra care to avoid allergens.",
    },
    {
      title: "How does the delivery process work, and can I trust it will arrive on time?",
      content:
        "We deliver meals directly to schools in temperature-controlled vehicles, timed to arrive just before lunchtime. You’ll receive delivery confirmations, and in the rare case of a delay, we’ll notify you right away.",
    },
    {
      title: "What if my child has specific dietary restrictions or allergies?",
      content:
        "We take effort to accommodate allergies and provide menu options that can be customized. Our team follows careful preparation practices to ensure meals are safe and free from cross-contamination.",
    },
    {
      title: "What if I need food on Sunday?",
      content:
        "Our regular service is available Monday to Friday. If you require meals on a Sunday, please call us at +91 9176 in advance. Our team will confirm availability and make special arrangements based on your request and delivery location.",
    },
    {
      title: "Can I get a Free trial on Sunday?",
      content: "We don’t offer free trials on Sundays. Please choose any weekday or Saturday slot for your trial.",
    },
    {
      title: "what if I don’t need meal on any day during my subscription, will I get a refund ?",
      content:
        "The days when you don’t avail meals will get carried forward and gets accumulated in your wallet , which can be redeemed during your next subscription.",
    },
    {
      title: "What if i want to terminate the service? ",
      content:
        "Termination is possible , and the unconsumed meal days will be calculated and refund will be processed. Request you to contact customer service for termination of services.",
    },
  ];

  return (
    <div className="steppage">
      <Mainheader title="Home" description="This is Home page" />
      <div className="pagebody">
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte relative">
                <h1 className="flex flex-row textFF6514">
                  <span className="block firstspan">Enter Required </span>
                  <span className="block ml-2">Details</span>
                </h1>
                <p>
                  We have got you covered. Let us cover you by filling in the
                  details below.
                </p>
                <div className="psfbanIconss">
                  <div className="psfbanicn iconone absolute">
                    <Image src={abbanicon1} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn icontwo absolute">
                    <Image src={abbanicon2} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconthree absolute">
                    <Image src={abbanicon3} priority alt="Icon" className="iconrubberband" />
                  </div>
                  <div className="psfbanicn iconfour absolute">
                    <Image src={abbanicon4} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconfive absolute">
                    <Image src={abbanicon5} priority alt="Icon" />
                  </div>
                  <div className="psfbanicn iconsix absolute">
                    <Image src={abbanicon6} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconseven absolute">
                    <Image src={abbanicon7} priority alt="Icon" className="iconrotates" />
                  </div>
                  <div className="psfbanicn iconeight absolute">
                    <Image src={abbanicon8} priority alt="Icon" className="iconrotates" />
                  </div>
                </div>
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
          <Box className="DetlsSepBox" sx={{ width: "100%", maxWidth: "1200px" }}>
            <StepHeader step={step} />

            {step === 1 && (
              <ParentDetailsStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                _id={_id}
                sessionData={session}
              />
            )}

            {step === 2 && (
              <ChildDetailsStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                _id={_id}
                setChildCount={setChildCount}
              />
            )}

            {step === 3 && (
              <SubscriptionPlanStep
                nextStep={nextStep}
                prevStep={prevStep}
                _id={_id}
                numberOfChildren={childCount}
              />
            )}

            {step === 4 && <PaymentStep prevStep={prevStep} _id={_id} />}
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

export default MultiStepForm;