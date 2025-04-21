import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import hintroImgOne from "../../public/home/hintroImg-one.jpg"
import hintroImgTwo from "../../public/home/hintroImg-two.jpg"


const AboutUs = () => {
  return ( 
    <div className="aboutuspage">    
      <Mainheader  title="Home" description="This is Home page"/>
          <div className='pagebody'>
              <section className="pagebansec aboutbanersec">
                <div className='container mx-auto relative h-full' >
                  <div className='pageinconter relative h-full w-full flex items-center'>
                    <div className='hworkTitle combtntb comtilte'>
                        <h1 className='flex flex-col textFF6514'> <span className='block'>The Story Behind</span> <span className='block'>Every Bite</span> </h1>
                        <p className=''>As food is an emotion, there will be a story <br/>behind every recipe. Let’s explore!</p>
                        <Breadcrumbs/>
                    </div>
                  </div>
                </div>
              </section>
              <section className='HintroSec aboutintrosec introbrsec relative bg-white flex py-[12vh]'>
                <div className='container mx-auto' >
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
                                <p>By doing that, we ensure that all parents are relieved of <br/>this worry and can rest easy knowing that their child is <br/>getting all the nutrients they need from their meal.</p>
                            </div>
                        </div>
                    </div>
                </div>
              </section>
              <section className='HmteamSec relative bg-white flex py-[12vh]'>
                <div className='container mx-auto' >
                    <div className='hintroLeft combtntb comtilte text-center'>
                        <h4>Meet the team</h4>
                        <h3 className='flex flex-col text4AB138'>
                            <span className='block'>Behind the Magic</span> 
                        </h3>
                        <p>Experts in creating kid-friendly meals who combined inventiveness and fresh <br/>ingredients to create a nourishing and enchanted lunchtime experience.</p>
                    </div>
                    <div className='flex items-center max-md:flex-col-reverse' >
                        <div className='flex-1 flex mteambox'>
                            <div className="mteamfront">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {hintroImgTwo} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='flex-1 flex mteambox'>
                            <div className="mteamfront">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {hintroImgTwo} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='flex-1 flex mteambox'>
                            <div className="mteamfront">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {hintroImgTwo} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='flex-1 flex mteambox'>
                            <div className="mteamfront">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {hintroImgTwo} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
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

export default AboutUs;
