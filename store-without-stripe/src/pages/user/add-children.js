import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Divider, Stepper, Step, StepLabel } from "@mui/material";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import ChildDetailsStep from "@components/profile-Step-Form/childDetailsStep";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import PaymentStep from "@components/profile-Step-Form/PaymentStep";
import { useSession } from "next-auth/react";
import useRegistration from "@hooks/useRegistration";
import AccountServices from "@services/AccountServices";

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
      <div className="steppage">
        <Mainheader
          title="Add Children"
          description="Add children to your existing subscription"
        />
        <div className="pagebody">
          <Typography>Loading...</Typography>
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
      <div className="steppage">
        <Mainheader
          title="Add Children"
          description="Add children to your existing subscription"
        />
        <div className="pagebody">
          <Box className="container mx-auto py-8">
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
          </Box>
        </div>
        <Mainfooter />
      </div>
    );
  }

  return (
    <div className="steppage">
      <Mainheader
        title="Add Children"
        description="Add children to your existing subscription"
      />

      <div className="pagebody">
        <Box className="container mx-auto py-8">
          {/* Progress Stepper */}
          <Card className="mb-6">
            <CardContent>
              <Stepper activeStep={currentStep - 1} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Existing Children Summary */}
          {existingChildren.length > 0 && currentStep === 1 && (
            <Card className="mb-6">
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Currently Registered Children ({existingChildren.length}/3)
                </Typography>
                <Divider className="mb-4" />
                {existingChildren.map((child, index) => (
                  <Box key={index} className="mb-3 p-3 bg-gray-50 rounded">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {child.childFirstName} {child.childLastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {child.school} - Class {child.childClass} ({child.section})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Lunch Time: {child.lunchTime}
                    </Typography>
                  </Box>
                ))}
                <Typography variant="body2" className="mt-4 text-green-600">
                  You can add {remainingSlots} more child{remainingSlots > 1 ? 'ren' : ''}.
                </Typography>
                {userDetails?.subscriptionPlan && (
                  <Box className="mt-4 p-3 bg-blue-50 rounded">
                    <Typography variant="subtitle2" className="text-blue-800">
                      Current Subscription: 
                    </Typography>
                    <Typography variant="body2" className="text-blue-700">
                      {new Date(userDetails.subscriptionPlan.startDate).toLocaleDateString('en-IN')} to{' '}
                      {new Date(userDetails.subscriptionPlan.endDate).toLocaleDateString('en-IN')}
                    </Typography>
                    <Typography variant="body2" className="text-blue-700">
                      New children will be added to this existing subscription period.
                    </Typography>
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
        </Box>
      </div>

      <Mainfooter />
    </div>
  );
};

export default AddChildrenPage;