import React, { useState } from 'react';
import Image from "next/image";
import Proimgtwobiriyani from "../../../public/home/biriyani-img-two.png";
import logtrialicon from "../../../public/logtrial-icon.svg";
import ProdetilProps from "@components/product/ProdetilProps";
import productsData from "../../jsonHelper/products.json";
import biriyaniImg from "../../../public/menu/biriyani-img.png";

const HomeProductCard = ({ limit }) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState("");

  // Use data from JSON file
  const products = productsData.products || [];

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Get unique cuisines from product data (only active products)
  const cuisines = [
    ...new Set(
      products
        .filter((product) => product?.status === "active")
        .map((item) => item?.cuisine)
        .filter(Boolean)
    ),
  ];

  // Filter products based on selected cuisine and active status
  const filteredProducts = products
    .filter((product) => product?.status === "active")
    .filter((product) =>
      selectedCuisine ? product?.cuisine === selectedCuisine : true
    );

  const displayedProducts = limit
    ? filteredProducts.slice(0, limit)
    : filteredProducts;

  if (!products.length) {
    return <div>No products available</div>;
  }

  return (
    <div>
      {/* Filter Component */}
      <div className="ProdfilterBox mb-6">
        <ul className="flex justify-center gap-4">
          <li className={`${selectedCuisine === "" ? "active" : ""}`}>
            <button
              className="filter-btn"
              onClick={() => setSelectedCuisine("")}
            >
              All
            </button>
          </li>
          {cuisines.map((cuisine, index) => (
            <li
              key={index}
              className={`${selectedCuisine === cuisine ? "active" : ""}`}
            >
              <button
                className="filter-btn"
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-row max-md:flex-col-reverse flex-wrap">
        {displayedProducts.map((item, index) => (
          <div
            key={item._id || index}
            className="group progroupitem bg-FFF4D7 basis-sm flex-none relative rounded-[15px] overflow-hidden"
            onClick={() => handleOpenDialog(item)}
          >
            <div className="proboxfront px-[2vw] py-[5vh] bg-FFF4D7 relative z-50 group-hover:z-0">
              {/* Animation text sections remain the same */}
              <div className="profbboxs">
                <div className="textcenter proboxtitle mb-[3vh]">
                  <h5>{item.primaryDishTitle}</h5>
                  <h3>{item.subDishTitle}</h3>
                  <p>{item.shortDescription}</p>
                </div>
                <div className="proImage">
                  <Image
                    className="w-full h-auto"
                    priority
                    src={biriyaniImg}
                    alt={`${item.primaryDishTitle} ${item.subDishTitle}`}
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>

            <div className="proboxBack px-[2vw] py-[3vh] bg-FFF4D7 absolute w-full h-full top-0 left-0 opacity-0 z-0 transition transition-all duration-[1s] ease-in-out group-hover:opacity-100 group-hover:z-50">
              <div className="arrowIcon absolute right-[2vw] top-[5vh] w-[45px] aspect-square bg-white rounded-full p-[12px]">
                <Image
                  className="w-full h-auto"
                  priority
                  src={logtrialicon}
                  alt="Logo Icon"
                />
              </div>
              {/* Animation text sections remain the same */}
              <div className="profbboxs relative h-full flex flex-col">
                <div className="proImage px-[2vw] h-full flex items-center">
                  <Image
                    className="w-full h-auto"
                    priority
                    src={Proimgtwobiriyani}
                    alt={`${item.primaryDishTitle} ${item.subDishTitle}`}
                    width={500}
                    height={500}
                  />
                </div>
                <div className="nutritionboxs mt-[auto] flex flex-wrap">
                  {/* Nutrition items remain the same */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProdetilProps
          open={open}
          onClose={handleCloseDialog}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default HomeProductCard;