import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Sidebar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Button from "@mui/material/Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const Sidebar = () => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
  const [isOpenBrandFilter, setIsOpenBrandFilter] = useState(true);

  return (
    <aside className="sidebar">
      <div className="box">
        <h3 className="w-full !mb-3 text-[16px] font-[600] flex items-center !pr-5">
          Shop by Category{" "}
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter === true ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter}>
          <div className="scroll !px-4 relative -left-[13px]">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Fashion"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Electronics"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Bags"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Footwear"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Groceries"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Beauty"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Jewellery"
              className="w-full"
            />
          </div>
        </Collapse>
      </div>

      <div className="box !mt-3">
        <h3 className="w-full !mb-3 text-[16px] font-[600] flex items-center !pr-5">
          Size{" "}
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black"
            onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}
          >
            {isOpenSizeFilter === true ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenSizeFilter}>
          <div className="scroll !px-4 relative -left-[13px]">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Small"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Medium"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Large"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="X Large"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="XX Large"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="XXX Large"
              className="w-full"
            />
          </div>
        </Collapse>
      </div>

      <div className="box !mt-3">
        <h3 className="w-full !mb-3 text-[16px] font-[600] flex items-center !pr-5">
          Brand{" "}
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-black"
            onClick={() => setIsOpenBrandFilter(!isOpenBrandFilter)}
          >
            {isOpenBrandFilter === true ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        <Collapse isOpened={isOpenBrandFilter}>
          <div className="scroll !px-4 relative -left-[13px]">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Puma"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Adidas"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Nike"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Safari"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="VIP"
              className="w-full"
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="LV"
              className="w-full"
            />
          </div>
        </Collapse>
      </div>

      <div className="box !mt-4">
        <h3 className="w-full !mb-3 text-[16px] font-[600] flex items-center !pr-5">
          Filter By Price
        </h3>

        <RangeSlider />
        <div className="flex !pt-4 !pb-2 priceRange">
          <span className="text-[13px]">
            From: <strong className="text-dark">₹{100}</strong>
          </span>
          <span className="!ml-auto text-[13px]">
            to: <strong className="text-dark">₹{5000}</strong>
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; /////////////////////////
