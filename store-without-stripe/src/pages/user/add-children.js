import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Divider, Stepper, Step, StepLabel } from "@mui/material";
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import ChildDetailsStep from "@components/profile-Step-Form/childDetailsStep";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import PaymentStep from "@components/profile-Step-Form/PaymentStep";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";
import AccountServices from "@services/AccountServices";
import abbanicon1 from "../../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../../public/enterrequireddetails/layerflower.svg";

const AddChildrenPage = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;
  const { submitHandler } = useRegistration();
  const [currentStep, setCurrentStep] = useState(1);
  const [existingChildren, setExistingChildren] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [tempChildrenData, setTempChildrenData] = useState(null); // Store children data temporarily
  const [loading, setLoading] = useState(true);

  const steps = ["Add Children Details", "Select Plan", "Payment"];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!_id) return;
      
      try {
        const response = await AccountServices.getAccountDetails(_id);
        setUserDetails(response.data);
        setExistingChildren(response.data.children || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [_id]);

  const handleNext = (data = null) => {
    if (currentStep === 1 && data) {
      // Store children data temporarily to preserve during navigation
      setTempChildrenData(data);
    } else if (currentStep === 2 && data) {
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
      <div className="addchildpage samepagedesingss">
        <Mainheader title="Add Children" description="Add children to your existing subscription" />
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
          <section className="loadsec py-10 relative">
            <div className="container mx-auto">
              <Typography>Loading...</Typography>
            </div>
          </section>
        </div>
        <Mainfooter />
      </div>
    );
  }

  // Check if user can add more children
  const canAddChildren = existingChildren.length < 3;
  const remainingSlots = 3 - existingChildren.length;

  if (!canAddChildren) {
    return (
      <div className="addchildpage samepagedesingss">
        <Mainheader title="Add Children" description="Add children to your existing subscription" />
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
            <div className="container mx-auto ">
            <Card>
              <CardContent>
                <Typography variant="h5" className="text-center mb-4">
                  Maximum Children Limit Reached
                </Typography>
                <Typography className="text-center">
                  You have already registered the maximum of 3 children. 
                  Please contact support if you need to make changes.
                </Typography>
              </CardContent>
            </Card>
            </div>
          </Box>
        </div>
        <Mainfooter />
      </div>
    );
  }

  return (
    <div className="addchildpage samepagedesingss">
      <Mainheader
        title="Add Children"
        description="Add children to your existing subscription"
      />

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
        <Box  className="SetpContainer">
          <div class="container mx-auto ">
          {/* Progress Stepper */}
          <Card className="mb-6 SetpTabNav ">
            <CardContent className="SetpTabRow">
              <Stepper activeStep={currentStep - 1} alternativeLabel className="SetpTabul">
                {steps.map((label) => (
                  <Step key={label} className="SetpTabli">
                    <StepLabel className="SetpTablabel">{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Existing Children Summary */}
          {existingChildren.length > 0 && currentStep === 1 && (
            <Card className="mb-6 exitchilddtbox">
              <CardContent className="exitchildcntbox">
                <h6> Currently Registered Children ({existingChildren.length}/3)</h6>
                <Divider className="mb-4" />
                {existingChildren.map((child, index) => (
                  <Box key={index} className="exitchildname bg-gray-50 rounded">
                    <h5> {child.childFirstName} {child.childLastName}  </h5>
                    <p> {child.school} - Class {child.childClass} ({child.section}) </p>
                    <p> Lunch Time: {child.lunchTime} </p>
                  </Box>
                ))}
                <div className="ucanaddchild"><p className="mt-4 text-green-600"> You can add {remainingSlots} more child{remainingSlots > 1 ? 'ren' : ''}.</p></div>
                {userDetails?.subscriptionPlan && (
                  <Box className="extcursubionbox bg-blue-50 rounded">
                    <h5 className="text-blue-800">Current Subscription: </h5>
                    <p className="text-blue-700">
                      {new Date(userDetails.subscriptionPlan.startDate).toLocaleDateString('en-IN')} to{' '}
                      {new Date(userDetails.subscriptionPlan.endDate).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-blue-700">
                      New children will be added to this existing subscription period.
                    </p>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          {currentStep === 1 && (
            <ChildDetailsStep
              onNext={handleNext}
              onPrev={handlePrev}
              isAddChildrenMode={true}
              existingChildrenCount={existingChildren.length}
              preservedChildrenData={tempChildrenData}
              _id={_id}
            />
          )}

          {currentStep === 2 && (
            <SubscriptionPlanStep
              nextStep={handleNext}
              prevStep={handlePrev}
              _id={_id}
              numberOfChildren={1} // Only for new children being added
              isAddChildrenMode={true}
              existingSubscription={userDetails?.subscriptionPlan}
              restrictedEndDate={userDetails?.subscriptionPlan?.endDate}
            />
          )}

          {currentStep === 3 && (
            <PaymentStep
              onNext={handleNext}
              onPrev={handlePrev}
              isAddChildrenMode={true}
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

export default AddChildrenPage;