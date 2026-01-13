import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { MdZoomOutMap } from "react-icons/md";
import { MyContext } from "../../App";

const ProductItem = ({ item }) => {
  const context = useContext(MyContext);

  return (
    <div
      className="
        group 
        bg-white 
        border border-gray-200 
        rounded-lg 
        shadow-sm 
        hover:shadow-md 
        transition 
        duration-300
        hover:-translate-y-1
        !p-3
        flex flex-col justify-between
      "
    >
      {/* IMAGE */}
      <div className="relative flex justify-center items-center">
        <Link to={`/product/${item?._id}`} className="w-full">
          <img
            src={item?.images?.[0]}
            alt={item?.name}
            className="
              w-full
              h-[220px] sm:h-[240px] md:h-[260px]
              object-contain
              transition-all duration-300
              group-hover:scale-[1.05]
            "
          />
        </Link>

        {/* ACTION BUTTON */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Button
            onClick={() => {
              context.setSelectedProduct(item);
              context.setOpenProductDetailsModal(true);
            }}
            sx={{
              minWidth: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: "#fff",
              color: "#000",
              "&:hover": { backgroundColor: "#ff5252", color: "#fff" },
            }}
          >
            <MdZoomOutMap size={16} />
          </Button>
        </div>
      </div>

      {/* DETAILS */}
      <div className="!mt-3">
        <h3 className="text-[13px] sm:text-[14px] font-medium text-gray-800 line-clamp-2 leading-tight">
          <Link to={`/product/${item?._id}`}>{item?.name}</Link>
        </h3>

        <Rating
          value={item?.rating || 4}
          size="small"
          readOnly
          className="!mt-1"
        />

        <div className="flex items-center gap-2 !mt-1">
          <span className="text-lg font-bold text-[#ff5252]">
            ₹{item.price}
          </span>
          {item?.oldPrice && (
            <span className="line-through text-[12px] text-gray-500">
              ₹{item.oldPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
