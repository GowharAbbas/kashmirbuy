import React, { useState, useEffect, useContext } from "react";
import AccountSideBar from "../../components/AccountSidebar";
import { Button } from "@mui/material";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import Badge from "../../components/Badge";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";

const Orders = () => {
  const [openCard, setOpenCard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const context = useContext(MyContext);

  const toggleCard = (index) =>
    setOpenCard((prev) => (prev === index ? null : index));

  const loadOrders = async () => {
    const res = await fetchDataFromApi("/api/order/my");
    if (res?.success) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  // ✅ OPTION 1: DELAY FETCH BY 2 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
      context.loadCartItems();
    }, 2000); // wait for webhook to update order

    return () => clearTimeout(timer);
  }, []);

  // 🔴 RETURN REQUEST HANDLER
  const handleReturn = async (orderId, productId) => {
    const confirm = window.confirm("Do you want to request return?");
    if (!confirm) return;

    const res = await postData("/api/order/request-return", {
      orderId,
      productId,
    });

    if (res?.success) {
      context.openAlertBox("success", res.message);
      loadOrders();
    } else {
      context.openAlertBox("error", res.message);
    }
  };

  return (
    <section className="!py-14 w-full bg-[#f5f5f5]">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[25%]">
          <AccountSideBar />
        </div>

        <div className="w-full lg:w-[75%]">
          <div className="shadow-md rounded-md bg-white !p-4">
            <h2 className="text-[18px] font-semibold">My Orders</h2>

            {/* ✅ LOADING STATE */}
            {loading && (
              <p className="text-center text-gray-500 !mt-6">
                Processing your payment, please wait...
              </p>
            )}

            {/* MOBILE VIEW */}
            <div className="block lg:hidden !mt-5 !space-y-4">
              {!loading &&
                orders.map((order, index) => (
                  <div key={order._id} className="border rounded-xl !p-4">
                    <button
                      onClick={() => toggleCard(index)}
                      className="w-full bg-gray-100 !py-2 rounded-md"
                    >
                      {openCard === index ? "Hide Items" : "View Items"}
                    </button>

                    {openCard === index &&
                      order.products.map((p, i) => (
                        <div
                          key={i}
                          className="flex gap-3 !mt-3 border !p-2 rounded-md"
                        >
                          <img
                            src={p.image?.[0]}
                            className="w-[50px] h-[50px] rounded-md"
                          />

                          <div className="flex-1">
                            <p>{p.name}</p>
                            <p>Qty: {p.qty}</p>

                            {!p.returnRequested ? (
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() =>
                                  handleReturn(order._id, p.productId)
                                }
                              >
                                Request Return
                              </Button>
                            ) : (
                              <span className="text-xs text-orange-600">
                                Return Requested
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}

              {!loading && orders.length === 0 && (
                <p className="text-center text-gray-500 !mt-6">
                  No orders found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;

// import React, { useState, useEffect, useContext } from "react";
// import AccountSideBar from "../../components/AccountSidebar";
// import { Button } from "@mui/material";
// import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
// import Badge from "../../components/Badge";
// import { MyContext } from "../../App";
// import { fetchDataFromApi } from "../../utils/api";

// const Orders = () => {
//   const [openCard, setOpenCard] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const context = useContext(MyContext);

//   const toggleCard = (index) =>
//     setOpenCard((prev) => (prev === index ? null : index));

//   const loadOrders = async () => {
//     try {
//       const res = await fetchDataFromApi("/api/order/my");

//       if (res?.success) {
//         setOrders(res.data);
//       } else {
//         context.openAlertBox("error", "Failed to load orders");
//       }
//     } catch (err) {
//       console.log(err);
//       context.openAlertBox("error", "Something went wrong");
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   return (
//     <section className="!py-14 w-full bg-[#f5f5f5]">
//       <div className="container flex flex-col lg:flex-row gap-5">
//         <div className="w-full lg:w-[25%]">
//           <AccountSideBar />
//         </div>

//         <div className="w-full lg:w-[75%]">
//           <div className="shadow-md rounded-md bg-white !p-4">
//             <h2 className="text-[18px] font-semibold">My Orders</h2>

//             <p className="text-[14px] text-gray-700">
//               Total Orders:{" "}
//               <span className="font-bold text-[#ff5252]">{orders.length}</span>
//             </p>

//             {/* MOBILE VIEW */}
//             <div className="block lg:hidden !mt-5 !space-y-4">
//               {orders.map((order, index) => (
//                 <div
//                   key={order._id}
//                   className="bg-white border shadow-sm rounded-xl !p-4"
//                 >
//                   <div className="flex items-center justify-between">
//                     <p className="font-bold text-[15px]">
//                       Order #{order._id.slice(0, 8)}
//                     </p>
//                     <Badge status="paid" />
//                   </div>

//                   <p className="text-[14px] font-semibold !mt-1">
//                     ₹{order.totalAmount}
//                   </p>
//                   <p className="text-[13px] text-gray-600 !mt-1">
//                     📅 {new Date(order.createdAt).toLocaleDateString()}
//                   </p>

//                   <p className="text-[13px] text-gray-700 !mt-1">
//                     <strong>{order?.delivery_address?.fullName}</strong> —{" "}
//                     {order?.delivery_address?.mobile}
//                   </p>

//                   <p className="text-[13px] text-gray-600 !mt-1">
//                     📍 {order?.delivery_address?.address_line},{" "}
//                     {order?.delivery_address?.city},{" "}
//                     {order?.delivery_address?.state} -{" "}
//                     {order?.delivery_address?.pincode}
//                   </p>

//                   <button
//                     onClick={() => toggleCard(index)}
//                     className="w-full !mt-3 !py-2 bg-gray-100 rounded-lg flex items-center justify-center gap-2 text-[13px] font-medium"
//                   >
//                     {openCard === index ? (
//                       <>
//                         Hide Items <FaAngleUp />
//                       </>
//                     ) : (
//                       <>
//                         View Items <FaAngleDown />
//                       </>
//                     )}
//                   </button>

//                   {openCard === index && (
//                     <div className="!mt-3 !space-y-3">
//                       {order.products.map((p, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center gap-3 border !p-2 rounded-md bg-gray-50"
//                         >
//                           <img
//                             src={p.image?.[0]}
//                             className="w-[50px] h-[50px] rounded-md object-cover"
//                           />

//                           <div className="flex-1">
//                             <p className="text-[13px] font-semibold">
//                               {p.name}
//                             </p>
//                             <p className="text-[12px] text-gray-600">
//                               Qty: {p.qty}
//                             </p>
//                           </div>

//                           <p className="text-[13px] font-semibold">
//                             ₹{p.price * p.qty}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* DESKTOP VIEW */}
//             <div className="hidden lg:block !mt-5">
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-left text-gray-500">
//                   <thead className="uppercase bg-gray-500 text-white text-xs">
//                     <tr>
//                       <th className="!px-6 !py-3"></th>
//                       <th className="!px-6 !py-3">Order Id</th>
//                       <th className="!px-6 !py-3">Payment Id</th>
//                       <th className="!px-6 !py-3">Total</th>
//                       <th className="!px-6 !py-3">Status</th>
//                       <th className="!px-6 !py-3">Date</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {orders.map((order, index) => (
//                       <>
//                         <tr key={order._id} className="bg-white border-b">
//                           <td className="!px-6 !py-4">
//                             <Button
//                               className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full bg-[#f1f1f1]"
//                               onClick={() => toggleCard(index)}
//                             >
//                               {openCard === index ? (
//                                 <FaAngleUp />
//                               ) : (
//                                 <FaAngleDown />
//                               )}
//                             </Button>
//                           </td>

//                           <td className="!px-6 !py-4">{order._id}</td>
//                           <td className="!px-6 !py-4">
//                             {order.razorpay_payment_id}
//                           </td>
//                           <td className="!px-6 !py-4">₹{order.totalAmount}</td>
//                           <td className="!px-6 !py-4">
//                             <Badge status="paid" />
//                           </td>
//                           <td className="!px-6 !py-4">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </td>
//                         </tr>

//                         {openCard === index && (
//                           <tr>
//                             <td colSpan="12" className="!px-10 !py-3">
//                               <div className="border rounded-md !p-3">
//                                 {order.products.map((p, i) => (
//                                   <div
//                                     key={i}
//                                     className="flex gap-3 !mb-3 border !p-2 rounded-md"
//                                   >
//                                     <img
//                                       src={p.image?.[0]}
//                                       className="w-[50px] h-[50px] rounded-md object-cover"
//                                     />

//                                     <div className="flex-1">
//                                       <p className="font-semibold">{p.name}</p>
//                                       <p>Qty: {p.qty}</p>
//                                     </div>

//                                     <p className="font-semibold">
//                                       ₹{p.price * p.qty}
//                                     </p>
//                                   </div>
//                                 ))}
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Orders;
