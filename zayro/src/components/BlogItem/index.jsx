import React from "react";
import { IoMdTime } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const BlogItem = () => {
  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden rounded-md cursor-pointer relative">
        <img
          src="https://www.icecubedigital.com/wp-content/webp-express/webp-images/uploads/2017/10/blog-img-reason.jpg.webp"
          alt="img"
          className="w-full transition-all group-hover:scale-105 group-hover:rotate-1"
        />
        <span className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[#ff5252] rounded-md text-[11px] !p-1 gap-0.5 font-[500]">
          <IoMdTime className="text-[14px]" /> 5 APRIL, 2025
        </span>
      </div>
      <div className="info py-4">
        <h2 className="text-[16px] font-[500] text-black">
          <Link to="/" className="link">
            Nullam ullamcorper
          </Link>
        </h2>
        <p className="text-[13px] font-[400] text-[rgba(0,0,0,0.8)] mb-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
        <Link
          to="/"
          className="link text-[14px] font-[500] flex items-center gap-1"
        >
          Read More <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
