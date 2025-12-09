import React, { useContext } from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import { MdZoomOutMap } from "react-icons/md";
import Bag1 from "./../../assets/bag1.jpg";
import Bag2 from "./../../assets/bag2.jpg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MyContext } from "../../App";

const ProductItemListView = () => {
  const context = useContext(MyContext);

  return (
    <div className="productItem shadow-lg rounded-md overflow-hidden border-1 border-[rgba(0,0,0,0.1)] flex items-center">
      <div className="group imgWrapper !ml-3 w-[20%] overflow-hidden rounded-md relative">
        <Link to="/">
          <div className="img h-[100%] overflow-hidden">
            <img src={Bag1} alt="Img" className="w-full" />

            <img
              src={Bag2}
              alt="Img"
              className="w-full h-[100%] transition-all duration-800 absolute top-0 left-0 opacity-0 group-hover:opacity-100"
            />
          </div>
        </Link>
        <span className="discount flex items-center absolute top-[10px] left-[10px] bg-[#ff5252] text-white rounded-lg !p-1 text-[12px] font-[500]">
          10%
        </span>

        <div className="actions absolute top-[-20px] right-[5px] z-50 flex items-center gap-2 flex-col w-[50px] transition-all duration-300 group-hover:top-[10px] opacity-0 group-hover:opacity-100">
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full"
            sx={{
              backgroundColor: "white",
              color: "black",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#ff5252",
                color: "white",
              },
            }}
            onClick={() => context.setOpenProductDetailsModal(true)}
          >
            <MdZoomOutMap className="text-[18px]" />
          </Button>

          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full"
            sx={{
              backgroundColor: "white",
              color: "black",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#ff5252",
                color: "white",
              },
            }}
          >
            <IoGitCompareOutline className="text-[18px]" />
          </Button>

          <Button
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full"
            sx={{
              backgroundColor: "white",
              color: "black",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#ff5252",
                color: "white",
              },
            }}
          >
            <FaRegHeart className="text-[18px]" />
          </Button>
        </div>
      </div>
      <div className="info !p-3 !py-3 !px-8 w-[75%] ">
        <h6 className="text-[15px] !font-[400]">
          <Link to="/" className="link transition-all">
            Looney Tunes
          </Link>
        </h6>
        <h3 className="text-[18px] title !mt-3 !mb-3 font-[500] text-[#000]">
          <Link to="/" className="link transition-all">
            Ladies Purse
          </Link>
        </h3>

        <p className="text-[14px] !mb-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, provident
          laudantium. Temporibus veritatis deserunt officiis harum adipisci
          perspiciatis nam earum ea recusandae.
        </p>

        <Rating name="size-small" defaultValue={4} size="small" readOnly />

        <div className="flex items-center gap-2">
          <span className="oldPrice line-through text-gray-500 text-[15px] font-[500]">
            ₹800
          </span>
          <span className="price text-[#ff5252] text-[16px] font-[600] ">
            ₹600
          </span>
        </div>

        <div className="!mt-3">
          <Button className="btn-org flex gap-2">
            <MdOutlineShoppingCart className="text-[20px]" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemListView; /////////////////////////////
