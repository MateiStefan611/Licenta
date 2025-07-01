import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const bestProducts = products.filter((item) => item.bestSeller);
    setBestSeller(bestProducts);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // pixels to scroll
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Look into the most bought and appreciated parfumes
        </p>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
          aria-label="Scroll left"
        >
          &#8592;
        </button>

        {/* Scrollable container */}
        <div className="flex overflow-x-auto space-x-4 px-8" ref={scrollRef}>
          {bestSeller.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-1/4">
              {" "}
              {/* 1/4 means 25% width */}
              <ProductItem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2"
          aria-label="Scroll right"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default BestSeller;
