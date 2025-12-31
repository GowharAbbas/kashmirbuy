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
                Processing your Order, please wait...
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
