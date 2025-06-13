import React from 'react'
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@layout/Breadcrumbs";
import Mainheader from '@layout/header/Mainheader';
import Mainfooter from '@layout/footer/Mainfooter';
import HomeProductCard from '@components/product/HomeProductCard';

import ateamicon1 from "../../public/menulist/icons/ban/yellowround-flower.svg";
import ateamicon2 from "../../public/menulist/icons/ban/redstar.svg";
const Menulist = () => {
  return (
    <>
        <div className="menulistpage">    
            <Mainheader  title="Menu List" description="Menu List"/>
            <div className='pagebody'>
              <section className="pagebansec MenusLbanersec relative">
                <div className='container mx-auto relative h-full' >
                  <div className='pageinconter relative h-full w-full flex items-center'>
                    <div className='hworkTitle combtntb comtilte'>
                        <h1 className='flex flex-col textFF6514'> <span className='block firstspan'>The Story Behind</span> <span className='block'>Every Bite</span> </h1>
                        <p className=''>As food is an emotion, there will be a story <br/>behind every recipe. Let’s explore!</p>
                        <Breadcrumbs/>
                    </div>
                  </div>
              <div className='menulIconss'>
                <div className='menulicn iconone absolute'><Image src={ateamicon1} priority alt='Icon' className='iconrotates' /></div>
                <div className='menulicn icontwo absolute'><Image src={ateamicon2} priority alt='Icon' className='iconrotates' /></div>
              </div>
                </div>
              </section>
                <section className='HProlistSec inProListsec bg-FFF4D7 relative  flex py-[12vh]'>
                    <div className='container mx-auto' >
                        <div className='hProListTitle combtntb comtilte textcenter mb-[8vh]'>
                            <h3>The Mission Behind</h3>
                            <h2 className='flex flex-col textFF6514'>
                                <span className='block'>30+ Nutritious Picks</span> 
                            </h2>
                            <p className=''>Select your child’s go-to cuisine and check out what’s on the menu.</p>
                        </div>
                        <div className='hProList'>
                            <HomeProductCard/>
                        </div>
                    </div>
                </section>
            </div>
            <Mainfooter/>
        </div>
    </>
  )
}

export default Menulist