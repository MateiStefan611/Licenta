import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, quantity }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="relative overflow-hidden w-40 h-50">
        <img
          src={image[0]}
          alt=""
          className="w-full h-full object-cover hover:scale-110 transition ease-in-out"
        />
        {quantity <= 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Out of stock
          </div>
        )}
      </div>
      
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {price}
        {currency}
      </p>
    </Link>
  );
};

export default ProductItem;
