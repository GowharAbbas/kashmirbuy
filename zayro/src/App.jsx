import React, { useEffect, useState, createContext } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductListing from "./Pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./Pages/ProductDetails";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductZoom from "./components/ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import ProductDetailRight from "./components/ProductDetailRight";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CartPage from "./Pages/Cart";
import Verify from "./Pages/Verify";

import toast, { Toaster } from "react-hot-toast";
import ForgotPassword from "./Pages/ForgotPassword";
import Checkout from "./Pages/Checkout";
import MyAccount from "./Pages/MyAccount";
import MyList from "./Pages/MyList";
import Orders from "./Pages/Orders";

import { fetchDataFromApi, postData, editData, deleteCart } from "./utils/api";

import ChangePassword from "./Pages/ChangePassword";
import AddAddress from "./Pages/AddAddress";
import MyProfile from "./Pages/MyAccount";

const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  const [cartItems, setCartItems] = useState([]);

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  // ---------------- CART FUNCTIONS ----------------

  const loadCartItems = async () => {
    try {
      const res = await fetchDataFromApi("/api/cart/get");
      if (res?.success === true) {
        setCartItems(res.data || []);
      }
    } catch (err) {
      console.log("loadCartItems error:", err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const res = await postData("/api/cart/add", { productId });

      if (res?.success === true) {
        openAlertBox("success", "Product added to cart");
        loadCartItems();
      } else {
        openAlertBox("error", res?.message || "Failed to add to cart");
      }
    } catch (err) {
      console.log("addToCart error:", err);
      openAlertBox("error", "Something went wrong");
    }
  };

  const updateCartQty = async (cartItemId, qty) => {
    try {
      const res = await editData("/api/cart/update-qty", {
        _id: cartItemId,
        qty,
      });

      if (res?.data?.success === true) {
        openAlertBox("success", "Quantity updated");
        loadCartItems();
      } else {
        openAlertBox("error", res?.data?.message || "Failed to update qty");
      }
    } catch (err) {
      console.log("updateCartQty error:", err);
      openAlertBox("error", "Something went wrong");
    }
  };

  const deleteCartItem = async (cartItemId, productId) => {
    try {
      const res = await deleteCart("/api/cart/delete-cart-item", {
        _id: cartItemId,
        productId,
      });

      if (res?.success === true) {
        openAlertBox("success", "Item removed from cart");
        loadCartItems();
      } else {
        openAlertBox("error", res?.message || "Failed to delete item");
      }
    } catch (err) {
      console.log("deleteCartItem error:", err);
      openAlertBox("error", "Something went wrong");
    }
  };

  // ---------------- AUTH + USER DETAILS ----------------

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);

      fetchDataFromApi("/api/user/user-details").then((res) => {
        setUserData(res.data);

        if (res?.response?.data?.error === true) {
          if (res?.response?.data?.message === "You have not login") {
            // 🔥 IMPORTANT: Clear all cache data
            localStorage.removeItem("selectedAddress");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            setCartItems([]); // clear cart UI
            setUserData(null);

            openAlertBox("error", "Your session expired, please login again");
            setIsLogin(false);
          }
        }
      });
    } else {
      setIsLogin(false);
      setUserData(null);
    }
  }, [isLogin]);

  // ------------ ⭐ IMPORTANT FIX: LOAD CART EARLY --------------

  useEffect(() => {
    if (isLogin) {
      loadCartItems(); // ensures your cart items load BEFORE UI opens
    } else {
      setCartItems([]);
    }
  }, [isLogin]);

  // ---------------- ALERT BOX ----------------

  const openAlertBox = (status, msg) => {
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  };

  const values = {
    setOpenProductDetailsModal,
    setSelectedProduct,
    selectedProduct,

    cartItems,
    addToCart,
    updateCartQty,
    deleteCartItem,
    loadCartItems,

    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,

    openAlertBox,
    isLogin,
    setIsLogin,

    userData,
    setUserData,
  };

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <MyContext.Provider value={values}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productListing" element={<ProductListing />} />
            <Route path="/search" element={<ProductListing />} />
            <Route path="product/:id" element={<ProductDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/my-account" element={<MyProfile />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/my-list" element={<MyList />} />
            <Route path="/my-orders" element={<Orders />} />

            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/add-address" element={<AddAddress />} />
          </Routes>

          <Footer />
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster />

      {/* PRODUCT DETAILS MODAL */}
      <Dialog
        open={openProductDetailsModal}
        fullWidth
        maxWidth="lg"
        onClose={() => setOpenProductDetailsModal(false)}
        className="productDetailsModal"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "12px" },
            width: "100%",
            height: { xs: "100vh", sm: "auto" },
          },
        }}
      >
        <DialogContent>
          <div className="w-full flex flex-col md:flex-row gap-6 relative !p-2">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !absolute !top-[-18px] !right-[-18px]"
              onClick={() => setOpenProductDetailsModal(false)}
            >
              <IoCloseSharp className="text-[18px]" />
            </Button>

            <div className="w-full md:w-[45%] flex justify-center">
              <ProductZoom images={selectedProduct?.images} />
            </div>

            <div className="w-full md:w-[55%] px-6 py-4">
              <ProductDetailRight product={selectedProduct} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
export { MyContext };
