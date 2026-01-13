import React, { useContext } from "react";
import { FaShippingFast } from "react-icons/fa";
import { BsWallet2 } from "react-icons/bs";
import { LiaGiftSolid } from "react-icons/lia";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoChatboxOutline } from "react-icons/io5";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BsThreads, BsWhatsapp } from "react-icons/bs";
import AtmCard1 from "./../../assets/AtmCard1.png";
import AtmCard2 from "./../../assets/AtmCard2.png";
import AtmCard3 from "./../../assets/AtmCard1.png";
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import CartPanel from "../CartPanel";
import { MyContext } from "../../App";
import AppStoreSection from "../AppStoreSection";
import { RiRefund2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const context = useContext(MyContext);

  const socialLinks = [
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/share/1APhxLArCg/",
    },

    {
      icon: FaInstagram,
      url: "https://www.instagram.com/kashmirbuy.com_?igsh=MWtzbGxlNG9ndGJtcw==",
    },
  ];

  return (
    <>
      <footer className="!py-6 bg-[#fafafa]">
        <div className="container mx-auto !px-4">
          {/* Feature Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 !py-8 text-center">
            <div className="group flex flex-col items-center">
              <FaShippingFast className="text-[40px] transition duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-semibold !mt-3">Free Shipping</h3>
              <p className="text-[12px] font-medium">Orders Over ₹1500</p>
            </div>

            <div className="group flex flex-col items-center">
              <BsWallet2 className="text-[40px] transition duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-semibold !mt-3">
                Secure Payment
              </h3>
              <p className="text-[12px] font-medium">Cards Accepted</p>
            </div>

            <div className="group flex flex-col items-center">
              <RiRefund2Line className="text-[40px] transition duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-semibold mt-3">If Return</h3>
              <p className="text-[12px] font-medium">
                Refund In 3 Working Days
              </p>
            </div>

            <div className="group flex flex-col items-center">
              <BiSupport className="text-[40px] transition duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[16px] font-semibold !mt-3">Support 24/7</h3>
              <p className="text-[12px] font-medium">We’re Here Anytime</p>
            </div>
          </div>

          <hr />

          {/* Footer Main Sections */}
          <div className="flex flex-col lg:flex-row gap-10 !py-8">
            {/* Contact */}
            <div className="lg:w-1/3">
              <h2 className="text-[20px] font-semibold !mb-4">Contact Us</h2>
              <p className="text-[14px] !mb-4">
                KashmirBuy.com <br /> Srinagar, India
              </p>
              <Link to="/" className="text-black">
                kashmirbuy30@gmail.com
              </Link>

              <a
                href="https://wa.me/919149899920?text=Hello%20KashmirBuy%20Support
"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 !mt-4 hover:opacity-80 transition"
              >
                <FaWhatsapp className="text-[30px] text-[#25D366]" />
                <span className="text-[16px] font-semibold leading-tight">
                  Customer <br /> Care
                </span>
              </a>
            </div>

            {/* Links */}
            <div className="lg:w-1/3 grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-[20px] font-semibold !mb-4">
                  Our Products
                </h2>
                <ul className="space-y-2">
                  {[
                    "Clothing",
                    "Electronic",
                    "Bags",
                    "Footwear",
                    "Jewellery",
                    "Cosmetics",
                    "Groceries",
                    "Toys",
                    "Ketchenware",
                    "More......",
                  ].map((item, i) => (
                    <li key={i}>
                      <Link to="/" className="text-[15px]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-[20px] font-semibold !mb-4">
                  Our Services
                </h2>
                <ul className="space-y-2">
                  {[
                    "Delivery In Minimum Time",
                    "Return Available",
                    "Refund In 3 Working Days",
                    "Best Quality Product",
                    "Secure Payment",
                    "Minimum Price",
                    "Delivery All Over Kashmir",
                  ].map((item, i) => (
                    <li key={i}>
                      <Link to="/" className="text-[15px]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            {/* <div className="lg:w-1/3">
              <h2 className="text-[18px] font-semibold !mb-4">
                Subscribe To Newsletter
              </h2>
              <p className="text-[13px]">Get updates & exclusive offers.</p>

              <form className="!mt-5">
                <input
                  type="text"
                  className="w-full text-[14px] font-medium h-[40px] border border-gray-300 rounded !px-4 !mb-4"
                  placeholder="Your Email Address"
                />

                <Button className="btn-org w-full !md:w-auto">SUBSCRIBE</Button>

                <FormControlLabel
                  control={<Checkbox />}
                  label="I agree to the terms & privacy policy"
                />
              </form>
            </div> */}
          </div>
        </div>
      </footer>

      <AppStoreSection />

      {/* Bottom Strip */}
      <div className="border-t !py-3 bg-white">
        <div className="container mx-auto !px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <ul className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, url }, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[35px] h-[35px] rounded-full border flex items-center justify-center hover:bg-[#ff5252] transition"
                >
                  <Icon className="text-[16px] hover:text-white transition" />
                </a>
              </li>
            ))}
          </ul>

          <p className="text-[13px] text-gray-500">© 2025 - KashmirBuy.com</p>

          <div className="flex items-center gap-2">
            <img src={AtmCard1} className="h-[30px]" />
            <img src={AtmCard2} className="h-[30px]" />
            <img src={AtmCard3} className="h-[30px]" />
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor="right"
      >
        <div className="flex items-center justify-between !p-4 border-b">
          <h4>Shopping Cart</h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        <CartPanel />
      </Drawer>
    </>
  );
};

export default Footer;
