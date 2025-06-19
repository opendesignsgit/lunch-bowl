import React from "react";
import  { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import Accordion from '@components/faq/Accordion';
import { useForm } from "react-hook-form";
import useTranslation from "next-translate/useTranslation";
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import { notifySuccess } from "@utils/toast";
import InputArea from "@components/form/InputArea";
import contforming from '../../public/contus/contforming.png'
import phoneicon from '../../public/contus/phone-icon.png'
import mailicon from '../../public/contus/mail-icon.png'
import locaticon from '../../public/contus/locat-icon.png'
import ateamicon1 from "../../public/menulist/icons/ban/yellowround-flower.svg";
import ateamicon2 from "../../public/menulist/icons/ban/redstar.svg";

const ContactUs = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const submitHandler = () => {
    notifySuccess(
      "your message sent successfully. We will contact you shortly."
    );
    e.preventDefault();
    if (!formData.consent) {
      alert("Please agree to be contacted by Lunch Bowl.");
      return;
    }
    console.log("Form Submitted:", formData);
    // Submit your form logic here
  };


  const faqItems = [
    {
      title: "How do you ensure the food is nutritious and safe for my child?",
      content: "We do quality tests, adhere to stringent cleanliness, and utilize only the freshest products. We adapt dishes to dietary requirements and address allergies."
    },
    {
      title: "What if my child has specific dietary restrictions or allergies?",
      content: "We take effort to accommodate allergies and provide menus that may be customized. We prevent cross-contamination with strict protocols."
    },
    {
      title: "How does the delivery process work, and can I trust it will arrive on time?",
      content: "For prompt delivery in temperature-controlled trucks, we work with schools. Confirmations will be sent to you, and any delays will be quickly communicated."
    },
    {
      title: "In what way are the lunch dishes sealed to keep them fresh and stop leaks?",
      content: "Our lunch dishes are tightly sealed with leak-proof, tamper-evident canisters.  To assist preserve the freshness of the food and temperature until noon, we use insulated bags for delivery."
    },
    {
      title: "Over time, what type of variation can I anticipate in the lunch bowl options? ",
      content: "We make an effort to provide a varied and ever-changing menu to keep your child engaged.  In order to provide a variety of wholesome and enticing options, our culinary team frequently introduces new recipes and seasonal ingredients."
    },
    {
      title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
      content: "Our cooking facilities are kept to the greatest hygienic standards.  All surfaces and equipment are routinely sterilized, our employees wear the proper protective gear, and they adhere to stringent handwashing guidelines.  We perform regular inspections and follow food safety laws."
    },
    {
      title: "How can I go about giving comments or resolving any issues I might have with the lunch bowls? ",
      content: " We appreciate your input and invite you to contact our customer service department by phone or email.  We are dedicated to immediately resolving any difficulties to ensure your child's satisfaction since we take all complaints seriously."
    },
  ];

  return (
    <div className="contuspage">
      <Mainheader title="Home" description="This is Home page" />
      <div className="pagebody">
        <section className="pagebansec contusbanersec relative">
          <div className="container mx-auto relative h-full">
            <div className="pageinconter relative h-full w-full flex items-center">
              <div className="hworkTitle combtntb comtilte">
                <h1 className="flex flex-col textFF6514">
                  {" "}
                  <span className="block firstspan">Let’s Cook Up</span>{" "}
                  <span className="block">a Conversation</span>{" "}
                </h1>
                <p className="">
                  We not only boil, fry and roast the ingredients, but also{" "}
                  <br />
                  we love to cook up a conversation with the people we love!
                </p>
                <Breadcrumbs />
              </div>
            </div>
            <div className="menulIconss">
              <div className="menulicn iconone absolute">
                <Image
                  src={ateamicon1}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
              <div className="menulicn icontwo absolute">
                <Image
                  src={ateamicon2}
                  priority
                  alt="Icon"
                  className="iconrotates"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="formsec pt-[10vh] pb-[14vh]">
          <div className="container mx-auto">
            <div className="items-center flex flex-col flex-wrap md:flex-row w-full justify-between contustop">
              <div className="flex contaddsboxs w-full">
                <div className="flex-1">
                  <div className="addsboxss adboxone">
                    <div className="addsIcon">
                      <Image src={phoneicon} alt="" />
                    </div>
                    <h3>Feel free to get in touch</h3>
                    <p>Give us a call today</p>
                    <p className="parabtn">
                      <Link href="tel:+911234567890">+91 9176 9176 02</Link>
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="addsboxss adboxone">
                    <div className="addsIcon">
                      <Image src={mailicon} alt="" />
                    </div>
                    <h3>Write to us</h3>
                    <p>Send us an email</p>
                    <p className="parabtn">
                      <Link href="mailto:lorem@url.in">
                        reachus@lunchbowl.co.in
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="addsboxss adboxone">
                    <div className="addsIcon">
                      <Image src={locaticon} alt="" />
                    </div>
                    <h3>Where to Find Us</h3>
                    <p className="parabtn">
                      <Link href="/">
                        1B, KG Natraj Palace, 53/22, Saravana Street, T Nagar{" "}
                        <br />
                        Chennai 600017
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:w-full lg:w-5/12 lg:flex flex-col h-full contusmid">
                <Image src={contforming} alt="logo" className="block w-full" />
              </div>
              <div className="px-0 pb-2 lg:w-5/12 flex flex-col md:flex-row formbox contuslast">
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="w-full mx-auto flex flex-col justify-center"
                >
                  <div className="flex flex-col space-y-5">
                    <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                      <div className="w-full md:w-1/2 inputbox">
                        <label>
                          First Name<sub>*</sub>
                        </label>
                        <InputArea
                          register={register}
                          name="firstname"
                          type="text"
                          placeholder="Enter First Name"
                        />
                        <Error errorName={errors.name} />
                      </div>
                      <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0 inputbox">
                        <label>
                          Last name<sub>*</sub>
                        </label>
                        <InputArea
                          register={register}
                          name="Lastname"
                          type="text"
                          placeholder="Enter Last Name"
                        />
                        <Error errorName={errors.name} />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
                      <div className="w-full md:w-1/2 inputbox">
                        <label>
                          Mobile Number<sub>*</sub>
                        </label>
                        <InputArea
                          register={register}
                          name="phone"
                          type="tel"
                          placeholder="Enter Mobile Number"
                        />
                        <Error errorName={errors.name} />
                      </div>
                      <div className="w-full md:w-1/2 md:ml-2.5 lg:ml-5 mt-2 md:mt-0 inputbox">
                        <label>
                          Email<sub>*</sub>
                        </label>
                        <InputArea
                          register={register}
                          name="email"
                          type="email"
                          placeholder="Enter Email"
                        />
                        <Error errorName={errors.email} />
                      </div>
                    </div>
                    <div className="relative mb-4 inputbox">
                      <label>
                        Message<sub>*</sub>
                      </label>
                      <textarea
                        {...register("message", {
                          required: `Message is required!`,
                        })}
                        name="message"
                        className="px-4 py-3 flex items-center w-full rounded appearance-none opacity-75 transition duration-300 ease-in-out text-sm focus:ring-0 bg-white border border-gray-300 focus:shadow-none focus:outline-none focus:border-gray-500 placeholder-body"
                        autoComplete="off"
                        spellCheck="false"
                        rows="2"
                        placeholder="Feel free to type here if you'd like to share something with us."
                      ></textarea>
                      <Error errorName={errors.message} />
                    </div>
                    <div className="relative mb-4 agreebox">
                      <div className="flex items-start">
                        <input
                          id="consent"
                          name="consent"
                          type="checkbox"
                          checked={formData.consent}
                          onChange={handleChange}
                          className="mt-1 mr-2"
                          required
                        />
                        <label htmlFor="consent" className="text-sm">
                          I agree to be contacted by <strong>Lunch Bowl</strong>{" "}
                          via call, SMS, email, or WhatsApp regarding their
                          services.
                        </label>
                      </div>
                    </div>
                    <div className="relative">
                      <button data-variant="flat" className="">
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="HfaqSec relative bg-4AB138 flex">
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
        <section className="contmapssec relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.9424573648606!2d80.23815376801967!3d13.030620836000514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267902684955d%3A0xfdf0c7a6d19abf5e!2sTemple%20Towers!5e0!3m2!1sen!2sin!4v1745314215818!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </div>
      <Mainfooter />
    </div>
  );
};

export default ContactUs;
