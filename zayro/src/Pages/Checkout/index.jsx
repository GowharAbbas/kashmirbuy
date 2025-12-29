import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";

const Checkout = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const items = context.cartItems || [];

  // -------------------------------
  // CALCULATIONS (FIXED)
  // -------------------------------
  const subtotal = items.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.02);

  // ✅ SAME LOGIC AS CART PAGE
  const shipping = items.length === 0 ? 0 : subtotal < 1500 ? 35 : 0;

  const totalAmount = subtotal + tax + shipping;

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const onChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (items.length === 0) {
      context.openAlertBox("error", "Your cart is empty");
      return;
    }

    // Validate address
    for (const key in address) {
      if (!address[key]) {
        context.openAlertBox("error", `Please enter ${key}`);
        return;
      }
    }

    // 1️⃣ Create Razorpay order with FINAL AMOUNT
    const orderRes = await postData("/api/payment/create-order", {
      amount: totalAmount,
    });

    if (!orderRes?.success) {
      context.openAlertBox("error", "Payment creation failed");
      return;
    }

    const order = orderRes.data;

    // 2️⃣ Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "KashmirBuy",
      description: "Order Payment",
      order_id: order.id,

      handler: function () {
        context.openAlertBox("success", "Payment successful!");
        context.loadCartItems();
        navigate("/my-orders");
      },

      theme: { color: "#ff5252" },
    };

    new window.Razorpay(options).open();
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <section className="!py-10 bg-[#f5f5f5] !mt-5">
      <div className="container flex flex-col lg:flex-row gap-4">
        {/* LEFT */}
        <div className="w-full lg:w-[70%]">
          <div className="bg-white shadow-md rounded-md !p-5">
            <h1 className="text-[18px] font-semibold">Billing Details</h1>

            <form className="w-full !mt-5">
              <div className="flex flex-col sm:flex-row gap-5 !pb-5">
                <TextField
                  className="w-full"
                  label="Full Name"
                  name="fullName"
                  value={address.fullName}
                  onChange={onChange}
                  size="small"
                />
                <TextField
                  className="w-full"
                  label="Email"
                  name="email"
                  value={address.email}
                  onChange={onChange}
                  size="small"
                />
              </div>

              <TextField
                className="w-full !mb-3"
                label="House No. and Street Name"
                name="address_line"
                value={address.address_line}
                onChange={onChange}
                size="small"
              />

              <div className="flex flex-col sm:flex-row gap-5 !pb-5">
                <TextField
                  className="w-full"
                  label="Town / City"
                  name="city"
                  value={address.city}
                  onChange={onChange}
                  size="small"
                />
                <TextField
                  className="w-full"
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={onChange}
                  size="small"
                />
              </div>

              <TextField
                className="w-full !mb-3"
                label="PIN Code"
                name="pincode"
                value={address.pincode}
                onChange={onChange}
                size="small"
              />

              <TextField
                className="w-full !mb-3"
                label="Country"
                name="country"
                value={address.country}
                onChange={onChange}
                size="small"
              />

              <TextField
                className="w-full !mb-3"
                label="Phone Number"
                name="mobile"
                value={address.mobile}
                onChange={onChange}
                size="small"
              />
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[30%]">
          <div className="bg-white shadow-md rounded-md !p-5">
            <h2 className="!mb-4 font-semibold">Your Order</h2>

            <div className="max-h-[214px] overflow-y-auto !mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between !py-2">
                  <span>
                    {item.productId?.name} × {item.quantity}
                  </span>
                  <span>₹{item.productId?.price * item.quantity}</span>
                </div>
              ))}
            </div>

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

            <hr className="!my-3" />

            <div className="flex justify-between font-bold !mb-4">
              <span>Total</span>
              <span className="text-green-600">₹{totalAmount}</span>
            </div>

            <Button className="btn-org btn-lg w-full" onClick={handlePayment}>
              Complete Your Payment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;

// import React, { useContext, useState } from "react";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import { MyContext } from "../../App";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../utils/api";

// const Checkout = () => {
//   const context = useContext(MyContext);
//   const navigate = useNavigate();

//   const [address, setAddress] = useState({
//     fullName: "",
//     email: "",
//     address_line: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "",
//     mobile: "",
//   });

//   const items = context.cartItems || [];

//   const subtotal = items.reduce((acc, item) => {
//     const price = item?.productId?.price || 0;
//     return acc + price * item.quantity;
//   }, 0);

//   const tax = Math.round(subtotal * 0.02);
//   const shipping = 0;
//   const totalAmount = subtotal + tax + shipping;

//   const onChange = (e) => {
//     setAddress({ ...address, [e.target.name]: e.target.value });
//   };

//   // ----------------------------------------------------------------
//   // 🔥 HANDLE PAYMENT (WEBHOOK-BASED)
//   // ----------------------------------------------------------------
//   const handlePayment = async () => {
//     if (items.length === 0) {
//       context.openAlertBox("error", "Your cart is empty");
//       return;
//     }

