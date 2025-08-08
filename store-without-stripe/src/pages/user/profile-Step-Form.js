import React, { useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from '@components/faq/Accordion';
import ParentDetailsStep from "@components/profile-Step-Form/ParentDetailsStep";
import ChildDetailsStep from "@components/profile-Step-Form/childDetailsStep";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import PaymentStep from "@components/profile-Step-Form/PaymentStep";
import { useSession } from "next-auth/react";
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";


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
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
   const [childCount, setChildCount] = useState(1); // Add this state
   const [formData, setFormData] = useState({
     fatherFirstName: "",
     fatherLastName: "",
     motherFirstName: "",
     motherLastName: "",
     mobile: "",
     email: "",
     address: "",
     children: [], // assuming an array of child objects
   });
   const _id = session?.user?.id;

   console.log("Logged in as:", session);

   const nextStep = () => setStep((prev) => prev + 1);
   const prevStep = () => setStep((prev) => prev - 1);

   const faqItems = [
     {
       title: "What is Lunch Bowl?",
       content:
         "Lunch bowl is an initiative to simplify mealtime for parents by delivering thoughtfully crafted, nutritionist-approved lunch boxes that are fresh, flavourful and tailored to children's preferences, and delivered to the child just ahead of their lunch time to their respective schools.",
     },
     {
       title: "How do I subscribe?",
       content:
         "Go to the website (URL)- provide your details, your child's details, select the menu for each day or the meal plan, make payment and you are set.",
     },
     {
       title: "What is the cost of subscription?",
       content:
         "Cost of each Lunch bowl is Rs. 200/-. One month subscription would cost you Rs.6000/- (30 meals). You have 3 month, 6 month and yearly subscriptions too which you can avail at a discount.",
     },
     {
       title: "Do I need to select meal for each day?",
       content:
         "You may choose to select meal for each day for 30 calendar days or you may choose from the list of Favourite meal Plan or Dietician approved meal plan for 30 days.",
     },
     {
       title: "How is the food prepared?",
       content:
         "The food is prepared in a highly clean environment by a team of professional Chefs. Each Box is packed with high quality ingredients and no preservatives are added. The food also meets the daily nutritional value needed by your child.",
     },
     {
       title: "How is the food delivered?",
       content:
         "Food is delivered to the school, with the name of the child and class printed on each box. The child will need to pick it from the entrance of the school/ designated place during lunch time.",
     },
     {
       title: "How is the food packed?",
       content:
         "The boxes used for packing the food are environmental friendly and made of sugarcane. No plastics are used.",
     },
     {
       title: "How do I opt for trial meal?",
       content:
         "When you opt for subscription, you may select the trial meal option, select the food that you want to try from the list that appears, provide your delivery address and the meal will be delivered.",
     },
     {
       title: "What if I need to change the menu item for a particular day?",
       content:
         "You may change the menu item 48 hours before the day you want to make the changes, you may select from the list of the items that appear on that particular day to make changes.",
     },
     {
       title:
         "What if I need to cancel for the lunch box for a particular day?",
       content:
         "The cancellations will be accepted if they are made within 48 hours for a particular day.",
     },
     {
       title: "What happens when my 30 day subscription ends?",
       content:
         "You will be reminded via whatsapp or SMS prior to the date your subscription ends and you may select from the list of plans as well as present menu options for renewing your subscription.",
     },
     {
       title:
         "How is cancellation for the days I have not availed lunch refunded?",
       content:
         "If you have not availed lunch and paid for 30 day subscription, the same will be adjusted when you renew your next subscription.",
     },
     {
       title: "Any discounts available for siblings?",
       content: "There is a flat 10% discount available for siblings.",
     },
     {
       title: "How do I track if the order is being delivered?",
       content: "",
     },
     {
       title: "How do I book an appointment with Dietician?",
       content:
         "You may visit our website or app to book for the appointment with dietician, the first consultation is absolutely free for you.",
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
                   {" "}
                   <span className="block firstspan">Enter Required </span>{" "}
                   <span className="block ml-2">Details</span>
                 </h1>
                 <p className="">
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
           <Box
             className="DetlsSepBox"
             sx={{ width: "100%", maxWidth: "1200px" }}
           >
             <StepHeader step={step} />

             {step === 1 && (
               <ParentDetailsStep
                 formData={formData}
                 setFormData={setFormData}
                 nextStep={nextStep}
                 _id={_id}
               />
             )}

             {step === 2 && (
               <ChildDetailsStep
                 formData={formData}
                 setFormData={setFormData}
                 nextStep={nextStep}
                 prevStep={prevStep}
                 _id={_id}
                 setChildCount={setChildCount} // Pass the setter
               />
             )}

             {step === 3 && (
               <SubscriptionPlanStep
                 nextStep={nextStep}
                 prevStep={prevStep}
                 _id={_id}
                 numberOfChildren={childCount} // Pass the actual count
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
                     {" "}
                     <span className="block">Questions</span>{" "}
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
