import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProduct = ({ subCategory, type, currentId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    console.log("subCategory:", subCategory);
    console.log("type:", type);

    if (products.length > 0 && subCategory && type) {
      const currentSub = subCategory.trim().toLowerCase();
      const currentType = type.trim().toLowerCase();

      // First: try to match both subCategory and type
      let filtered = products.filter((item) => {
        const itemSub = item.subCategory?.trim().toLowerCase();
        const itemType = item.type?.trim().toLowerCase();

        return (
          itemSub === currentSub &&
          itemType === currentType &&
          item._id !== currentId
        );
      });

      // If no matches, fallback to only subCategory
      if (filtered.length === 0) {
        console.log("No exact match, falling back to subCategory only...");
        filtered = products.filter((item) => {
          const itemSub = item.subCategory?.trim().toLowerCase();
          return itemSub === currentSub && item._id !== currentId;
        });
      }

      console.log("Filtered related products:", filtered);
      setRelated(filtered.slice(0, 5));
    }
  }, [products, subCategory, type, currentId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 gap-y-6">
        {related.length > 0 ? (
          related.map((item, i) => (
            <ProductItem
              key={i}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No related products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