//     // Validate address
//     for (const key in address) {
//       if (!address[key]) {
//         context.openAlertBox("error", `Please enter ${key}`);
//         return;
//       }
//     }

//     // 1️⃣ Create Razorpay order
//     const orderRes = await postData("/api/payment/create-order", {
//       amount: totalAmount,
//     });

//     if (!orderRes?.success) {
//       context.openAlertBox("error", "Payment creation failed");
//       return;
//     }

//     const order = orderRes.data;

//     // 2️⃣ Razorpay options
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: "INR",
//       name: "KashmirBuy",
//       description: "Order Payment",
//       order_id: order.id,

//       // ✅ NO ORDER CREATION HERE
//       handler: function () {
//         context.openAlertBox("success", "Payment successful!");
//         context.loadCartItems(); // optional
//         navigate("/my-orders");
//       },

//       theme: { color: "#ff5252" },
//     };

//     new window.Razorpay(options).open();
//   };

//   // ----------------------------------------------------------------
//   // UI
//   // ----------------------------------------------------------------
//   return (
//     <section className="!py-10 bg-[#f5f5f5] !mt-5">
//       <div className="container flex flex-col lg:flex-row gap-4">
//         {/* LEFT */}
//         <div className="w-full lg:w-[70%]">
//           <div className="card bg-white shadow-md rounded-md !p-5 w-full">
//             <h1 className="text-[18px] font-semibold">Billing Details</h1>

//             <form className="w-full !mt-5">
//               <div className="flex flex-col sm:flex-row gap-5 !pb-5">
//                 <TextField
//                   className="w-full"
//                   label="Full Name"
//                   name="fullName"
//                   value={address.fullName}
//                   onChange={onChange}
//                   size="small"
//                 />
//                 <TextField
//                   className="w-full"
//                   label="Email"
//                   name="email"
//                   value={address.email}
//                   onChange={onChange}
//                   size="small"
//                 />
//               </div>

//               <TextField
//                 className="w-full !mb-3"
//                 label="House No. and Street Name"
//                 name="address_line"
//                 value={address.address_line}
//                 onChange={onChange}
//                 size="small"
//               />

//               <div className="flex flex-col sm:flex-row gap-5 !pb-5">
//                 <TextField
//                   className="w-full"
//                   label="Town / City"
//                   name="city"
//                   value={address.city}
//                   onChange={onChange}
//                   size="small"
//                 />
//                 <TextField
//                   className="w-full"
//                   label="State"
//                   name="state"
//                   value={address.state}
//                   onChange={onChange}
//                   size="small"
//                 />
//               </div>

//               <TextField
//                 className="w-full !mb-3"
//                 label="PIN Code"
//                 name="pincode"
//                 value={address.pincode}
//                 onChange={onChange}
//                 size="small"
//               />

//               <TextField
//                 className="w-full !mb-3"
//                 label="Country"
//                 name="country"
//                 value={address.country}
//                 onChange={onChange}
//                 size="small"
//               />

//               <TextField
//                 className="w-full !mb-3"
//                 label="Phone Number"
//                 name="mobile"
//                 value={address.mobile}
//                 onChange={onChange}
//                 size="small"
//               />
//             </form>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="w-full lg:w-[30%]">
//           <div className="card shadow-md bg-white !p-5 rounded-md">
//             <h2 className="!mb-4">Your Order</h2>

//             <div className="scroll max-h-[214px] overflow-y-scroll !pr-3 !mb-5">
//               {items.map((item) => (
//                 <div key={item._id} className="flex justify-between !py-2">
//                   <span>
//                     {item.productId?.name} × {item.quantity}
//                   </span>
//                   <span>₹{item.productId?.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between !mb-4">
//               <strong>Total</strong>
//               <strong className="text-green-500">₹{totalAmount}</strong>
//             </div>

//             <Button className="btn-org btn-lg w-full" onClick={handlePayment}>
//               Complete Your Payment
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Checkout;

// import React, { useContext, useState } from "react";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import { MyContext } from "../../App";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../utils/api";

// const Checkout = () => {
//   const context = useContext(MyContext);
//   const navigate = useNavigate();

//   const [address, setAddress] = useState({
//     fullName: "",
//     email: "",
//     address_line: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "",
//     mobile: "",
//   });

//   const items = context.cartItems || [];

//   const subtotal = items.reduce((acc, item) => {
//     const price = item?.productId?.price || 0;
//     return acc + price * item.quantity;
//   }, 0);

//   const tax = Math.round(subtotal * 0.02);
//   const shipping = 0;
//   const totalAmount = subtotal + tax + shipping;

//   const onChange = (e) => {
//     setAddress({ ...address, [e.target.name]: e.target.value });
//   };

//   // ----------------------------------------------------------------
//   // 🔥 HANDLE PAYMENT
//   // ----------------------------------------------------------------
//   const handlePayment = async () => {
//     if (items.length === 0) {
//       context.openAlertBox("error", "Your cart is empty");
//       return;
//     }

