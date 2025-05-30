import React from 'react';
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import hworkstepImgone from "../../../public/home/hworkstepImg-one.png"


const Htoworkslider = () => {
    
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    let sliderRef1 = useRef(null);
    let sliderRef2 = useRef(null);
  
    useEffect(() => {
      setNav1(sliderRef1);
      setNav2(sliderRef2);
    }, []);

  return (
    <>
        <div className="slider-container">
            <Slider asNavFor={nav1} ref={slider => (sliderRef2 = slider)} slidesToShow={6} swipeToSlide={false} focusOnSelect={true} draggable={false} swipe={false} arrows={false} infinite={false}  className='sliderRef2 mb-[8vh]'>
                <div>
                    <h3><span>Step 01</span></h3>
                </div>
                <div>
                    <h3><span>Step 02</span></h3>
                </div>
                <div>
                    <h3><span>Step 03</span></h3>
                </div>
                <div>
                    <h3><span>Step 04</span></h3>
                </div>
            </Slider>
            <Slider asNavFor={nav2} ref={slider => (sliderRef1 = slider)} swipeToSlide={true} arrows={true} infinite={true} className='sliderRef1'>
                <div>
                    <div className='flex rfbox items-center'>
                        <div className='flex-1 rfboximg'>
                            <Image className="w-[16vw] h-auto m-auto" priority src= {hworkstepImgone} alt="logo" />
                        </div>       
                        <div className='flex-1 rfboxcoint'>
                            <h4>Create Your Account</h4>
                            <p>Begin by easily registering and providing your necessary <br/>details. This simple step unlocks a wide selection of <br/>nutritious and appealing lunch choices specifically <br/>designed for your children.</p>
                        </div>                    
                    </div>                    
                </div>
                <div>
                    <div className='flex rfbox items-center'>
                        <div className='flex-1 rfboximg'>
                            <Image className="w-[16vw] h-auto m-auto" priority src= {hworkstepImgone} alt="logo" />
                        </div>       
                        <div className='flex-1 rfboxcoint'>
                            <h4>Choose Your Menu</h4>
                            <p>Explore our diverse menu options and select your child's <br/>most loved dishes. Feel free to experiment with our range <br/>of wholesome meals, catering to various tastes <br/>and nutritional needs.</p>
                        </div>                    
                    </div>   
                </div>
                <div>
                    <div className='flex rfbox items-center'>
                        <div className='flex-1 rfboximg'>
                            <Image className="w-[16vw] h-auto m-auto" priority src= {hworkstepImgone} alt="logo" />
                        </div>       
                        <div className='flex-1 rfboxcoint'>
                            <h4>Place Your Order</h4>
                            <p>Conveniently plan your preferred delivery schedule and <br/>carefully review all order information to ensure accuracy. <br/>Our secure payment system offers a safe and straightforward process <br/>for finalizing your order.</p>
                        </div>                    
                    </div>   
                </div>
                <div>
                    <div className='flex rfbox items-center'>
                        <div className='flex-1 rfboximg'>
                            <Image className="w-[16vw] h-auto m-auto" priority src= {hworkstepImgone} alt="logo" />
                        </div>       
                        <div className='flex-1 rfboxcoint'>
                            <h4>Sit Back and Relax</h4>
                            <p>Once your order is placed, you can rest assured. Our team <br/>will expertly prepare a healthy and fresh lunch for <br/>your child and ensure it is reliably delivered <br/>directly to their school.</p>
                        </div>                    
                    </div>   
                </div>
            </Slider>
        </div>
    </>
  )
}

export default Htoworkslider