import React, { useState } from 'react';
import Image from "next/image";
import Proimgbiriyani from "../../../public/home/biriyani-img.png"
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png"
import logtrialicon from "../../../public/logtrial-icon.svg"
import productData from './homeProductCardData.json';

const HomeProductCard = () => {
    // State for the selected cuisine filter
    const [selectedCuisine, setSelectedCuisine] = useState('');

    // Get unique cuisines from product data
    const cuisines = [
        ...new Set(productData.map(item => item.cuisine)) // Extract unique cuisines
    ];

    const filteredProducts = selectedCuisine
        ? productData.filter(item => item.cuisine === selectedCuisine)
        : productData;

    return (
        <div>
            {/* Filter Component */}
            <div className="filter-container mb-6">
                <button
                    className="filter-btn"
                    onClick={() => setSelectedCuisine('')}
                >
                    All
                </button>

                {/* Dynamically generate filter buttons */}
                {cuisines.map((cuisine, index) => (
                    <button
                        key={index}
                        className="filter-btn"
                        onClick={() => setSelectedCuisine(cuisine)}
                    >
                        {cuisine}
                    </button>
                ))}
            </div>

            <div className='flex flex-row gap-x-6 gap-y-6 max-md:flex-col-reverse flex-wrap'>
                {/* Render filtered products */}
                {filteredProducts.map((item, index) => (
                    <div key={index} className='group basis-sm flex-1 relative rounded-[15px] overflow-hidden col-span-4'>
                        <div className='proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0'>
                            <div className='fontanimi pointer-events-none'>
                                <div className='animitext animiOne'>
                                    <div className='animitext animiOne'><span>{item.primaryDishTitle} {item.subDishTitle}</span><span>{item.primaryDishTitle} {item.subDishTitle}</span></div>
                                    <div className='animitext animiTwo'><span>{item.subDishTitle} {item.primaryDishTitle}</span><span>{item.subDishTitle} {item.primaryDishTitle}</span></div>
                                </div>
                                <div className='animitext animiTwo'>
                                    <div className='animitext animiOne'><span>{item.primaryDishTitle} {item.subDishTitle}</span><span>{item.primaryDishTitle} {item.subDishTitle}</span></div>
                                    <div className='animitext animiTwo'><span>{item.subDishTitle} {item.primaryDishTitle}</span><span>{item.subDishTitle} {item.primaryDishTitle}</span></div>
                                </div>
                            </div>
                            <div className='profbboxs'>
                                <div className='textcenter proboxtitle mb-[3vh]'>
                                    <h5>{item.primaryDishTitle}</h5>
                                    <h3>{item.subDishTitle}</h3>
                                    <p>{item.shortDescription}</p>
                                </div>
                                <div className='proImage'>
                                    <Image className="w-full h-auto" priority src={Proimgbiriyani} alt="Dish Front" width={500} height={500} />
                                </div>
                            </div>
                        </div>

                        <div className='proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50'>
                            <div className='arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]'>
                                <Image className="w-full h-auto" priority src={logtrialicon} alt="Logo Icon" />
                            </div>
                            <div className='fontanimi pointer-events-none'>
                                <div className='animitext animiOne'>
                                    <div className='animitext animiOne'><span>{item.primaryDishTitle} {item.subDishTitle}</span><span>{item.primaryDishTitle} {item.subDishTitle}</span></div>
                                    <div className='animitext animiTwo'><span>{item.subDishTitle} {item.primaryDishTitle}</span><span>{item.subDishTitle} {item.primaryDishTitle}</span></div>
                                </div>
                                <div className='animitext animiTwo'>
                                    <div className='animitext animiOne'><span>{item.primaryDishTitle} {item.subDishTitle}</span><span>{item.primaryDishTitle} {item.subDishTitle}</span></div>
                                    <div className='animitext animiTwo'><span>{item.subDishTitle} {item.primaryDishTitle}</span><span>{item.subDishTitle} {item.primaryDishTitle}</span></div>
                                </div>
                            </div>
                            <div className='profbboxs relative h-full flex flex-col'>
                                <div className='proImage px-[2vw] h-full flex items-center'>
                                    <Image className="w-full h-auto" priority src={Proimgtwobiriyani} alt="logo" />
                                </div>
                                <div className='nutritionboxs mt-[auto] flex flex-wrap'>
                                    {/* Nutrition Content */}
                                    <div className="nutritionitems flex items-center w-[50%] max-md:w-[100%] px-[10px]">
                                        <h5 className='w-[50%]'>Calories</h5>
                                        <ul className="flex items-center w-[50%] onebox">
                                            <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li> <li>&nbsp;</li>
                                        </ul>
                                    </div>
                                    {/* More nutrition items */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeProductCard;