//     // Validate all fields
//     for (const key in address) {
//       if (!address[key]) {
//         context.openAlertBox("error", `Please enter ${key}`);
//         return;
//       }
//     }

//     // 1️⃣ Create Razorpay order
//     const orderRes = await postData("/api/payment/create-order", {
//       amount: totalAmount,
//     });

//     if (!orderRes?.success) {
//       context.openAlertBox("error", "Payment creation failed");
//       return;
//     }

//     const order = orderRes.data;

//     // 2️⃣ Razorpay options
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: "INR",
//       name: "KashmirBuy",
//       description: "Order Payment",
//       order_id: order.id,

//       handler: async function (response) {
//         const saveRes = await postData("/api/order/create", {
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_order_id: response.razorpay_order_id,
//           razorpay_signature: response.razorpay_signature,
//           products: items,
//           subTotal: subtotal,
//           tax,
//           totalAmount,
//           delivery_address: address, // ⭐ save direct checkout form data
//         });

//         if (saveRes?.success) {
//           context.openAlertBox("success", "Payment Success! Order Placed");
//           context.loadCartItems();
//           navigate("/my-orders");
//         } else {
//           context.openAlertBox(
//             "error",
//             "Payment success but order save failed"
//           );
//         }
//       },

//       theme: { color: "#ff5252" },
//     };

//     new window.Razorpay(options).open();
//   };

//   // ----------------------------------------------------------------
//   // UI
//   // ----------------------------------------------------------------

//   return (
//     <section className="!py-10 bg-[#f5f5f5] !mt-5">
//       <div className="container flex flex-col lg:flex-row gap-4">
//         {/* LEFT SIDE */}
//         <div className="w-full lg:w-[70%]">
//           <div className="card bg-white shadow-md rounded-md !p-5 w-full">
//             <h1 className="text-[18px] font-semibold">Billing Details</h1>

//             <form className="w-full !mt-5">
//               <div className="flex flex-col sm:flex-row gap-5 !pb-5">
//                 <TextField
//                   className="w-full"
//                   label="Full Name"
//                   name="fullName"
//                   value={address.fullName}
//                   onChange={onChange}
//                   size="small"
//                 />

//                 <TextField
//                   className="w-full"
//                   label="Email"
//                   name="email"
//                   value={address.email}
//                   onChange={onChange}
//                   size="small"
//                 />
//               </div>

//               <TextField
//                 className="w-full !mb-3"
//                 label="House No. and Street Name"
//                 name="address_line"
//                 value={address.address_line}
//                 onChange={onChange}
//                 size="small"
//               />

//               <div className="flex flex-col sm:flex-row gap-5 !pb-5">
//                 <TextField
//                   className="w-full"
//                   label="Town / City"
//                   name="city"
//                   value={address.city}
//                   onChange={onChange}
//                   size="small"
//                 />

//                 <TextField
//                   className="w-full"
//                   label="State"
//                   name="state"
//                   value={address.state}
//                   onChange={onChange}
//                   size="small"
//                 />
//               </div>

//               <TextField
//                 className="w-full !mb-3"
//                 label="PIN Code"
//                 name="pincode"
//                 value={address.pincode}
//                 onChange={onChange}
//                 size="small"
//               />

//               <TextField
//                 className="w-full !mb-3"
//                 label="Country"
//                 name="country"
//                 value={address.country}
//                 onChange={onChange}
//                 size="small"
//               />

//               <TextField
//                 className="w-full !mb-3"
//                 label="Phone Number"
//                 name="mobile"
//                 value={address.mobile}
//                 onChange={onChange}
//                 size="small"
//               />
//             </form>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="w-full lg:w-[30%]">
//           <div className="card shadow-md bg-white !p-5 rounded-md sticky top-35">
//             <h2 className="!mb-4">Your Order</h2>

//             <div className="flex items-center justify-between !py-3 border-t border-b">
//               <span className="text-[14px] font-[600]">Product</span>
//               <span className="text-[14px] font-[600]">Subtotal</span>
//             </div>

//             <div className="scroll max-h-[214px] overflow-y-scroll !pr-3 !mb-5">
//               {items.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex items-center justify-between !py-2"
//                 >
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={item.productId?.images?.[0]}
//                       className="w-[50px] h-[50px] rounded-md"
//                     />
//                     <div>
//                       <h5 className="text-[13px]">{item.productId?.name}</h5>
//                       <span className="text-[12px]">Qty : {item.quantity}</span>
//                     </div>
//                   </div>
//                   <span className="text-[14px] font-[500]">
//                     ₹{item.productId?.price * item.quantity}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex items-center justify-between !py-3 border-t border-b !mb-4 !px-3">
//               <span className="text-[15px] font-[500]">Total</span>
//               <span className="text-[15px] font-[600] text-green-500">
//                 ₹{totalAmount}
//               </span>
//             </div>

//             <Button
//               className="btn-org btn-lg !text-[13px] font-[600] w-full"
//               onClick={handlePayment}
//             >
//               Complete Your Payment
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Checkout;
