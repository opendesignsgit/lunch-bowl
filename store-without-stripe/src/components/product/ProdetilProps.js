import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import { Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png";

const ProdetilProps = ({ open, onClose, product }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      className="propetilpopus"
    >
      <IconButton
        className="popClose"
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16 }}
      >
        <CloseIcon />
      </IconButton>

      <div className="propetPopBox flex">
        {/* Left Side: Slider and Title */}
        <div className="popbimg w-[45%] bg-FFF4D7 overflow-hidden relative p-[2vw]">
          <div className="fontanimi pointer-events-none">
            <div className="animitext animiOne">
              <span>{product?.primaryDishTitle || "Dish Title"}</span>
              <span>{product?.primaryDishTitle || "Dish Title"}</span>
            </div>
            <div className="animitext animiTwo">
              <span>{product?.subDishTitle || "Sub Title"}</span>
              <span>{product?.subDishTitle || "Sub Title"}</span>
            </div>
          </div>
          <div className="slider-container flex items-center">
            <Slider {...settings} className="Prodeilsliders">
              <div>
                <div className="flex-1 teamboximg rounded-full overflow-hidden">
                  <Image
                    className="w-full h-auto m-auto"
                    priority
                    unoptimized
                    crossorigin="anonymous"
                    src={
                      product.image
                        ? product.image.startsWith("http")
                          ? product.image
                          : `http://localhost:5055${
                              product.image.startsWith("/")
                                ? product.image
                                : `/${product.image}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={product?.primaryDishTitle || "Dish Image"}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
              <div>
                <div className="flex-1 teamboximg rounded-full overflow-hidden">
                  <Image
                    className="w-full h-auto m-auto"
                    priority
                    unoptimized
                    crossorigin="anonymous"
                    src={
                      product.image
                        ? product.image.startsWith("http")
                          ? product.image
                          : `http://localhost:5055${
                              product.image.startsWith("/")
                                ? product.image
                                : `/${product.image}`
                            }`
                        : Proimgtwobiriyani
                    }
                    alt={product?.primaryDishTitle || "Dish Image"}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </Slider>
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="popbcont w-[55%] p-[3.5vw]">
          {/* Cuisine Type */}
          <div className="mb-[2vh]">
            <span className="text-sm font-medium text-gray-500">Cuisine:</span>
            <span className="ml-2 text-sm font-semibold">
              {product?.cuisine || "Not specified"}
            </span>
          </div>

          {/* Main Title and Subtitle */}
          <div className="mb-[2vh]">
            <h1 className="text-3xl font-bold">
              {product?.primaryDishTitle || "Dish Title"}
            </h1>
            <h2 className="text-2xl text-gray-600">
              with {product?.subDishTitle || "Sub Dish"}
            </h2>
          </div>

          {/* Short Description */}
          <div className="mb-[4vh]">
            <p className="text-lg italic text-gray-700">
              {product?.shortDescription || "Short description not available"}
            </p>
          </div>

          {/* Full Description */}
          <div className="mb-[4vh]">
            <h3 className="text-xl font-semibold mb-2">About This Dish</h3>
            <p className="text-gray-700">
              {product?.description || "Detailed description not available"}
            </p>
          </div>

          {/* Ingredients (You can make this dynamic if your data includes it) */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Key Ingredients</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Fresh {product?.primaryDishTitle || "main ingredient"}</li>
              <li>Organic {product?.subDishTitle || "side ingredient"}</li>
              <li>Special blend of spices</li>
              <li>Fresh herbs</li>
            </ul>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProdetilProps;
