import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import HomeProductCard from '@components/product/HomeProductCard';
import Letsfindout from '@components/home/Letsfindout';
import Htoworkslider from '@components/home/Htoworkslider';
import Hoteamsslide from '@components/home/Hoteamsslide';
import Accordion from '@components/faq/Accordion';
import HomepopVideo from '@components/home/HomepopVideo';
import Homebanimg from "../../public/home/homebanimg.jpeg";
import hintroImgOne from "../../public/home/hintroImg-one.jpg";
import hintroImgTwo from "../../public/home/hintroImg-two.jpg";
import HNutritionImg from "../../public/home/HNutritionImg.jpg";

import banicon1 from "../../public/home/icons/hban/lines.svg";
import banicon2 from "../../public/home/icons/hban/round.svg";
import banicon3 from "../../public/home/icons/hban/lines1.svg";
import banicon4 from "../../public/home/icons/hban/triangle.svg";
import banicon5 from "../../public/home/icons/hban/star2.svg";
import banicon6 from "../../public/home/icons/hban/star1.svg";
import hintroicon1 from "../../public/home/icons/hintro/yellowround-flower.svg";
import hintroicon2 from "../../public/home/icons/hintro/blue-and-orange-star.svg";
import hintroicon3 from "../../public/home/icons/hintro/blur-and-yellow-star.svg";
import hintroicon4 from "../../public/home/icons/hintro/violet-flower.svg";
import hintroicon5 from "../../public/home/icons/hintro/skyblueround-line.svg";
import hintroicon6 from "../../public/home/icons/hintro/orange-star.svg";
import hintroicon7 from "../../public/home/icons/hintro/yellow-flower.svg";
import hlfouticon1 from "../../public/home/icons/letsfindout/arrowround.svg";
import hlteamicon1 from "../../public/home/icons/hteam/white-arrow.svg";
import hlteamicon2 from "../../public/home/icons/hteam/pink-smileflower.svg";
import hlteamicon3 from "../../public/home/icons/hteam/red-triangle.svg";
import hlteamicon4 from "../../public/home/icons/hteam/yellow-flower.svg";
import hlteamicon5 from "../../public/home/icons/hteam/violetandyellow-flower.svg";
import hlteamicon6 from "../../public/home/icons/hteam/yellowround-star.svg";
import hldocticon1 from "../../public/home/icons/hdoctors/pinkstar.svg";
import hldocticon2 from "../../public/home/icons/hdoctors/cupcake.svg";
import hldocticon3 from "../../public/home/icons/hdoctors/orangestar.svg";
import hldocticon4 from "../../public/home/icons/hdoctors/skyblue-round.svg";
import hldocticon5 from "../../public/home/icons/hdoctors/watermelon.svg";
import hldocticon6 from "../../public/home/icons/hdoctors/yellowflower.svg";



