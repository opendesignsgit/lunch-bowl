import React from "react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import Marquee from "react-fast-marquee";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import AboutVideoSlider from "@components/about/AboutVideoSlider";
import Htoworkslider from '@components/home/Htoworkslider';
import hintroImgOne from "../../public/home/hintroImg-one.jpg"
import hintroImgTwo from "../../public/home/hintroImg-two.jpg"
import ateamimgone from "../../public/about/team/ateamimg-one.jpg"
import ateamimgtwo from "../../public/about/team/ateamimg-two.jpg"
import ateamimgthree from "../../public/about/team/ateamimg-three.jpg"
import ateamimgfour from "../../public/about/team/ateamimg-four.jpg"
import visionimg from "../../public/about/vision-img.png"
import img1 from "../../public/about/environ-img1.jpg";
import img2 from "../../public/about/environ-img2.jpg";
import img3 from "../../public/about/environ-img3.jpg";
import img4 from "../../public/about/environ-img4.jpg";
import img5 from "../../public/about/environ-img5.jpg";
import img6 from "../../public/about/environ-img6.jpg";


const AboutUs = () => {
  return ( 
    <div className="aboutuspage">    
      <Mainheader  title="Home" description="This is Home page"/>
          <div className='pagebody'>
              <section className="pagebansec aboutbanersec relative">
                <div className='container mx-auto relative h-full' >
                  <div className='pageinconter relative h-full w-full flex items-center'>
                    <div className='hworkTitle combtntb comtilte'>
                        <h1 className='flex flex-col textFF6514'> <span className='block firstspan'>The Story Behind</span> <span className='block'>Every Bite</span> </h1>
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
              <section className='HmteamSec relative bg-FFE6E6 flex py-[12vh]'>
                <div className='container mx-auto' >
                    <div className='hintroLeft combtntb comtilte text-center mb-[5vh]'>
                        <h4>Meet the team</h4>
                        <h3 className='flex flex-col text4AB138'>
                            <span className='block'>Behind the Magic</span> 
                        </h3>
                        <p>Experts in creating kid-friendly meals who combined inventiveness and fresh <br/>ingredients to create a nourishing and enchanted lunchtime experience.</p>
                    </div>
                    <div className='flex flex-wrap items-center mteamitembox ' >
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgone} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personone top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgtwo} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] persontwo top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgthree} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personthree top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgfour} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personfour top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgfour} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personfour top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgfour} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personfour top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgfour} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personfour top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                        <div className='w-[25%] flex-none flex mteambox relative group'>
                            <div className="mteamfront w-full text-center">
                              <div className="mteamimg">
                                <Image className="w-full h-auto" priority src= {ateamimgfour} alt="logo" />
                              </div>
                              <h3>Chef. Aravind Kumar</h3>
                            </div>
                            <div className="mteamback absolute w-full h-full flex flex-col justify-center items-center text-center p-[20px] personfour top-full transition-all duration-1000 ease-in-out group-hover:top-0">
                                <h3>Chef. Aravind Kumar</h3>
                                <p>Lorem ipsum dolor sit amet consectetur. Placerat proin eu amet amet egestas aenean. Nunc dictumst enim eleifend ullamcorper sed ac neque. Vitae cras nisl varius aliquet pharetra.Imperdiet bibendum at vestibulum ut eget quam facilisis. </p>
                                <p><Link href="/"><span>LinkedIn</span></Link></p>
                            </div>
                        </div>
                    </div>
                </div>
              </section>              
              <section className='HmvisionSec relative bg-FF6514 flex '>
                <div className='container mx-auto' >
                  <div className='flex items-center' >
                    <div className='flex-none w-[60%] visimgcol' >
                        <Image className="w-full h-auto" priority src= {visionimg} alt="logo" />
                    </div>
                    <div className='flex-none w-[40%]' >
                      <div className='hintroLeft combtntb comtilte '>
                          <h4 className="text-white">The vision Behind</h4>
                          <h3 className='flex flex-col text-white'>
                              <span className='block'>Lunch Bowl</span> 
                          </h3>
                          <p className="text-white">Lunch Bowl envisions transforming school lunch experiences by emphasizing creative cuisine and fresh ingredients. In our ideal system, children will find eating healthy and comfort meals, developing a lifetime love of wholesome food. Our objective is to collaborate with communities, parents, and schools to provide a smooth, easily available solution that enables children to realize their greatest potential via the power of healthy eating.</p>
                          <p className="text-white">To use vibrant, fresh foods organized in a way that sparks interest and delight in order to create a lunch experience that turns eating into an adventure. </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>          
              <section className='abtvideoSec relative'>
                <div className='abtvideorow '>
                        <AboutVideoSlider/>
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
              <section className='HOEnviroSec relative bg-4AB138 flex py-[10vh]'>
                  <div className='OEnvicontainer' >
                      <div className='hOEnviroTitle combtntb comtilte textcenter  mb-[5vh]'>
                          <h4 className=''>Our</h4>
                          <h3 className='flex flex-col text-white'> <span className='block'>Environment</span> </h3>
                          <p className='text-white'>According to the saying, cleanliness is next to godliness, <br/>
                          we make sure our workspace is neat and tidy.</p>
                      </div>
                      <div className='hOEnvirorow '>
                        <Marquee speed={50} delay={0} >                            
                          <div className="image_wrapper">
                            <Image src={img1} alt="" />
                          </div>
                          <div className="image_wrapper imgsmlbox">
                            <Image src={img2} alt="" />
                          </div>
                          <div className="image_wrapper">
                            <Image src={img3} alt="" />
                          </div>
                          <div className="image_wrapper imgsmlbox">
                            <Image src={img4} alt="" />
                          </div>
                          <div className="image_wrapper ">
                            <Image src={img5} alt="" />
                          </div>
                          <div className="image_wrapper imgsmlbox">
                            <Image src={img6} alt="" />
                          </div>
                        </Marquee>
                      </div>
                  </div>
              </section>
          </div>
      <Mainfooter/>
    </div>
  );
};

export default AboutUs;
