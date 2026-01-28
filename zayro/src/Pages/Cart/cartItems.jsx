import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GoTriangleDown } from "react-icons/go";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";

const CartItems = (props) => {
  const context = useContext(MyContext);
  const { data } = props;

  const product = data?.productId || {};
  const cartItemId = data?._id;

  const [sizeAnchor, setSizeAnchor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(props.size || "M");
  const openSize = Boolean(sizeAnchor);

  const [qtyAnchor, setQtyAnchor] = useState(null);
  const [selectedQty, setSelectedQty] = useState(props.qty);
  const openQty = Boolean(qtyAnchor);

  return (
    <div className="cartItem w-full !p-3 flex flex-col sm:flex-row sm:items-center gap-4 !pb-2 border-b border-[rgba(0,0,0,0.1)]">
      {/* IMAGE */}
      <div className="img w-full sm:w-[12%] max-w-[110px] rounded-md overflow-hidden">
        <Link to={`/product/${product?._id}`} className="group">
          <img
            src={
              product?.images?.[0] ||
              "https://via.placeholder.com/150x200?text=No+Image"
            }
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      {/* INFO */}
      <div className="info w-full sm:w-[88%] relative">
        {/* DELETE */}
        <IoCloseSharp
          className="cursor-pointer absolute top-1 right-1 text-[22px] hover:text-red-500 transition-all"
          onClick={() => context.deleteCartItem(cartItemId, product?._id)}
        />

        {/* BRAND */}
        <span className="text-[12px] cursor-pointer opacity-60">
          {product?.brand || "Brand"}
        </span>

        {/* TITLE */}
        <h3 className="text-[14px] sm:text-[15px] font-[600] leading-tight !mt-1">
          <Link to={`/product/${product?._id}`} className="hover:underline">
            {product?.name || "Product Name"}
          </Link>
        </h3>

        <Rating
          name="small-rating"
          value={product?.rating || 4}
          readOnly
          size="small"
        />

        {/* SIZE + QTY */}
        <div className="flex items-center gap-4 !mt-2">
          {/* SIZE */}
          {/* <div className="relative">
            <span
              className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] !px-2 !py-1 rounded-md cursor-pointer"
              onClick={(e) => setSizeAnchor(e.currentTarget)}
            >
              Size: {selectedSize} <GoTriangleDown />
            </span>

            <Menu
              anchorEl={sizeAnchor}
              open={openSize}
              onClose={() => setSizeAnchor(null)}
            >
              {["S", "M"].map((v) => (
                <MenuItem
                  key={v}
                  onClick={() => {
                    setSelectedSize(v);
                    setSizeAnchor(null);
                  }}
                >
                  {v}
                </MenuItem>
              ))}
            </Menu>
          </div> */}

          {/* QTY */}
          <div className="relative">
            <span
              className="flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] !px-2 !py-1 rounded-md cursor-pointer"
              onClick={(e) => setQtyAnchor(e.currentTarget)}
            >
              Qty: {selectedQty} <GoTriangleDown />
            </span>

            <Menu
              anchorEl={qtyAnchor}
              open={openQty}
              onClose={() => setQtyAnchor(null)}
            >
              {[1, 2, 3, 4, 5, 6].map((v) => (
                <MenuItem
                  key={v}
                  onClick={() => {
                    setSelectedQty(v);
                    setQtyAnchor(null);
                    context.updateCartQty(cartItemId, v);
                  }}
                >
                  {v}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 !mt-2 flex-wrap">
          <span className="text-black text-[15px] font-[600]">
            ₹{product?.price || 0}
          </span>

          {product?.oldPrice && (
            <span className="line-through text-gray-500 text-[13px]">
              ₹{product.oldPrice}
            </span>
          )}

          {product?.oldPrice && product.oldPrice > product.price && (
            <span className="text-[#ff5252] opacity-70 text-[12px] font-[500]">
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              )}
              % OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
