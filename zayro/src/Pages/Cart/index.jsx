import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import CartItems from "./cartItems";
import { MyContext } from "../../App";

const CartPage = () => {
  const context = useContext(MyContext);
  const items = context.cartItems || [];

  const subtotal = items.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.02);
  const total = subtotal + tax;

  return (
    <section className="section !py-12 bg-[#f5f5f5]">
      <div className="container w-full max-w-[1200px] mx-auto flex flex-col md:flex-row gap-5 !px-3">
        {/* LEFT SIDE */}
        <div className="leftPart w-full md:w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-3 !px-3 border-b">
              <h2 className="text-[18px] md:text-[20px] font-semibold">
                Your Cart
              </h2>
              <p className="!mt-0 text-[13px] md:text-[14px]">
                There {items.length === 1 ? "is" : "are"}{" "}
                <span className="font-bold text-[#ff5252] text-[16px]">
                  {items.length}
                </span>{" "}
                product{items.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            {items.length === 0 ? (
              <p className="!p-4 text-[14px] text-gray-500">
                Your cart is empty.
              </p>
            ) : (
              items.map((item) => (
                <CartItems
                  key={item._id}
                  data={item}
                  qty={item.quantity}
                  size="M"
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rightPart w-full md:w-[30%]">
          <div className="shadow-md rounded-md bg-white !p-5 sticky top-24">
            <h3 className="!pb-3 text-[18px] font-semibold">Cart Totals</h3>
            <hr className="opacity-30 !mb-2" />

            <p className="flex items-center justify-between text-[14px] font-[500]">
              <span>Subtotal</span>
              <span className="text-[#ff5252] font-bold">₹{subtotal}</span>
            </p>

            <p className="flex items-center justify-between text-[14px] font-[500]">
              <span>Shipping</span>
              <span className="font-bold">Free</span>
            </p>

            <p className="flex items-center justify-between text-[14px] font-[500]">
              <span>Tax</span>
              <span className="font-bold">₹{tax}</span>
            </p>

            <hr className="opacity-30 !my-2" />

            <p className="flex items-center justify-between text-[15px] font-[700]">
              <span>TOTAL</span>
              <span className="font-bold text-green-500">₹{total}</span>
            </p>

            <br />

            <div className="w-full">
              <Button
                disabled={items.length === 0}
                className={`btn-org btn-lg !text-[13px] !font-[600] w-full flex gap-2 ${
                  items.length === 0 ? "!opacity-40 !cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (items.length > 0) {
                    window.location.href = "/checkout";
                  }
                }}
              >
                <BsFillBagCheckFill className="text-[16px]" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
