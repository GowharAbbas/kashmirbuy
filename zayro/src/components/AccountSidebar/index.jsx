import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoLockClosedOutline, IoLocationOutline } from "react-icons/io5";
import { NavLink } from "react-router";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadImage } from "../../utils/api";
import Drawer from "@mui/material/Drawer";

const AccountSideBar = () => {
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const context = useContext(MyContext);

  useEffect(() => {
    const userAvatar = [];
    if (context?.userData?.avatar) {
      userAvatar.push(context?.userData?.avatar);
    }
    setPreviews(userAvatar);
  }, [context?.userData]);

  let selectedImages = [];
  const formdata = new FormData();

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`avatar`, file);

          uploadImage("/api/user/user-avatar", formdata).then((res) => {
            setUploading(false);
            let avatar = [];
            avatar.push(res?.data?.avatar);
            setPreviews(avatar);
          });
        } else {
          context.openAlertBox(
            "error",
            "Please select a valid JPG, PNG or Webp image file"
          );
          setUploading(false);
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const renderSidebarContent = () => (
    <div className="w-full h-full flex flex-col">
      {/* TOP USER BLOCK */}
      <div className="w-full !p-5 flex items-center justify-center flex-col">
        <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden !mb-4 relative group flex items-center justify-center bg-gray-200">
          {uploading ? (
            <CircularProgress color="inherit" />
          ) : (
            <>
              {previews?.length > 0 && previews[0] ? (
                previews.map((img, index) => (
                  <img
                    src={img}
                    key={index}
                    className="w-full h-full object-cover"
                    alt="User Avatar"
                  />
                ))
              ) : (
                <img
                  src="/user.jpeg"
                  className="w-full h-full object-cover"
                  alt="Default User"
                />
              )}
            </>
          )}

          <div className="overlay w-[100%] h-[100%] absolute !top-0 !left-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
            <FaCloudUploadAlt className="text-[#fff] text-[25px]" />
            <input
              type="file"
              className="absolute !top-0 !left-0 w-full h-full opacity-0"
              accept="image/*"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
              name="avatar"
            />
          </div>
        </div>

        <h3 className="text-[16px] sm:text-[18px] font-bold text-center">
          {context?.userData?.name}
        </h3>
        <h6 className="text-[11px] sm:text-[12px] text-gray-600 text-center break-all">
          {context?.userData?.email}
        </h6>
      </div>

      {/* NAV LINKS */}
      <ul className="list-none bg-[#f5f5f5] myAccountTabs flex-1">
        <li className="w-full">
          <NavLink
            to="/my-account"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMobileOpen(false)}
          >
            <Button className="w-full !py-2 !px-5 !text-left !justify-start !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.7)] text-[13px]">
              <FaRegUser className="text-[15px]" /> My Profile
            </Button>
          </NavLink>
        </li>

        <li className="w-full">
          <NavLink
            to="/change-password"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMobileOpen(false)}
          >
            <Button className="w-full !py-2 !px-5 !text-left !justify-start !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.7)] text-[13px]">
              <IoLockClosedOutline className="text-[15px]" /> Change Password
            </Button>
          </NavLink>
        </li>

        {/* <li className="w-full">
          <NavLink
            to="/add-address"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMobileOpen(false)}
          >
            <Button className="w-full !py-2 !px-5 !text-left !justify-start !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.7)] text-[13px]">
              <IoLocationOutline className="text-[17px]" /> Add Address
            </Button>
          </NavLink>
        </li> */}

        <li className="w-full">
          <NavLink
            to="/my-orders"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMobileOpen(false)}
          >
            <Button className="w-full !py-2 !px-5 !text-left !justify-start !capitalize !rounded-none flex items-center gap-2 !text-[rgba(0,0,0,0.7)] text-[13px]">
              <IoBagCheckOutline className="text-[17px]" /> My Orders
            </Button>
          </NavLink>
        </li>

        {/* Wishlist kept commented as before */}
      </ul>
    </div>
  );

  return (
    <>
      {/* MOBILE: BUTTON + DRAWER */}
      <div className="lg:hidden w-[100%] !mb-4 !p-1">
        <Button
          className="w-full !py-2 !rounded-md !bg-[#d9d6d6] !hover:bg-[#e04747] !text-white !text-[12px] flex items-center !font-semibold justify-center gap-2"
          onClick={() => setMobileOpen(true)}
        >
          Profile | Password | Orders
        </Button>

        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <div className="w-[80vw] max-w-[320px] h-full bg-white flex flex-col">
            {renderSidebarContent()}
          </div>
        </Drawer>
      </div>

      {/* DESKTOP: NORMAL SIDEBAR CARD */}
      <div className="hidden lg:block card bg-white shadow-md rounded-md sticky !top-36">
        {renderSidebarContent()}
      </div>
    </>
  );
};

export default AccountSideBar;
