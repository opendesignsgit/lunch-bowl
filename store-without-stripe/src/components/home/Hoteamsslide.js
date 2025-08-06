import React from 'react';
import Link from "next/link";
import Slider from "react-slick";
import Image from "next/image";
import teamimgone from "../../../public/home/teamimg-one.jpg"
const Hoteamsslide = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024, // Tablet and below
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 800, // Tablet and below
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 650, // Mobile devices
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
  return (
    <>
        <div className="slider-container">
      <Slider {...settings} className='teamsliders'>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden layone'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href="">LinkedIn</Link></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden laytwo'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden laythree'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden layfour'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden layone'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div> 
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden laytwo'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div>  
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden laythree'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div>  
        </div>
        <div>
                      <div className='flex teambox items-center group relative overflow-hidden layfour'>
                          <div className='flex-1 teamboximg overflow-hidden '>
                    <Image className="w-full h-auto m-auto" priority src= {teamimgone} alt="logo" />
                </div>       
                <div className='flex-1 teamboxcont absolute t-0 l-0 w-full h-full flex flex-col items-center justify-center'>
                    <h4>Chef. Aravind Kumar</h4>
                    <p><Link href=""><span>LinkedIn</span></Link></p>
                </div>                    
            </div> 
        </div>
      </Slider>
    </div>
    </>
  )
}

export default Hoteamsslide