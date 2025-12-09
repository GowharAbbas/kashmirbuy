import React from "react";
import { FaGooglePlay } from "react-icons/fa";
import { IoLogoApple } from "react-icons/io5";

const AppStoreSection = () => {
  return (
    <div className="appStoreSection bg-[#fafafa] !py-6 border-t border-[rgba(0,0,0,0.1)]">
      <div className="container flex flex-col items-center text-center gap-4">
        <h3 className="text-[20px] font-[600]">Download Our App</h3>
        <p className="text-[14px] text-[rgba(0,0,0,0.6)]">
          Coming Soon on Android and iOS
        </p>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-black text-white !px-4 !py-2 rounded hover:bg-[#333] transition-all">
            <FaGooglePlay className="text-[20px]" />
            Google Play
          </button>

          <button className="flex items-center gap-2 bg-black text-white !px-4 !py-2 rounded hover:bg-[#333] transition-all">
            <IoLogoApple className="text-[24px]" />
            App Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppStoreSection;
