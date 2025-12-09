import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import MyListItems from "./myListItems";
import AccountSideBar from "../../components/AccountSidebar";

const MyList = () => {
  return (
    <section className="!py-10 w-full bg-[#f5f5f5]">
      <div className="container flex gap-5">
        <div className="col1 w-[20%]">
          <AccountSideBar />
        </div>
        <div className="col2 w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="!py-1 !pb-0 !px-4 border-b border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[18px]">My List</h2>
              <p className="!mt-0">
                There are{" "}
                <span className="font-bold text-[#ff5252] text-[16px]">3</span>{" "}
                products in your List
              </p>
            </div>

            <MyListItems />
            <MyListItems />
            <MyListItems />
            <MyListItems />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyList;
