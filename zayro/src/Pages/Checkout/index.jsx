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

  const subtotal = items.reduce((acc, item) => {
    const price = item?.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.0);
  const shipping = items.length === 0 ? 0 : subtotal < 1500 ? 25 : 0;
  const totalAmount = Math.max(subtotal + tax + shipping, 1);

  const onChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (items.length === 0) {
      context.openAlertBox("error", "Your cart is empty");
      return;
    }

    for (const key in address) {
      if (!address[key]) {
        context.openAlertBox("error", `Please enter ${key}`);
        return;
      }
    }

    // 1️⃣ Create Razorpay order
    const orderRes = await postData("/api/payment/create-order", {
      amount: totalAmount,
    });

    if (!orderRes?.success) {
      context.openAlertBox("error", "Payment creation failed");
      return;
    }

    const order = orderRes.data;

    // 2️⃣ Create pending order in DB
    await postData("/api/order/create", {
      razorpay_order_id: order.id,
      products: items,
      subTotal: subtotal,
      tax,
      totalAmount,
      delivery_address: address,
    });

    // 3️⃣ Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "KashmirBuy",
      description: "Order Payment",
      order_id: order.id,

      // ✅ PAYMENT SUCCESS
      handler: async function (response) {
        const verifyRes = await postData("/api/order/verify-payment", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes?.success) {
          context.openAlertBox("success", "Payment successful!");
          navigate("/my-orders");
        } else {
          context.openAlertBox("error", "Payment verification failed");
        }
      },

      theme: { color: "#ff5252" },
    };

    // 🔥 STEP 4 — PAYMENT FAILED HANDLER (THIS WAS MISSING)
    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", async function () {
      // tell backend to delete pending order
      await postData("/api/order/payment-failed", {
        razorpay_order_id: options.order_id,
      });

      context.openAlertBox("error", "Payment failed. Order was not placed.");
    });

    rzp.open();
  };

  return (
    <section className="!py-10 bg-[#f5f5f5] !mt-5">
      <div className="container flex flex-col lg:flex-row gap-4">
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

            <hr className="!my-3" />

            <div className="flex justify-between text-sm !mb-2">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>

            <hr className="!my-2" />

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

//   // -------------------------------
//   // CALCULATIONS (WITH TEST DISCOUNT)
//   // -------------------------------
//   const subtotal = items.reduce((acc, item) => {
//     const price = item?.productId?.price || 0;
//     return acc + price * item.quantity;
//   }, 0);

//   const tax = Math.round(subtotal * 0.02);
//   const shipping = items.length === 0 ? 0 : subtotal < 1500 ? 35 : 0;

//   // 🔴 TEMPORARY FIXED DISCOUNT FOR TESTING
//   //const discount = 40;

//   // Razorpay minimum ₹1
//   const totalAmount = Math.max(subtotal + tax + shipping, 1);

//   // -------------------------------
//   // HANDLERS
//   // -------------------------------
//   const onChange = (e) => {
//     setAddress({ ...address, [e.target.name]: e.target.value });
//   };

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

//     // 2️⃣ Create pending order in DB
//     await postData("/api/order/create", {
//       razorpay_order_id: order.id,
//       products: items,
//       subTotal: subtotal,
//       tax,
//       totalAmount,
//       delivery_address: address,
//     });

//     // 3️⃣ Razorpay options
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: "INR",
//       name: "KashmirBuy",
//       description: "Order Payment",
//       order_id: order.id,

//       // 🔥 IMPORTANT PART (STEP 1)
//       handler: async function (response) {
//         const verifyRes = await postData("/api/order/verify-payment", {
//           razorpay_order_id: response.razorpay_order_id,
//           razorpay_payment_id: response.razorpay_payment_id,
//           razorpay_signature: response.razorpay_signature,
//         });

//         if (verifyRes?.success) {
//           context.openAlertBox("success", "Payment successful!");
//           navigate("/my-orders");
//         } else {
//           context.openAlertBox("error", "Payment verification failed");
//         }
//       },

//       theme: { color: "#ff5252" },
//     };

//     new window.Razorpay(options).open();
//   };

//   // -------------------------------
//   // UI
//   // -------------------------------
//   return (
//     <section className="!py-10 bg-[#f5f5f5] !mt-5">
//       <div className="container flex flex-col lg:flex-row gap-4">
//         {/* LEFT */}
//         <div className="w-full lg:w-[70%]">
//           <div className="bg-white shadow-md rounded-md !p-5">
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
//           <div className="bg-white shadow-md rounded-md !p-5">
//             <h2 className="!mb-4 font-semibold">Your Order</h2>

//             <div className="max-h-[214px] overflow-y-auto !mb-4">
//               {items.map((item) => (
//                 <div key={item._id} className="flex justify-between !py-2">
//                   <span>
//                     {item.productId?.name} × {item.quantity}
//                   </span>
//                   <span>₹{item.productId?.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between text-sm !mb-2">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>

//             <div className="flex justify-between text-sm !mb-2">
//               <span>Shipping</span>
//               <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
//             </div>

//             <div className="flex justify-between text-sm !mb-2">
//               <span>Tax</span>
//               <span>₹{tax}</span>
//             </div>

//             {/* <div className="flex justify-between text-sm !mb-2 text-green-600">
//               <span>Test Discount</span>
//               <span>- ₹{discount}</span>
//             </div> */}

//             <hr className="!my-3" />

//             <div className="flex justify-between font-bold !mb-4">
//               <span>Total</span>
//               <span className="text-green-600">₹{totalAmount}</span>
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
