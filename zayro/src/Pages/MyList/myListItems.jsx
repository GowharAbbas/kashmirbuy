import React from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";

const MyListItems = (props) => {
  return (
    <div className="cartItem w-full !px-3 flex items-center gap-4 !pb-1 border-b border-[rgba(0,0,0,0.1)]">
      <div className="img w-[10%] rounded-md overflow-hidden">
        <Link to="/product/7867" className="group">
          <img
            src="https://www.jiomart.com/images/product/original/443059255_ltgreen/women-floral-print-co-ord-set-model-443059255_ltgreen-0-202410251734.jpg"
            alt="img"
            className="w-full group-hover:scale-105 transition-all"
          />
        </Link>
      </div>

      <div className="info w-[90%] relative">
        <IoCloseSharp className="cursor-pointer absolute top-[2px] right-[2px] text-[22px] link transition-all" />
        <span className="text-[11px] cursor-pointer">Sangria</span>
        <h3 className="text-[14px]">
          <Link to="/product/433" className="link">
            A-Line Kurti With Sharara & Dupatta
          </Link>
        </h3>

        <Rating
          name="custom-small"
          defaultValue={4}
          readOnly
          sx={{ fontSize: "14px" }}
          className="!text-[14px]"
        />

        <div className="flex items-center !mb-1 gap-2">
          <span className="price text-black text-[15px] font-[600]">₹600</span>
          <span className="oldPrice line-through text-gray-500 text-[14px] font-[500]">
            ₹800
          </span>
          <span className="price text-[#ff5252] opacity-50 text-[12px] font-[500]">
            45% OFF
          </span>
        </div>

        <Button className="btn-org btn-lg btn-sm !font-bold !text-[9px]">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default MyListItems;
