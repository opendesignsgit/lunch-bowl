import React from 'react';
import Mainheader from "@layout/header/Mainheader";
import Mainfooter from "@layout/footer/Mainfooter";
import Accordion from '@components/faq/Accordion';
import MenuCalendar from '../../components/MenuCalendar/MenuCalendar';

const MenuCalendarPage = () => {

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

            <div className="calandySecs py-[12vh]">
              <div className="container mx-auto relative ">
                <div className="w-full bg-white MCcalendy rounded-xl overflow-hidden">
                  <MenuCalendar />
                </div>
              </div>
            </div> 
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

export default MenuCalendarPage;
