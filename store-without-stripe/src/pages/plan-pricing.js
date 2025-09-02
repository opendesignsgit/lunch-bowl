import React from 'react';
import Image from "next/image";
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from '@components/faq/Accordion';
import abbanicon1 from "../../public/enterrequireddetails/redroundedandlines.svg";
import abbanicon2 from "../../public/enterrequireddetails/yellowroundedflower.svg";
import abbanicon3 from "../../public/enterrequireddetails/redlittleheart.svg";
import abbanicon4 from "../../public/enterrequireddetails/lighergreenarrow.svg";
import abbanicon5 from "../../public/enterrequireddetails/violetyellow-star.svg";
import abbanicon6 from "../../public/enterrequireddetails/redtriangle.svg";
import abbanicon7 from "../../public/enterrequireddetails/redlittleflower.svg";
import abbanicon8 from "../../public/enterrequireddetails/layerflower.svg";


const PlanPricingPage = () => {

  const faqItems = [
    {
        title: "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
        content: "Our lunch dishes are tightly sealed with leak-proof, tamper-evident canisters.  To assist preserve the freshness of the food and temperature until noon, we use insulated bags for delivery."
      },
      {
        title: "Over time, what type of variation can I anticipate in the lunch bowl options?",
        content: "We make an effort to provide a varied and ever-changing menu to keep your child engaged.  In order to provide a variety of wholesome and enticing options, our culinary team frequently introduces new recipes and seasonal ingredients."
      },
      {
        title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
        content: "Our cooking facilities are kept to the greatest hygienic standards.  All surfaces and equipment are routinely sterilized, our employees wear the proper protective gear, and they adhere to stringent handwashing guidelines.  We perform regular inspections and follow food safety laws."
      },
      {
        title: "How can I go about giving comments or resolving any issues I might have with the lunch bowls? ",
        content: "We appreciate your input and invite you to contact our customer service department by phone or email.  We are dedicated to immediately resolving any difficulties to ensure your child's satisfaction since we take all complaints seriously."
      },
      {
        title: "How do you ensure the food is nutritious and safe for my child?",
        content: "Our meals are nutritionist designed, made with fresh, high-quality ingredients, and prepared under strict hygiene standards. We also customise for dietary needs and take extra care to avoid allergens."
      },
      {
        title: "How does the delivery process work, and can I trust it will arrive on time?",
        content: "We deliver meals directly to schools in temperature-controlled vehicles, timed to arrive just before lunchtime. You’ll receive delivery confirmations, and in the rare case of a delay, we’ll notify you right away."
      },
      {
        title: "What if my child has specific dietary restrictions or allergies?",
        content: "We take effort to accommodate allergies and provide menu options that can be customized. Our team follows careful preparation practices to ensure meals are safe and free from cross-contamination."
      },
      {
        title: "What if I need food on Sunday?",
        content: "Our regular service is available Monday to Friday. If you require meals on a Sunday, please call us at +91 9176 917602 in advance. Our team will confirm availability and make special arrangements based on your request and delivery location."
      },
      {
        title: "Can I get a Free trial on Sunday?",
        content: "We don’t offer free trials on Sundays. Please choose any weekday or Saturday slot for your trial."
      },
      {
        title: "what if I don’t need meal on any day during my subscription, will I get a refund ?",
        content: "The days when you don’t avail meals will get carried forward and gets accumulated in your wallet , which can be redeemed during your next subscription."
      },
      {
        title: "What if i want to terminate the service? ",
        content: "Termination is possible , and the unconsumed meal days will be calculated and refund will be processed. Request you to contact customer service for termination of services."
      },
    ];

    return (
        <div className="planpricepage">
            <Mainheader  title="Plan & Pricing" description="This is Plan & Pricing page"/>
            <div className='pagebody'>
                <section className="pagebansec setpbanersec relative">
                    <div className='container mx-auto relative h-full' >
                        <div className='pageinconter relative h-full w-full flex items-center justify-center text-center'>
                    <div className='hworkTitle combtntb comtilte relative'>
                    <h1 className='flex flex-row textFF6514'> <span className='block firstspan'>Plan & </span> <span className='block ml-2'>Pricing</span></h1>
                    <p className=''>Choose the plan that perfectly fits your child’s needs and budget</p>
    
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
                <section className='ppricesec relative'>
                    <div className='container mx-auto' >
                        <div className='ppriceinrow w-full relative secpaddblock' >
                            <div className='ppriceTitle combtntb comtilte mb-[4vh] text-center'>
                                <h4>Wholesome food choices supporting active <strong>kids with energy and strength</strong></h4>
                            </div>
                            <div className='ppricebox flex'>
                                <div className='ppriceitem'>
                                  <div className='ppricetbox'>
                                    <h4 className='permnt'>Per Month</h4>
                                    <h2><small>₹</small>4,400</h2>
                                    <h6>22 Working Days</h6>
                                  </div>
                                  <div className='ppricembox'>
                                    <ul>
                                      <li>200 per meal (22 meals)</li>
                                      <li>Pre-planned, dietician-approved 30-day meal plan</li>
                                      <li>Add a sibling & save (5% off)</li>
                                      <li>Diet & allergy-friendly choices</li>
                                      <li>Flexible menu choices</li>
                                      <li>Multi-child subscription options</li>
                                    </ul>
                                  </div>
                                  <div className='ppricebbox'>
                                    <button>Get Started</button>
                                  </div>
                                </div>
                                <div className='ppriceitem'>
                                  <div className='ppricetbox'>
                                    <h4><del>₹ 13,200</del> / 3 months</h4>
                                    <h2><small>₹</small>12,540</h2>
                                    <h6>66 Working Days</h6>
                                  </div>
                                  <div className='ppricembox'>
                                    <ul>
                                      <li>200 per meal (66 meals)</li>
                                      <li>Pre-planned, dietician-approved 30-day meal plan </li>
                                      <li>Already includes 5% savings</li>
                                      <li>Add a sibling & save even more (extra 5%)</li>
                                      <li>Diet & allergy-friendly choices</li>
                                      <li>Multi-child subscription options</li>
                                    </ul>
                                  </div>
                                  <div className='ppricebbox'>
                                    <button>Get Started</button>
                                  </div>
                                  <div className="offerbox">
                                      <strong>5</strong><small>% <br/>OFF</small>
                                  </div>
                                </div>
                                <div className='ppriceitem'>
                                  <div className='ppricetbox'>
                                    <h4><del>₹ 26,400</del> / 6 months</h4>
                                    <h2><small>₹</small>23,760</h2>
                                    <h6>132 Working Days</h6>
                                  </div>
                                  <div className='ppricembox'>
                                    <ul>
                                      <li>200 per meal (132 meals)</li>
                                      <li>Pre-planned, dietician-approved 30-day meal plan </li>
                                      <li>Already includes 10% savings</li>
                                      <li>Add a sibling & save even more (extra 5%)</li>
                                      <li>Diet & allergy-friendly choices</li>
                                      <li>Multi-child subscription options</li>
                                    </ul>
                                  </div>
                                  <div className='ppricebbox'>
                                    <button>Get Started</button>
                                  </div>
                                  <div className="offerbox">
                                      <strong>10</strong><small>% <br/>OFF</small>
                                  </div>
                                </div>
                                <div className='ppriceitem customitem'>
                                  <div className='ppricetbox'>
                                    <h4>Popular</h4>
                                    <h2>Custom</h2>
                                    <h6>Plan</h6>
                                  </div>
                                  <div className='ppricembox'>
                                    <ul>
                                      <li>200 per meal (flexible count)</li>
                                      <li>Adjust for holidays/special events</li>
                                      <li>Pre-planned, dietician-approved 30-day meal plan </li>
                                      <li>Personalized dietician-suggested meal plan</li>
                                      <li>Diet & allergy-friendly choices</li>
                                      <li>Multi-child subscription options</li>
                                    </ul>
                                  </div>
                                  <div className='ppricebbox'>
                                    <button>Get Started</button>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>                
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

export default PlanPricingPage;