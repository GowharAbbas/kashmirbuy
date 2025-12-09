import React, { useMemo, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import QtyBox from "../QtyBox";
import Rating from "@mui/material/Rating";
import { useContext } from "react";
import { MyContext } from "../../App";

const ProductDetailRight = ({ product }) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);

  const context = useContext(MyContext);

  const {
    name,
    brand,
    price,
    oldPrice,
    discount,
    countInStock,
    rating,
    description,
    size,
  } = product || {};

  const sizes = useMemo(() => {
    if (!size) return [];
    if (Array.isArray(size)) return size;
    // if string like "S,M,L,XL"
    if (typeof size === "string") {
      return size
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [size]);

  const finalRating = rating || 4;
  const inStock = countInStock > 0;

  // calculate discount % if not provided
  const discountPercent = useMemo(() => {
    //if (discount) return discount;
    if (oldPrice && price && oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return null;
  }, [discount, oldPrice, price]);

  // new
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
      <h1 className="text-[18px] md:text-[22px] lg:text-[24px] font-[600] !mb-2 md:!mb-3 leading-snug">
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
          <Rating
            name="size-small"
            value={finalRating}
            precision={0.5}
            size="small"
            readOnly
          />
          <span className="text-[12px] text-gray-500">
            ({finalRating.toFixed ? finalRating.toFixed(1) : finalRating})
          </span>
        </div>

        {/* <span className="text-[13px] cursor-pointer text-gray-400">
          Reviews (5)
        </span> */}
      </div>

      {/* PRICE + STOCK */}
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

        {/* <span className="text-[12px] md:text-[13px] ml-1 text-gray-600">
          {inStock ? (
            <>
              In Stock:{" "}
              <span className="text-[13px] font-bold text-green-600">
                {countInStock} items
              </span>
            </>
          ) : (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          )}
        </span> */}
      </div>

      {/* SIZE NOTE (ADDED HERE) */}
      <div className="bg-orange-50 border-l-4 border-orange-400 !mt-2 !px-3 !py-2 rounded-md !mb-3">
        <p className="text-[13px] md:text-[14px] font-semibold text-orange-700">
          📌 Product Size Details:
          <span className="font-normal text-orange-600 !ml-1">
            All product sizes are clearly mentioned in the Product Name and
            Product Description. Please review them carefully before placing
            your order.
          </span>
        </p>
      </div>

      {/* SHORT DESCRIPTION */}
      {/* <p className="text-gray-600 text-[13px] md:text-[14px] !mt-4 !mb-4 md:!mb-5 leading-relaxed">
        {description ||
          "No description available. Please check back later or contact support for more details about this product."}
      </p> */}

      {/* SIZE OPTIONS */}
      {/* {sizes.length > 0 && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <span className="text-[14px] md:text-[15px] font-medium">Size:</span>
          <div className="flex items-center flex-wrap gap-2">
            {sizes.map((sz, idx) => (
              <Button
                key={idx}
                className={`!min-w-[38px] !h-[34px] !px-2 !py-1 !text-[13px] border ${
                  selectedSizeIndex === idx
                    ? "!bg-[#ff5252] !text-white border-[#ff5252]"
                    : "bg-white border-gray-300"
                }`}
                onClick={() => setSelectedSizeIndex(idx)}
              >
                {sz}
              </Button>
            ))}
          </div>
        </div>
      )} */}

      {/* SHIPPING INFO */}
      <p className="text-[12px] md:text-[13px] !mt-4 !mb-4 text-gray-600">
        Estimated delivery in{" "}
        <span className="font-semibold text-gray-800">2-3 days.</span>
      </p>

      {/* QTY + ADD TO CART */}
      <div className="flex items-center flex-wrap gap-3 md:gap-4 !mt-4">
        {/* <div className="qtyBoxWrapper w-[72px]">
          <QtyBox />
        </div> */}

        {/* <Button
          className="btn-org flex gap-2 !mt-1 !text-sm md:!text-base disabled:opacity-60"
          disabled={!inStock}
        >
          <MdOutlineShoppingCart className="text-[18px] md:text-[20px]" />{" "}
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button> */}

        <Button
          className="btn-org flex gap-2 !mt-1 !text-sm md:!text-base disabled:opacity-60"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          <MdOutlineShoppingCart className="text-[18px] md:text-[20px]" />{" "}
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>

      {/* WISHLIST + COMPARE */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-0">
        {/* <span className="flex items-center gap-1 text-[13px] md:text-[14px] link cursor-pointer font-[500]">
          <FaRegHeart className="text-[16px] md:text-[18px]" /> Add to Wishlist
        </span> */}

        {/* <span className="flex items-center gap-1 text-[13px] md:text-[14px] link cursor-pointer font-[500]">
          <IoGitCompareOutline className="text-[16px] md:text-[18px]" /> Add to
          Compare
        </span> */}
      </div>
    </>
  );
};

export default ProductDetailRight;
