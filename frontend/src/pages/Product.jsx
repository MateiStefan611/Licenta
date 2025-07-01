import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

import RelatedProduct from "../components/RelatedProduct";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, volumeMultipliers } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("50"); // default size 50ml

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        if (item.sizes && item.sizes.length > 0) {
          setSize(item.sizes[0]);
        }
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const calculatedPrice = productData
    ? (productData.price * (volumeMultipliers[size] || 1)).toFixed(2)
    : 0;

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* PRODUCT DATA */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* PRODUCT IMAGES */}

        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, i) => (
              <img
                src={item}
                key={i}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[50%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1 ">
          <h1 className="font-medium text-2xl my-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3.5" src="/star_icon.png" alt="" />
            <img className="w-3.5" src="/star_icon.png" alt="" />
            <img className="w-3.5" src="/star_icon.png" alt="" />
            <img className="w-3.5" src="/star_icon.png" alt="" />
            <img className="w-3.5" src="/star_dull_icon.png" alt="" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {calculatedPrice}
            {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.type}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Volume</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((item, i) => {
                  const isOutOfStock =
                    !productData.quantity?.[item] ||
                    productData.quantity[item] === 0;

                  return (
                    <button
                      className={`border py-2 px-4 ${
                        isOutOfStock
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100"
                      } ${item === size ? "border-orange-500" : ""}`}
                      key={i}
                      onClick={() => !isOutOfStock && setSize(item)}
                      disabled={isOutOfStock}
                    >
                      {item} ml
                    </button>
                  );
                })}
              </div>

              {!productData.quantity?.[size] ||
              productData.quantity[size] === 0 ? (
                <span className="text-red-500 text-sm mt-1">
                  Out of stock :(
                </span>
              ) : null}
            </div>
          </div>

          <button
            className={`px-8 py-3 text-sm ${
              !productData.quantity?.[size] || productData.quantity[size] === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white active:bg-gray-700"
            }`}
            onClick={() => {  
              if (productData.quantity?.[size] > 0) {
                addToCart(productData._id, size);
              }
            }}
            disabled={
              !productData.quantity?.[size] || productData.quantity[size] === 0
            }
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash o delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION AND REVIEW SECTION */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm ">Description</b>
          <p className="border px-5 py-3 text-sm ">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-3 py-6 text-sm text-gray-500">
          <p>{productData.productInfo}</p>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-20 mb-20">
        <RelatedProduct
          subCategory={productData.subCategory}
          type={productData.type}
          currentId={productData._id}
        />
      </div>
    </div>
  ) : null;
};

export default Product;
