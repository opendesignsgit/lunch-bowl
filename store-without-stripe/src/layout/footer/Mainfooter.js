import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import ctaimg from "../../../public/ctaimg.png"
import myLogo from "../../../public/logo/lunchbowl-logo.svg";
import {FacebookIcon,LinkedinIcon,TwitterIcon,WhatsappIcon,} from "react-share";
import GetinTouch from './GetinTouch';

import hldocticon1 from "../../../public/home/icons/footfrom/violet-and-yellow-star.svg";
import hldocticon2 from "../../../public/home/icons/footfrom/rounded.svg";
import hldocticon3 from "../../../public/home/icons/footfrom/skybluestar.svg";
import hldocticon4 from "../../../public/home/icons/footfrom/greenlayer-yellowstar.svg";
import hldocticon5 from "../../../public/home/icons/footfrom/greenheart.svg";
import hldocticon6 from "../../../public/home/icons/footfrom/pinkstar.svg";
import hldocticon7 from "../../../public/home/icons/footfrom/line-and-pinkround.svg";

const Mainfooter = () => {

  const [open, setOpen] = useState(false);
  
      const handleOpenDialog = () => {
        setOpen(true);
      };
    
      const handleCloseDialog = () => {
        setOpen(false);
      };


  return (
    <>
        <section className='HctaSec relative flex py-[12vh]'>
            <div className='container mx-auto relative' >                
                <div className='HctatImg w-[45%] m-auto'>
                    <Image className="w-full" priority src= {ctaimg} alt="logo" />
                </div>
                <div className='HctaTitle combtntb textcenter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <h4 className=''>We’d Love to Hear</h4>
                    <h3 className='flex flex-col textFF6514'> <span className='block'>From You</span> </h3>
                    <p className=''>We are super excited in cooking and <br/>providing the best meals to your kids. <br/>Give us a try.</p>                
                    <p className="parabtn flex mt-[3vh]"><Link href="/" className="emenulink relative" onClick={handleOpenDialog}><span className='block flex items-center relative'>Get in Touch</span></Link></p>
                </div>
          <div className='hfformIconss'>
            <div className='hfformicn iconone absolute'><Image src={hldocticon1} priority alt='Icon' /></div>
            <div className='hfformicn icontwo absolute'><Image src={hldocticon2} priority alt='Icon' className='iconrotates' /></div>
            <div className='hfformicn iconthree absolute'><Image src={hldocticon3} priority alt='Icon' /></div>
            <div className='hfformicn iconfour absolute'><Image src={hldocticon4} priority alt='Icon' className='iconrotates' /></div>
            <div className='hfformicn iconfive absolute'><Image src={hldocticon5} priority alt='Icon' className="zoominoutanimi" /></div>
            <div className='hfformicn iconsix absolute'><Image src={hldocticon6} priority alt='Icon' /></div>
            <div className='hfformicn iconseven absolute'><Image src={hldocticon7} priority alt='Icon' className='iconrubberband' /></div>
          </div>
            </div>
        </section>
    
        <footer className='FooterSec relative flex '>
            <div className='container mx-auto relative' >                
                <div className='Footertop m-auto py-[8vh] textcenter'>
                    <div className='footlogo w-[80px] m-auto mb-[2vh]'>
                        <Image className="w-full" priority src= {myLogo} alt="logo" />
                    </div>
                    <p className='text-white mb-[2vh]'>Fresh, healthy school lunches delivered with care, <br/>making mealtime easy for you.</p>
                    <ul className='Somediaul flex justify-center mb-[2vh]'>
                        <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <Link
                          href='/'
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <FacebookIcon size={34} round />
                        </Link>
                      </li>
                      <li className="flex items-center mr-3 transition ease-in-out duration-500"><Link
                          href='/'
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <TwitterIcon size={34} round />
                        </Link></li>
                        <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href='/'
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <LinkedinIcon size={34} round />
                        </Link>
                      </li>
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href='/'
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-gray-500 hover:text-white"
                        >
                          <WhatsappIcon size={34} round />
                        </Link>
                      </li>
                        <li><Link href="/" className="relative" ></Link></li>
                    </ul>
                    <ul className='footmenu flex justify-center'>
                        <li><Link href="/" className="relative" ><span className='block flex items-center relative'>Home</span></Link></li>
              <li><Link href="/about-us" className="relative" ><span className='block flex items-center relative'>About Us</span></Link></li>
                        <li><Link href="/" className="relative" ><span className='block flex items-center relative'>My Account</span></Link></li>
              <li><Link href="/Menulist" className="relative" ><span className='block flex items-center relative'>Food Menu</span></Link></li>
              <li><Link href="/contact-us" className="relative" ><span className='block flex items-center relative'>Contact Us</span></Link></li>
                    </ul>
                </div>
                <div className='footcopyrow columns-2 py-3'>
                    <div className='copycol'>
                        <p className='text-white'>Copyright © 2025. Lunch Bowl / Designed By</p>      
                    </div>
                    <div className='copymenucol'>
                        <ul className='footmenu flex justify-end'>
                <li><Link href="/terms-and-conditions/" className="relative" >Terms & Condition</Link></li>
                <li><Link href="/privacy-policy/" className="relative" >Privacy Policy</Link></li>
                <li><Link href="/refund-cancellation-policy/" className="relative" >Refund Policy</Link></li>
                        </ul>    
                    </div>
                </div>
            </div>
        </footer>
        
        <GetinTouch open={open} onClose={handleCloseDialog}/>
    </>
  )
}

export default Mainfooter