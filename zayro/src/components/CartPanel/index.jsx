import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";

const CartPanel = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const items = context.cartItems || [];

  const subtotal = items.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.0);

  // ✅ FIX HERE
  const shipping = items.length === 0 ? 0 : subtotal < 1500 ? 10 : 0;

  const total = subtotal + tax + shipping;

  return (
    <div className="flex flex-col h-full max-h-[100vh]">
      {/* ITEMS */}
      <div className="flex-1 overflow-y-auto !p-4">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        )}

        {items.map((item) => {
          const product = item.productId || {};

          return (
            <div key={item._id} className="flex gap-4 border-b !py-4">
              <img
                src={product?.images?.[0]}
                alt={product?.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-sm font-medium leading-5 !pr-2">
                    {product.name}
                  </h4>

                  <MdDeleteOutline
                    className="text-xl cursor-pointer shrink-0 text-gray-600 hover:text-red-500"
                    onClick={() =>
                      context.deleteCartItem(item._id, product._id)
                    }
                  />
                </div>

                <p className="text-sm !mt-1">
                  Qty: {item.quantity} × ₹{product.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* FIXED BOTTOM */}
      <div className="border-t !p-4 !mt-auto">
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

        <div className="flex justify-between font-bold !mb-4">
          <span>Total</span>
          <span className="text-[#ff5252]">₹{total}</span>
        </div>

        <div className="flex gap-3">
          <Button
            className="btn-org w-1/2"
            onClick={() => {
              context.setOpenCartPanel(false);
              navigate("/cart");
            }}
          >
            View Cart
          </Button>

          <Button
            className="btn-org btn-border w-1/2"
            disabled={items.length === 0}
            onClick={() => {
              context.setOpenCartPanel(false);
              navigate("/checkout");
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;

// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MdDeleteOutline } from "react-icons/md";
// import Button from "@mui/material/Button";
// import { MyContext } from "../../App";

// const CartPanel = () => {
//   const context = useContext(MyContext);
//   const navigate = useNavigate();
//   const items = context.cartItems || [];

//   const subtotal = items.reduce((acc, item) => {
//     const price = item?.productId?.price || 0;
//     return acc + price * item.quantity;
//   }, 0);

//   const tax = Math.round(subtotal * 0.02);
//   const shipping = subtotal < 1500 ? 35 : 0;
//   const total = subtotal + tax + shipping;

//   return (
//     <div className="flex flex-col h-full max-h-[100vh]">
//       {/* ITEMS */}
//       <div className="flex-1 overflow-y-auto !p-4">
//         {items.length === 0 && (
//           <p className="text-sm text-gray-500">Your cart is empty.</p>
//         )}

//         {items.map((item) => {
//           const product = item.productId || {};
//           return (
//             <div key={item._id} className="flex gap-4 border-b !py-4">
//               <img
//                 src={product?.images?.[0]}
//                 className="w-20 h-20 object-cover rounded"
//               />

//               <div className="flex-1 relative">
//                 <h4 className="text-sm font-medium">{product.name}</h4>
//                 <p className="text-sm !mt-1">
//                   Qty: {item.quantity} × ₹{product.price}
//                 </p>

//                 <MdDeleteOutline
//                   className="absolute top-0 right-0 text-xl cursor-pointer"
//                   onClick={() => context.deleteCartItem(item._id, product._id)}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* FIXED BOTTOM */}
//       <div className="border-t !p-4 !mt-auto">
//         <div className="flex justify-between text-sm !mb-2">
//           <span>Subtotal</span>
//           <span>₹{subtotal}</span>
//         </div>

//         <div className="flex justify-between text-sm !mb-2">
//           <span>Shipping</span>
//           <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//         </div>

//         <div className="flex justify-between text-sm !mb-2">
//           <span>Tax</span>
//           <span>₹{tax}</span>
//         </div>

//         <div className="flex justify-between font-bold !mb-4">
//           <span>Total</span>
//           <span className="text-[#ff5252]">₹{total}</span>
//         </div>

//         <div className="flex gap-3">
//           {/* VIEW CART */}
//           <Button
//             className="btn-org w-1/2"
//             onClick={() => {
//               context.setOpenCartPanel(false);
//               navigate("/cart");
//             }}
//           >
//             View Cart
//           </Button>

//           {/* CHECKOUT */}
//           <Button
//             className="btn-org btn-border w-1/2"
//             disabled={items.length === 0}
//             onClick={() => {
//               context.setOpenCartPanel(false);
//               navigate("/checkout");
//             }}
//           >
//             Checkout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPanel;
