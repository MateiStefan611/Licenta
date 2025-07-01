import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { getCartAmount, currency, delivery_fee } = useContext(ShopContext);

  // Convert amounts to numbers and format properly
  const subtotal = Number(getCartAmount()) || 0;
  const shippingFee = Number(delivery_fee) || 0;
  const total = subtotal + shippingFee;

  return (
    <div className="w-full ">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTAL"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {shippingFee.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency} {total.toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
