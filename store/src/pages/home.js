import React from 'react';
import Link from "next/link";
import Image from "next/image";
import Mainheader from '@layout/header/Mainheader';
import Homebanimg from "../../public/home/homebanimg.jpeg"

const Home = () => {
  return (
    <div class="homepage">
        <Mainheader/>
        <section className='HbanSec relative bg-white flex'>
            <div className='hbanLeft flex items-center justify-center' >
                <div className='hbanCont combtntb'>
                    <h1 className='flex flex-col'>
                        <span className='block'>Healthy Bites</span> 
                        <span className='block'>t<strong>o</strong> Fuel Y<strong>o</strong>ur</span> 
                        <span className='block'>Child’s Mind</span>
                    </h1>
                    <h3>During School Lunch Time!</h3>
                    <p>Healthy, delectable alternatives that are loaded with <br/>vital vitamins and minerals.</p>
                    <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Explore Menu</span></Link></p>
                </div>
            </div>
            <div className='hbanRight relative'>
                <Image className="w-full h-auto" priority src= {Homebanimg} alt="logo" />
            </div>
        </section>

        <section className='HintroSec bg-FFF4D7 relative bg-white flex py-[12vh]'>
            <div className='container mx-auto' >
                <div className='flex items-center ' >
                    <div className='flex-1 hbanLeft flex items-center justify-center' >
                        <Image className="w-full h-auto" priority src= {Homebanimg} alt="logo" />
                    </div>
                    <div className='flex-1 flex items-center hintroRight relative px-[4vw]'>
                        <div className='hintroLeft combtntb comtilte'>
                            <h3>The Mission Behind</h3>
                            <h2 className='flex flex-col'>
                                <span className='block'>Lunch Bowl</span> 
                            </h2>
                            <p>The goal of Lunch Bowl is to transform how kids get <br/>wholesome meals during the school day while directly <br/>addressing the difficulties experienced by working parents. <br/>In order to guarantee that every kid receives a nutritious, <br/>tasty meal that supports their learning and development, <br/>we are dedicated to delivering freshly made, healthful <br/>meals directly to schools.</p>
                            <p className="parabtn flex"><Link href="/" className="emenulink relative" ><span className='block flex items-center relative'>Read More</span></Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
  );
}

export default Home;