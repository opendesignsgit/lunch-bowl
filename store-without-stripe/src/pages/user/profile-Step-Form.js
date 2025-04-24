import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from '@components/faq/Accordion';
import ParentDetailsStep from "../../components/profile-Step-Form/ParentDetailsStep";
import ChildDetailsStep from "../../components/profile-Step-Form/childDetailsStep";
import SubscriptionPlanStep from "../../components/profile-Step-Form/subscriptionPlanStep";
import { NodeNextRequest } from "next/dist/server/base-http/node";


const StepHeader = ({ step }) => {
  const labels = [
    "PARENT’S DETAILS",
    "CHILDREN’S DETAILS",
    "SUBSCRIPTION PLAN",
    "PAYMENT",
  ];

  const totalSteps = labels.length;
  const progressPercentage = (step / totalSteps) * 100;
  
  return (
    <Box className="SetpTabNav" sx={{ textAlign: "center", mb: 6 }}>
      <Box className="SetpTabul"
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
          <Box className="SetpTabli"
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
  const [step, setStep] = useState(3);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    motherFirstName: "",
    motherLastName: "",
    mobile: "",
    email: "",
    address: "",
    children: [], // assuming an array of child objects
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const faqItems = [
    {
      title: "How do you ensure the food is nutritious and safe for my child?",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "What if my child has specific dietary restrictions or allergies?",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "How does the delivery process work, and can I trust it will arrive on time?",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "Over time, what type of variation can I anticipate in the lunch bowl options? ",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "How can I go about giving comments or resolving any issues I might have with the lunch bowls? ",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
  ];

  return (
    <div className="steppage">    
      <Mainheader  title="Home" description="This is Home page"/>
      <div className='pagebody'>
          <section className="pagebansec setpbanersec relative">
              <div className='container mx-auto relative h-full' >
                <div className='pageinconter relative h-full w-full flex items-center justify-center text-center'>
                  <div className='hworkTitle combtntb comtilte'>
                      <h1 className='flex flex-row textFF6514'> <span className='block'>Enter Required </span> <span className='block firstspan ml-2'>Details</span></h1>
                      <p className=''>We have got you covered. Let us cover you by filling in the details below.</p>
                  </div>
                </div>
              </div>
          </section>
        <Box className="SetpContainer"
          sx={{
            bgcolor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            paddingTop: 12,
            paddingBottom:15,
          }}
        >
          <Box className="DetlsSepBox" sx={{ width: "100%", maxWidth: "1200px" }} >
            <StepHeader step={step}/>

            {step === 1 && (
              <ParentDetailsStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
              />
            )}

            {step === 2 && (
              <ChildDetailsStep
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}

            {step === 3 && (
              <SubscriptionPlanStep nextStep={nextStep} prevStep={prevStep} />
            )}

            {/* Steps 3 and 4 would go here */}
          </Box>
        </Box>

        
          <section className='HfaqSec senddesfaq relative bg-4AB138 flex'>
              <div className='Hfaqinrow w-full relative py-[12vh]' >
                  <div className='container mx-auto' >
                      <div className='faqcontain py-[6vw] px-[8vw] bg-white relative' >
                          <div className='hfaqTitle combtntb comtilte mb-[4vh]'>
                              <h4 className='text-[#000000]'>Frequently Asked</h4>
                              <h3 className='flex flex-col text4AB138'> <span className='block'>Questions</span> </h3>
                          </div>
                          <div className='hfaqAccordion '>
                              <Accordion items={faqItems}/>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

      </div>
      <Mainfooter/>
    </div>
  );
};

export default MultiStepForm;
