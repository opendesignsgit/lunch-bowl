import React from 'react'
import Image from 'next/image';
import Slider from "react-slick";
import { Dialog, IconButton, Box } from "@mui/material";
import Proimgbiriyani from "../../../public/home/biriyani-img.png"
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png"
import CloseIcon from "@mui/icons-material/Close";

const ProdetilProps = ({ open, onClose }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,        
        autoplay: true,
        autoplaySpeed: 2000
      };
  const [maxWidth, setMaxWidth] = React.useState('lg');
  return (
    <>
        <Dialog open={open} onClose={onClose} maxWidth={maxWidth} className="propetilpopus">
                <IconButton className="popClose" onClick={onClose} sx={{ position: "absolute", top: 16, right: 16 }} > <CloseIcon />  </IconButton>

                <div className='propetPopBox flex'>
                    <div className='popbimg  w-[45%] bg-FFF4D7 overflow-hidden relative p-[2vw]'>                        
                        <div className='fontanimi pointer-events-none'>
                            <div className='animitext animiOne'><span>Veg Biriyani</span><span>Veg Biriyani</span></div>
                            <div className='animitext animiTwo'><span>Biriyani Veg</span><span>Biriyani Veg</span></div>
                        </div>
                        <div className="slider-container flex items-center">
                            <Slider {...settings} className='Prodeilsliders'>
                                <div>                                    
                                    <div className='flex-1 teamboximg rounded-full overflow-hidden'>
                                        <Image className="w-full h-auto m-auto" priority src= {Proimgbiriyani} alt="logo" />
                                    </div>  
                                </div>
                                <div>                              
                                    <div className='flex-1 teamboximg rounded-full overflow-hidden'>
                                        <Image className="w-full h-auto m-auto" priority src= {Proimgtwobiriyani} alt="logo" />
                                    </div> 
                                </div>
                            </Slider>
                        </div>
                    </div>
                    <div className='popbcont w-[55%] p-[3.5vw]'>
                        <div className='mb-[4vh]'>
                            <h3>Ghee Rice</h3>
                            <p className='mb-[0]'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
                        </div>
                        <div className='mb-[4vh]'>
                            <h3>Ingredients</h3>
                            <p className='mb-[0]'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
                        </div>
                        <div className='mb-[0vh]'>
                            <h3>Nutrition Value</h3>
                            <ul className='flex flex-wrap gap-2'>
                                <li>Calories <strong>100 Kcal</strong></li>
                                <li>Carbs <strong>8 g</strong></li>
                                <li>Proteins <strong>10 g</strong></li>
                                <li>Fats <strong>2 g</strong></li>
                                <li>Vitamins <strong>10 g</strong></li>
                                <li>Minerals <strong>10 g</strong></li>
                                <li>Cholesterol <strong>1.2 g</strong></li>
                                <li>Calcium <strong>10 g</strong></li>
                                <li>Iron <strong>10 g</strong></li>
                                <li>Potassium <strong>5 g</strong></li>
                                <li>Fiber <strong>5 g</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                

        </Dialog>
    
    </>
  )
}

export default ProdetilProps