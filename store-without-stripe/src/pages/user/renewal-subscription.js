import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Stepper, Step, StepLabel, Divider } from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import ChildDetailsStep from "@components/profile-Step-Form/childDetailsStep";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import PaymentStep from "@components/profile-Step-Form/PaymentStep";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";
import AccountServices from "@services/AccountServices";
import AttributeServices from "@services/AttributeServices";
import useAsync from "@hooks/useAsync";
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

const BASE_PRICE_PER_DAY = 200;

// Helper functions for working days calculation
const isWeekend = (date) => [0, 6].includes(dayjs(date).day());
const isHoliday = (date, holidays) =>
  holidays.includes(dayjs(date).format("YYYY-MM-DD"));
const isWorkingDay = (date, holidays) =>
  !isWeekend(date) && !isHoliday(date, holidays);

const calculateWorkingDays = (startDate, endDate, holidays) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    current = current.add(1, "day");
  }
  return count;
};

// Pro-rated billing component for new children
const ProRatedBillingCard = ({ 
  newChildrenCount, 
  existingChildrenCount, 
  subscriptionEnd, 
  holidays = [] 
}) => {
  if (newChildrenCount <= 0) return null;

  // Calculate start date (2 days from today)
  let billingStartDate = dayjs().add(2, "day");
  
  // Ensure billing start date is a working day
  while (!isWorkingDay(billingStartDate, holidays)) {
    billingStartDate = billingStartDate.add(1, "day");
  }

  const billingEndDate = dayjs(subscriptionEnd);
  const remainingWorkingDays = calculateWorkingDays(billingStartDate, billingEndDate, holidays);
  const pricePerChild = remainingWorkingDays * BASE_PRICE_PER_DAY;
  const totalNewChildrenCost = pricePerChild * newChildrenCount;

  return (
    <Card sx={{ mb: 3, bgcolor: "#f8f9fa" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Pro-rated Billing for New Children
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Existing Children:</strong> {existingChildrenCount}
          </Typography>
          <Typography variant="body2">
            <strong>New Children Being Added:</strong> {newChildrenCount}
          </Typography>
          <Typography variant="body2">
            <strong>Total Children:</strong> {existingChildrenCount + newChildrenCount}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Billing Period:</strong> {billingStartDate.format("DD MMM YYYY")} to {billingEndDate.format("DD MMM YYYY")}
          </Typography>
          <Typography variant="body2">
            <strong>Remaining Working Days:</strong> {remainingWorkingDays} days
          </Typography>
          <Typography variant="body2">
            <strong>Price per day per child:</strong> Rs. {BASE_PRICE_PER_DAY}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box>
          <Typography variant="body2">
            <strong>Cost per new child:</strong> Rs. {pricePerChild.toLocaleString("en-IN")}
          </Typography>
          <Typography variant="h6" color="secondary" sx={{ mt: 1 }}>
            <strong>Total Additional Cost: Rs. {totalNewChildrenCost.toLocaleString("en-IN")}</strong>
          </Typography>
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
          * Billing starts 2 working days from today and covers only working days until current subscription ends
        </Typography>
      </CardContent>
    </Card>
  );
};

const RenewalSubscriptionPage = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;
  const { submitHandler } = useRegistration();
  const [currentStep, setCurrentStep] = useState(1);
  const [existingChildren, setExistingChildren] = useState([]);
  const [currentChildCount, setCurrentChildCount] = useState(0);
  const [initialChildCount, setInitialChildCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [currentSubscriptionStart, setCurrentSubscriptionStart] = useState(null);
  const [currentSubscriptionEnd, setCurrentSubscriptionEnd] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const steps = ["Manage Children", "Select Plan", "Payment"];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!_id) return;
      
      try {
        const [userResponse, holidaysResponse] = await Promise.all([
          AccountServices.getAccountDetails(_id),
          AttributeServices.getAllHolidays()
        ]);
        
        setUserDetails(userResponse.data);
        setExistingChildren(userResponse.data.children || []);
        const childrenCount = userResponse.data.children?.length || 0;
        setCurrentChildCount(childrenCount);
        setInitialChildCount(childrenCount);
        setCurrentSubscriptionStart(userResponse.data.startDate);
        setCurrentSubscriptionEnd(userResponse.data.endDate);
        
        if (holidaysResponse && Array.isArray(holidaysResponse)) {
          setHolidays(holidaysResponse.map((h) => dayjs(h.date).format("YYYY-MM-DD")));
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [_id]);

  const handleSubscriptionPlanChange = (newPlanData) => {
    setSubscriptionPlan(prev => ({
      ...prev,
      ...newPlanData,
    }));
  };

  const handleNext = (data = null) => {
    if (currentStep === 1 && data) {
      // Step 1 passed children data
      setExistingChildren(data);
      setCurrentChildCount(data.length);
    } else if (currentStep === 2 && data) {
      // Step 2 passed plan data
      setSelectedPlan(data);
    }
    
    if (currentStep === 3) {
      // After payment, navigate to menu calendar
      window.location.href = "/user/menuCalendarPage";
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep === 1) {
      window.location.href = "/user/userDashBoard";
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="renewSubpage samepagedesingss">
          <Mainheader  title="Renew Subscription" description="Renew your subscription with updated children details"  />
          <div className="pagebody">
              <Typography>Loading...</Typography>
          </div>
          <Mainfooter />
      </div>
    );
  }

  return (
    <div className="renewSubpage samepagedesingss">
      <Mainheader title="Renew Subscription" description="Renew your subscription with updated children details" />
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

        <Box className="SetpContainer">
            <div className="container mx-auto">
              {/* Progress Stepper */}
              <Card className="mb-6 SetpTabNav">
                <CardContent className="SetpTabRow">
                  <Stepper activeStep={currentStep - 1} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label} className="SetpTabli">
                        <StepLabel className="SetpTablabel">{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>

              {/* Pro-rated Billing Information */}
              {currentChildCount > initialChildCount && currentSubscriptionEnd && (
                <ProRatedBillingCard
                  newChildrenCount={currentChildCount - initialChildCount}
                  existingChildrenCount={initialChildCount}
                  subscriptionEnd={currentSubscriptionEnd}
                  holidays={holidays}
                />
              )}

              {/* Step 1: Child Management */}
              {currentStep === 1 && (
                <ChildDetailsStep
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isRenewalMode={true}
                  existingChildrenCount={existingChildren.length}
                  existingChildren={existingChildren}
                  _id={_id}
                />
              )}

              {/* Step 2: Subscription Plan Selection */}
              {currentStep === 2 && (
                <SubscriptionPlanStep
                  nextStep={handleNext}
                  prevStep={handlePrev}
                  _id={_id}
                  numberOfChildren={currentChildCount}
                  initialSubscriptionPlan={{
                    ...subscriptionPlan,
                    // Pass current subscription end date for proper renewal calculation
                    endDate: userDetails?.subscriptionPlan?.endDate || currentSubscriptionEnd
                  }}
                  onSubscriptionPlanChange={handleSubscriptionPlanChange}
                  isRenewalMode={true}
                />
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <PaymentStep
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isRenewalMode={true}
                  selectedPlan={selectedPlan}
                  _id={_id}
                />
              )}
            </div>
        </Box>
      </div>

      <Mainfooter />
    </div>
  );
};

export default RenewalSubscriptionPage;