const Home = () => {
 const [open, setOpen] = useState(false);
  
      const handleOpenDialog = () => {
        setOpen(true);
      };
    
      const handleCloseDialog = () => {
        setOpen(false);
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
          title: "Over time, what type of variation can I anticipate in the lunch bowl options?",
          content: "We make an effort to provide a varied and ever-changing menu to keep your child engaged.  In order to provide a variety of wholesome and enticing options, our culinary team frequently introduces new recipes and seasonal ingredients."
        },
        {
          title: "What safeguards are in place to guarantee a clean atmosphere for food preparation?",
          content: "Our cooking facilities are kept to the greatest hygienic standards.  All surfaces and equipment are routinely sterilized, our employees wear the proper protective gear, and they adhere to stringent handwashing guidelines.  We perform regular inspections and follow food safety laws."
        },
        {
          title: "How can I go about giving comments or resolving any issues I might have with the lunch bowls?",
          content: " We appreciate your input and invite you to contact our customer service department by phone or email.  We are dedicated to immediately resolving any difficulties to ensure your child's satisfaction since we take all complaints seriously."
        },
      ];





  return (
    <div class="homepage">
        <Mainheader  title="Home" description="This is Home page"/>
        <div className='pagebody'>
            <section className='HbanSec relative bg-white flex'>
                <div className='hbanLeft flex items-center justify-center' >
                      <div className='hbanCont combtntb relative'>
                        <h1 className='flex flex-col'>
                            <span className='block'>Healthy Bites</span> 
                            <span className='block'>t<strong className="iconone">o</strong> Fuel Y<strong className="icontwo">o</strong>ur</span> 
                            <span className='block'>Child's Mind</span>
                        </h1>
                        <h3>During School Lunch Time!</h3>
                          <p>Healthy, delectable alternatives that are loaded with <br />vital vitamins and minerals.</p><p className="parabtn flex"><Link href="/Menulist" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                          <div className='hbanIconss'>
                              <div className='hbicn iconone absolute'><Image src={banicon1} priority alt='Icon' /></div>
                              <div className='hbicn icontwo absolute'><Image src={banicon2} priority alt='Icon' className='iconrotates' /></div>
                              <div className='hbicn iconthree absolute'><Image src={banicon3} priority alt='Icon' className='iconrubberband' /></div>
                              <div className='hbicn iconfour absolute'><Image src={banicon4} priority alt='Icon' className='iconrotates' /></div>
                              <div className='hbicn iconfive absolute'><Image src={banicon5} priority alt='Icon' /></div>
                              <div className='hbicn iconsix absolute'><Image src={banicon6} priority alt='Icon' className='iconrotates' /></div>
                          </div>
                    </div>
                </div>
                <div className='hbanRight relative'>
                    <div className='banimgss'><Image className="w-full h-auto" priority src= {Homebanimg} alt="Banimg"  onClick={handleOpenDialog}/></div>
                </div>
            </section>

              <section className='HintroSec bg-FFF4D7 relative flex py-[12vh]'>
                  <div className='container mx-auto relative' >
                    <div className='flex items-center max-md:flex-col-reverse' >
                        <div className='flex-1 hbanLeft flex justify-center flex-col' >
                            <div className='hintroimgone rounded-[50%] overflow-hidden' >
                                <Image className="w-full h-auto" priority src= {hintroImgOne} alt="logo" />
                            </div>
                            <div className='hintroimgtwo rounded-[50%] overflow-hidden self-end' >
                                <Image className="w-full h-auto" priority src= {hintroImgTwo} alt="logo" />
                            </div>
                        </div>
                        <div className='flex-1 flex items-center hintroRight relative px-[4vw]'>
                            <div className='hintroLeft combtntb comtilte'>
                                <h4>The Mission Behind</h4>
                                <h3 className='flex flex-col text4AB138'>
                                    <span className='block'>Lunch Bowl</span> 
                                </h3>
                                <p>The goal of Lunch Bowl is to transform how kids get <br/>wholesome meals during the school day while directly <br/>addressing the difficulties experienced by working parents. <br/>In order to guarantee that every kid receives a nutritious, <br/>tasty meal that supports their learning and development, <br/>we are dedicated to delivering freshly made, healthful <br/>meals directly to schools.</p>
                                <p className="parabtn flex"><Link href="/about-us" className="emenulink relative" ><span className='block flex items-center relative'>Read More</span></Link></p>
                            </div>
                        </div>
                    </div>
                      <div className='hintroIconss'>
                          <div className='hintroicn iconone absolute'><Image src={hintroicon1} priority alt='Icon' className='iconrotates' /></div>
                          <div className='hintroicn icontwo absolute'><Image src={hintroicon2} priority alt='Icon' /></div>
                          <div className='hintroicn iconthree absolute'><Image src={hintroicon3} priority alt='Icon' /></div>
                          <div className='hintroicn iconfour absolute'><Image src={hintroicon4} priority alt='Icon' className='iconrotates' /></div>
                          <div className='hintroicn iconfive absolute'><Image src={hintroicon5} priority alt='Icon' className='iconrubberband' /></div>
                          <div className='hintroicn iconsix absolute'><Image src={hintroicon6} priority alt='Icon' /></div>
                          <div className='hintroicn iconseven absolute'><Image src={hintroicon7} priority alt='Icon' className='iconrotates' /></div>
                      </div>
                  </div>
            </section>
            <section className='HProlistSec bg-FF6514 relative bg-white flex py-[12vh]'>
                  <div className='container mx-auto relative' >
                    <div className='hProListTitle combtntb comtilte textcenter mb-[8vh]'>
                        <h3>Small Bites, Huge Impact</h3>
                        <h2 className='flex flex-col text-white'>
                            <span className='block'>30+ Healthy Packs</span> 
                        </h2>
                          <p className='text-white'>Nutrient-dense, well-portioned meals with a variety of flavors that are <br />intended to entertain and feed kids every day.</p>
                    </div>
                    <div className='hProList'>
                        <HomeProductCard limit={6}/>
                    </div>
                    <div className='hProListTitle combtntb comtilte textcenter mt-[5vh]'>                    
                        <p className="parabtn flex"><Link href="/Menulist" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                    </div>

                      {/* <div className='hMenusIconss'>
                          <div className='hMenuicn iconone absolute'><Image src={hintroicon1} priority alt='Icon' className='iconrotates' /></div>
                          <div className='hMenuicn icontwo absolute'><Image src={hintroicon2} priority alt='Icon' /></div>
                          <div className='hMenuicn iconthree absolute'><Image src={hintroicon3} priority alt='Icon' /></div>
                          <div className='hMenuicn iconfour absolute'><Image src={hintroicon4} priority alt='Icon' className='iconrotates' /></div>
                          <div className='hMenuicn iconfive absolute'><Image src={hintroicon5} priority alt='Icon' className='iconrubberband' /></div>
                          <div className='hMenuicn iconsix absolute'><Image src={hintroicon6} priority alt='Icon' /></div>
                          <div className='hMenuicn iconseven absolute'><Image src={hintroicon7} priority alt='Icon' className='iconrotates' /></div>
                      </div> */}
                </div>
            </section>
            <section className='HLFOlistSec bg-FFE6E6 relative  flex pt-[20vh] pb-[12vh]'>
                  <div className='container mx-auto flex flex-col items-start relative' >
                    <div className='hLFOTitle combtntb comtilte mb-[5vh]'>
                        <h3 className='text-[#000000]'>serving your school</h3>
                        <h2 className='flex flex-col text-EA1A27'>
                            <span className='block'>Lets Find Out!</span> 
                        </h2>
                        <p className=''>See whether your school is included in our list of schools that provide healthy, <br/>kid-friendly meals.</p>
                    </div>
                      <div className='hLFOintrow '>
                        <Letsfindout/>
                    </div>
                      <div className='hlfoutIconss'>
                          <div className='hlfouticn iconone absolute'><Image src={hlfouticon1} priority alt='Icon' /></div>
                      </div>
                </div>
            </section>
            <section className='HworktabSec relative bg-white flex py-[12vh]'>
                <div className='container mx-auto' >
                    <div className='hworkTitle combtntb comtilte textcenter  mb-[5vh]'>
                        <h4 className='text-[#000000]'>How IT</h4>
                        <h3 className='flex flex-col textFF6514'> <span className='block'>Works?</span> </h3>
                        <p className=''>See how our site works as soon as you register <br/>and create an account with us.</p>
                    </div>
                    <div className='hworkintrow '>
                        <Htoworkslider/>
                    </div>
                </div>
            </section>
            <section className='HteamSec relative bg-FF6514 flex py-[12vh]'>
                  <div className='container mx-auto relative' >
                    <div className='hworkTitle combtntb comtilte textcenter mb-[5vh]'>
                        <h4 className='text-[#000000]'>Meet the team</h4>
                        <h3 className='flex flex-col text-white'> <span className='block'>Behind the Magic</span> </h3>
                        <p className='text-white'>Experts in creating kid-friendly meals who combined inventiveness and fresh <br/>ingredients to create a nourishing and enchanted lunchtime experience.</p>
                    </div>
                    <div className='hworkintrow '>
                        <Hoteamsslide/>
                    </div>
                    <div className='hworkTitle combtntb comtilte textcenter mt-[5vh]'>                    
                        <p className="parabtn flex"><Link href="/about-us" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                    </div>
                      <div className='hteamIconss'>
                          <div className='hteamicn iconone absolute'><Image src={hlteamicon1} priority alt='Icon' /></div>
                          <div className='hteamicn icontwo absolute'><Image src={hlteamicon2} priority alt='Icon' /></div>
                          <div className='hteamicn iconthree absolute'><Image src={hlteamicon3} priority alt='Icon' /></div>
                          <div className='hteamicn iconfour absolute'><Image src={hlteamicon4} priority alt='Icon' /></div>
                          <div className='hteamicn iconfive absolute'><Image src={hlteamicon5} priority alt='Icon' /></div>
                          <div className='hteamicn iconsix absolute'><Image src={hlteamicon6} priority alt='Icon' className="zoominoutanimi" /></div>
                      </div>
                </div>
            </section>
            <section className='HNutritionSec relative bg-FFF4D7 flex py-[12vh]'>
                  <div className='container mx-auto relative' >
                    <div className='hNutritionTitle combtntb comtilte textcenter mb-[4vh]'>
                        <h4 className='text-[#000000]'>Explore Nutritious food</h4>
                        <h3 className='flex flex-col textFF6514'> <span className='block'>First free session awaits you</span> </h3>
                    </div>
                    <div className='hNutritionintImg '>
                        <Image className="w-full" priority src= {HNutritionImg} alt="logo" />
                          <div className='hDoctIconss'>
                              <div className='hDocticn iconone absolute'><Image src={hldocticon1} priority alt='Icon' /></div>
                              <div className='hDocticn icontwo absolute'><Image src={hldocticon2} priority alt='Icon' /></div>
                              <div className='hDocticn iconthree absolute'><Image src={hldocticon3} priority alt='Icon' /></div>
                              <div className='hDocticn iconfour absolute'><Image src={hldocticon4} priority alt='Icon' /></div>
                              <div className='hDocticn iconfive absolute'><Image src={hldocticon5} priority alt='Icon' /></div>
                              <div className='hDocticn iconsix absolute'><Image src={hldocticon6} priority alt='Icon' /></div>
                          </div>
                    </div>
                    <div className='hNutritionTitle combtntb comtilte textcenter mt-[4vh]'>      
                        <p className=''>Kickstart your child's wellness with a complimentary session to explore our <br/>yummy and healthy meal options. See how our nutritious food can make a positive difference!</p>      
                        <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Lets Talk</span></Link></p>
                    </div>
                </div>
            </section>
            <section className='HfaqSec relative bg-4AB138 flex'>
                <div className='Hfaqinrow w-full relative py-[12vh]' >
                    <div className='container mx-auto' >
                        <div className='faqcontain py-[6vw] px-[8vw] bg-white relative' >
                            <div className='hfaqTitle combtntb comtilte mb-[4vh]'>
                                <h4 className='text-[#000000]'>Frequently Asked</h4>
                                <h3 className='flex flex-col text4AB138'> <span className='block'>Questions</span> </h3>
                                <p>Quickly get answers to guarantee a seamless and <br/>knowledgeable lunch bowl experience.</p>
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
        <HomepopVideo open={open} onClose={handleCloseDialog}/>
    </div>
  );
}

export default Home;