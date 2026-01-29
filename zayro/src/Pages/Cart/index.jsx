import React, { useContext } from "react";
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

  const tax = Math.round(subtotal * 0.0);

  // ✅ FIX: shipping should be 0 if cart is empty
  const shipping = items.length === 0 ? 0 : subtotal < 1500 ? 10 : 0;

  const total = subtotal + tax + shipping;

  return (
    <section className="section !py-12 bg-[#f5f5f5]">
      <div className="container w-full max-w-[1200px] mx-auto flex flex-col md:flex-row gap-5 !px-3">
        {/* LEFT */}
        <div className="w-full md:w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-3 !px-3 border-b">
              <h2 className="text-[18px] font-semibold">Your Cart</h2>
              <p className="text-[14px]">
                There {items.length === 1 ? "is" : "are"} <b>{items.length}</b>{" "}
                product
                {items.length !== 1 ? "s" : ""} in your cart
              </p>
            </div>

            {items.length === 0 ? (
              <p className="!p-4 text-gray-500">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <CartItems key={item._id} data={item} qty={item.quantity} />
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-[30%]">
          <div className="shadow-md rounded-md bg-white !p-5 sticky top-24">
            <h3 className="text-[18px] font-semibold !mb-3">Cart Totals</h3>

            <div className="flex justify-between text-sm !mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-sm !mb-2">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>

            <div className="flex justify-between text-sm !mb-2">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>

            <hr className="!my-2" />

            <div className="flex justify-between font-bold !mb-4">
              <span>Total</span>
              <span className="text-green-600">₹{total}</span>
            </div>

            <Button
              disabled={items.length === 0}
              className="btn-org btn-lg w-full flex gap-2"
              onClick={() => (window.location.href = "/checkout")}
            >
              <BsFillBagCheckFill />
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;

// import React, { useContext } from "react";
// import Button from "@mui/material/Button";
// import { BsFillBagCheckFill } from "react-icons/bs";
// import CartItems from "./cartItems";
// import { MyContext } from "../../App";

// const CartPage = () => {
//   const context = useContext(MyContext);
//   const items = context.cartItems || [];

//   const subtotal = items.reduce((acc, item) => {
//     const price = item?.productId?.price || 0;
//     return acc + price * item.quantity;
//   }, 0);

//   const tax = Math.round(subtotal * 0.02);
//   const shipping = subtotal < 1500 ? 35 : 0;
//   const total = subtotal + tax + shipping;

//   return (
//     <section className="section !py-12 bg-[#f5f5f5]">
//       <div className="container w-full max-w-[1200px] mx-auto flex flex-col md:flex-row gap-5 !px-3">
//         {/* LEFT */}
//         <div className="w-full md:w-[70%]">
//           <div className="shadow-md rounded-md bg-white">
//             <div className="!py-3 !px-3 border-b">
//               <h2 className="text-[18px] font-semibold">Your Cart</h2>
//               <p className="text-[14px]">
//                 There {items.length === 1 ? "is" : "are"} <b>{items.length}</b>{" "}
//                 product
//                 {items.length !== 1 ? "s" : ""} in your cart
//               </p>
//             </div>

//             {items.length === 0 ? (
//               <p className="!p-4 text-gray-500">Your cart is empty.</p>
//             ) : (
//               items.map((item) => (
//                 <CartItems key={item._id} data={item} qty={item.quantity} />
//               ))
//             )}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="w-full md:w-[30%]">
//           <div className="shadow-md rounded-md bg-white !p-5 sticky top-24">
//             <h3 className="text-[18px] font-semibold !mb-3">Cart Totals</h3>

//             <div className="flex justify-between text-sm !mb-2">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>

//             <div className="flex justify-between text-sm !mb-2">
//               <span>Shipping</span>
//               <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//             </div>

//             <div className="flex justify-between text-sm mb-2">
//               <span>Tax</span>
//               <span>₹{tax}</span>
//             </div>

//             <hr className="!my-2" />

//             <div className="flex justify-between font-bold !mb-4">
//               <span>Total</span>
//               <span className="text-green-600">₹{total}</span>
//             </div>

//             <Button
//               disabled={items.length === 0}
//               className="btn-org btn-lg w-full flex gap-2"
//               onClick={() => (window.location.href = "/checkout")}
//             >
//               <BsFillBagCheckFill />
//               Checkout
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CartPage;
