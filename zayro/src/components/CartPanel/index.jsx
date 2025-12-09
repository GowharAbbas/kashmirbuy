import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";

const CartPanel = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  if (!context) return null;

  const items = context?.cartItems || [];

  const subtotal = items.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.02);
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="flex flex-col h-full max-h-[100vh]">
      {/* -------- Scroll Items -------- */}
      <div className="scroll w-full max-h-[350px] overflow-y-scroll overflow-x-hidden !py-3 !px-4">
        {items.length === 0 && (
          <p className="text-[14px] text-gray-500 p-4">Your cart is empty.</p>
        )}

        {items.map((item) => {
          const product = item.productId || {};
          return (
            <div
              key={item._id}
              className="cartItem w-full flex items-center gap-5 border-b border-[rgba(0,0,0,0.1)] !pb-4 !pt-4"
            >
              {/* IMAGE */}
              <div className="img w-[20%] overflow-hidden h-[80px] rounded-md">
                <Link
                  to={`/product/${product._id}`}
                  className="block group"
                  onClick={context.toggleCartPanel(false)}
                >
                  <img
                    src={
                      product?.images?.[0] ||
                      "https://via.placeholder.com/150x200?text=No+Image"
                    }
                    alt={product?.name}
                    className="w-full group-hover:scale-105 transition-all"
                  />
                </Link>
              </div>

              {/* INFO */}
              <div className="info w-[80%] relative">
                <Link
                  to={`/product/${product._id}`}
                  className="link transition-all"
                  onClick={context.toggleCartPanel(false)}
                >
                  <h4 className="text-[15px] font-[500]">{product?.name}</h4>
                </Link>

                <p className="flex items-center gap-4 !text-[14px] !mt-2 !mb-2">
                  <span>Qty: {item.quantity}</span>
                  <span className="text-[#ff5252] font-bold">
                    Price: ₹{product?.price}
                  </span>
                </p>

                <MdDeleteOutline
                  className="absolute top-6 right-3 cursor-pointer text-[25px] text-[rgba(0,0,0,0.7)] hover:text-red-500"
                  onClick={() => context.deleteCartItem(item._id, product?._id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* -------- Bottom Section -------- */}
      <div className="!mt-auto">
        {/* PRICE SUMMARY */}
        <div className="bottomInfo !py-3 !px-7 w-full border-t border-[rgba(0,0,0,0.1)] flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
            <span className="text-[#ff5252] font-bold">₹{subtotal}</span>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Shipping</span>
            <span className="text-[#ff5252] font-bold">Free</span>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">Tax</span>
            <span className="text-[#ff5252] font-bold">₹{tax}</span>
          </div>
        </div>

        {/* TOTAL */}
        <div className="bottomInfo !py-3 !px-7 w-full border flex items-center justify-between">
          <span className="text-[14px] font-[600]">Total</span>
          <span className="text-[#ff5252] font-bold">₹{total}</span>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-between w-full !px-8 gap-4 !mt-4">
          {/* VIEW CART */}
          <Link
            to="/cart"
            className="w-[50%]"
            onClick={context.toggleCartPanel(false)}
          >
            <Button className="btn-org btn-lg w-full !text-[14px]">
              View Cart
            </Button>
          </Link>

          {/* CHECKOUT */}
          <div className="w-[50%]">
            <Button
              disabled={items.length === 0}
              className={`btn-org btn-border btn-lg w-full !text-[14px] ${
                items.length === 0 ? "!opacity-40 !cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (items.length > 0) {
                  context.setOpenCartPanel(false);
                  navigate("/checkout");
                }
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
