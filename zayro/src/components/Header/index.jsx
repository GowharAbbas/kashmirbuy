import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Search from "../Search";
import Navigation from "./Navigation";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoIosGitCompare } from "react-icons/io";
import { FaRegHeart, FaBars, FaRegUser } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { fetchDataFromApi } from "../../utils/api";
import { IoLockClosedOutline, IoLocationOutline } from "react-icons/io5";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      e.preventDefault();
    } else {
      navigate("/");
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logout = () => {
    setAnchorEl(null);

    fetchDataFromApi(
      `/api/user/logout?token=${localStorage.getItem("accessToken")}`,
      { withCredentials: true }
    ).then((res) => {
      if (res?.error === false) {
        // 🔥 Clear user-related local storage
        localStorage.removeItem("selectedAddress");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 🔥 Clear context data
        context.setIsLogin(false);
        context.setUserData(null);
        context.setCartItems([]); // << add this

        navigate("/");
      }
    });
  };

  return (
    <header className="bg-white fixed !top-0 !right-0 !z-50 w-full shadow-md rounded-b-[30px]">
      {/* -------- MOBILE HEADER -------- */}
      <div className="w-full border-b !py-1 !px-4 flex items-center justify-between sm:hidden">
        {/* <FaBars
          className="text-[22px] cursor-pointer"
          onClick={() => setShowMobileMenu((prev) => !prev)}
        /> */}

        <Link to="/" onClick={handleLogoClick} className="text-center">
          <h3 className="font-extrabold text-[20px] text-[#B22222]">
            Kashmir
            <span className="text-[#ff5252]">
              Buy<span className="!text-[15px]">.com</span>
            </span>
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          {context.isLogin ? (
            <>
              <FaRegUser
                className="text-[20px] cursor-pointer text-black"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              />
              <span className="text-[12px] capitalize font-semibold">
                {context?.userData?.name}
              </span>
            </>
          ) : (
            <Link to="/login" className="text-[13px] font-semibold underline">
              Login/Register
            </Link>
          )}

          {context.isLogin && (
            <IconButton onClick={() => context.setOpenCartPanel(true)}>
              <StyledBadge
                badgeContent={context?.cartItems?.length || 0}
                color="secondary"
              >
                <MdOutlineShoppingCart className="text-[22px] text-black" />
              </StyledBadge>
            </IconButton>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden !px-4 !pt-2 !pb-0 !ml-10">
        <Search />
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="sm:hidden !px-4 !py-2 border-b bg-gray-50 space-y-2 text-[14px]">
          {/* <Link to="/compare" className="flex items-center gap-2">
            <IoIosGitCompare /> Compare
          </Link> */}

          {/* <Link to="/wishlist" className="flex items-center gap-2">
            <FaRegHeart /> Wishlist
          </Link> */}

          {/* {context.isLogin && (
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500"
            >
              <IoIosLogOut /> Logout
            </button>
          )} */}
        </div>
      )}

      {/* -------- DESKTOP HEADER -------- */}
      <div className="hidden sm:flex items-center justify-between !py-3 !px-4 container">
        <Link to="/" onClick={handleLogoClick}>
          <h3 className="font-[800] text-[25px] text-[#B22222]">
            Kashmir
            <span className="text-[#ff5252]">
              Buy<span className="!text-[18px]">.com</span>
            </span>
          </h3>
        </Link>

        <div className="w-[50%] max-w-[480px]">
          <Search />
        </div>

        <div className="flex items-center gap-3">
          {context.isLogin ? (
            <>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <Button className="!w-[40px] !h-[40px] !rounded-full bg-[#f1f1f1] !text-black">
                  <FaRegUser className="text-[18px] text-black" />
                </Button>

                <span className="text-[14px] font-semibold capitalize">
                  {context?.userData?.name}
                </span>
              </div>

              <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null); // close menu immediately
                    navigate("/my-account");
                  }}
                >
                  <div className="flex gap-2 text-[13px] w-full">
                    <FaRegUser /> My Account
                  </div>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setAnchorEl(null); // close menu immediately
                    navigate("/change-password");
                  }}
                >
                  <div className="flex gap-2 text-[13px] w-full">
                    <IoLockClosedOutline /> Change Password
                  </div>
                </MenuItem>

                {/* <MenuItem
                  onClick={() => {
                    setAnchorEl(null); // close menu immediately
                    navigate("/add-address");
                  }}
                >
                  <div className="flex gap-2 text-[13px] w-full">
                    <IoLocationOutline /> Add Address
                  </div>
                </MenuItem> */}

                <MenuItem
                  onClick={() => {
                    setAnchorEl(null); // close menu immediately
                    navigate("/my-orders");
                  }}
                >
                  <div className="flex gap-2 text-[13px] w-full">
                    <IoBagCheckOutline /> Orders
                  </div>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setAnchorEl(null); // close menu immediately
                    logout(); // call logout function
                  }}
                  className="flex gap-2 text-[13px]"
                >
                  <IoIosLogOut /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <span className="text-[14px]">
              <Link to="/login">Login</Link> |{" "}
              <Link to="/register">Register</Link>
            </span>
          )}

          {/* Updated Icon Colors */}
          {/* <Tooltip title="Compare">
            <IconButton>
              <StyledBadge badgeContent={4} color="secondary">
                <IoIosGitCompare className="text-[20px] text-black" />
              </StyledBadge>
            </IconButton>
          </Tooltip> */}

          {/* <Tooltip title="Wishlist">
            <IconButton>
              <StyledBadge badgeContent={4} color="secondary">
                <FaRegHeart className="text-[20px] text-black" />
              </StyledBadge>
            </IconButton>
          </Tooltip> */}

          {context.isLogin && (
            <Tooltip title="Cart">
              <IconButton onClick={() => context.setOpenCartPanel(true)}>
                <StyledBadge
                  badgeContent={context?.cartItems?.length || 0}
                  color="secondary"
                >
                  <MdOutlineShoppingCart className="text-[22px] text-black" />
                </StyledBadge>
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>

      <Navigation />
    </header>
  );
};

export default Header; ///////////////////
