import React from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { useContext } from "react";
import { MyContext } from "../../App";

const ProductDetailRight = ({ product }) => {
  const context = useContext(MyContext);

  const { name, brand, price, oldPrice, discount, rating } = product || {};

  const finalRating = rating || 4;
  const inStock = true; // frontend-controlled (no stock system)

  // calculate discount %
  const discountPercent =
    oldPrice && price && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  const handleAddToCart = () => {
    if (!context.isLogin) {
      context.openAlertBox("error", "Please login to add product to cart");
      return;
    }

    if (!product?._id) {
      context.openAlertBox("error", "Product not found");
      return;
    }

    context.addToCart(product._id);
  };

  return (
    <>
      {/* PRODUCT TITLE */}
      <h1 className="text-[18px] md:text-[22px] lg:text-[24px] font-[600] !mb-2 md:!mb-3">
        {name || "Product Name"}
      </h1>

      {/* BRAND + RATING */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {brand && (
          <span className="text-gray-500 text-[13px] md:text-[14px]">
            Brand:{" "}
            <span className="font-[500] text-black opacity-75">{brand}</span>
          </span>
        )}

        <div className="flex items-center gap-1">
          <Rating value={finalRating} precision={0.5} size="small" readOnly />
          <span className="text-[12px] text-gray-500">
            ({finalRating.toFixed(1)})
          </span>
        </div>
      </div>

      {/* PRICE */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 !mt-4">
        {oldPrice && (
          <span className="line-through text-gray-500 text-[16px] md:text-[18px] font-[500]">
            ₹{oldPrice}
          </span>
        )}

        {price && (
          <span className="text-[#ff5252] text-[18px] md:text-[22px] font-[700]">
            ₹{price}
          </span>
        )}

        {discountPercent && (
          <span className="text-[12px] md:text-[13px] font-semibold text-green-600 bg-green-50 px-2 py-[2px] rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* SIZE NOTE */}
      <div className="bg-orange-50 border-l-4 border-orange-400 !mt-3 !px-3 !py-2 rounded-md">
        <p className="text-[13px] md:text-[14px] font-semibold text-orange-700">
          📌 Product Size and Quantity:
          <span className="font-normal text-orange-600 !ml-1">
            Size details are included in the product name. Quantity can be
            updated from View Cart.
          </span>
        </p>
      </div>

      {/* SHIPPING INFO */}
      <p className="text-[12px] md:text-[13px] !mt-4 !mb-4 text-gray-600">
        Estimated delivery in{" "}
        <span className="font-semibold text-gray-800">2–3 days</span>.
      </p>

      {/* ADD TO CART */}
      <div className="flex items-center gap-3 !mt-4">
        <Button
          className="btn-org flex gap-2 !text-sm md:!text-base"
          onClick={handleAddToCart}
        >
          <MdOutlineShoppingCart className="text-[18px] md:text-[20px]" />
          Add to Cart
        </Button>
      </div>
    </>
  );
};

export default ProductDetailRight;
