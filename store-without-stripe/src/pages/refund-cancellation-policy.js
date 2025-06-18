import React from "react";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';

import abbanicon1 from "../../public/about/icons/herosec/pink-rounded-lines.svg";
import abbanicon2 from "../../public/about/icons/herosec/pink-smileflower.svg";

const RefundCancellationPolicy = () => {

  return (
    <div className="RefundCancellationpage allpolicypage">
      <Mainheader title="Refund & Cancellation Policy" description="This is Refund & Cancellation Policy page" />
      <div className='pagebody'>
        <section className="pagebansec aboutbanersec relative">
          <div className='container mx-auto relative h-full' >
            <div className='pageinconter relative h-full w-full flex items-center'>
              <div className='hworkTitle combtntb comtilte'>
                <h1 className='flex flex-col textFF6514'> <span className='block firstspan'>Refund & Cancellation</span> <span className='block'>Policy</span> </h1>
                <Breadcrumbs />
              </div>
            </div>
            <div className='abbanIconss'>
              <div className='abbanicn iconone absolute'><Image src={abbanicon1} priority alt='Icon' className='iconrotates' /></div>
              <div className='abbanicn icontwo absolute'><Image src={abbanicon2} priority alt='Icon' /></div>
            </div>
          </div>
        </section>
        <section className="PolicyCont relative secpaddblock">
          <div className='container mx-auto relative' >

            <div className='combtntb comtilte policycomtb'>
              <div className="policyintb">
                <h3 className='flex flex-col text4AB138'>
                  <span className='block'>Refund & Cancellation Terms</span>
                </h3>
                <p>This Refund and Cancellation Policy applies to all services and subscriptions offered by Lunch Bowl.</p>
              </div >
              <div className="policyintb">
                <h4>1. Cancellations</h4>
                <ul>
                  <li>Cancellation requests must be submitted at least forty-eight (48) hours before the scheduled delivery date.</li>
                  <li>Cancellations requested after the specified period may not be eligible for a refund.</li>
                </ul>
               
              </div>
              <div className="policyintb">

                <h4>2. Refunds</h4> 
                <ul>
                  <li>Full refunds will be processed for timely cancellations.</li>
                  <li>In cases of non-delivery due to our error, users may opt for either a full refund or a re-delivery.</li>
                  <li>Refunds will be credited to the original payment method within 5–7 business days.</li>
                </ul>
              </div>
              <div className="policyintb">

                <h4>3. Trial Packages</h4>
                <p>Trial packs are non-refundable once delivered. However, users may discontinue future services without penalty.</p>
              </div>
              <div className="policyintb">

                <h4>4. Force Majeure</h4>
                <p>Refunds shall not be applicable in the event of service disruptions caused by events beyond our control, including but not limited to natural disasters, strikes, school holidays, or transport failures.</p>
              </div>

            </div>
          </div>
        </section>
      </div>
      <Mainfooter />
    </div>


  );
};

export default RefundCancellationPolicy;
