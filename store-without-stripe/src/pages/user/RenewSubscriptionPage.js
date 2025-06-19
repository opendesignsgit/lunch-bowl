// pages/user/renew-subscription.js
import React from 'react';
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import SubscriptionPlanStep from "@components/profile-Step-Form/subscriptionPlanStep";
import { useSession } from "next-auth/react";

const RenewSubscriptionPage = () => {
  const { data: session } = useSession();
  const _id = session?.user?.id;

  // Custom next step handler for renewal
  const handleNext = () => {
    // Redirect to payment page or show success message
    window.location.href = '/user/dashboard';
  };

  // Custom previous step handler
  const handlePrev = () => {
    window.location.href = '/user/dashboard';
  };

  return (
    <div className="steppage">
      <Mainheader title="Renew Subscription" description="Renew your subscription plan" />
      
      <div className="pagebody">
        <section className="pagebansec setpbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center justify-center text-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-row textFF6514">
                  <span className="block">Renew Your </span>
                  <span className="block firstspan ml-2">Subscription</span>
                </h1>
                <p className="">
                  Choose a new subscription plan to continue enjoying our services.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <SubscriptionPlanStep 
            nextStep={handleNext}
            prevStep={handlePrev}
            _id={_id}
          />
        </div>
      </div>
      
      <Mainfooter />
    </div>
  );
};

export default RenewSubscriptionPage;