import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, quantity }) => {
  const { currency } = useContext(ShopContext);
  const displayImage = Array.isArray(image) ? image[0] : image;

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer group">
      <div className="relative max-w-[190px] aspect-[3/4] overflow-hidden mx-auto">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {quantity <= 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Out of stock
          </div>
        )}
      </div>

      <p className="pt-3 pb-1 text-sm truncate">{name}</p>
      <p className="text-sm font-medium">
        {price}
        {currency}
      </p>
    </Link>
  );
};

export default ProductItem;