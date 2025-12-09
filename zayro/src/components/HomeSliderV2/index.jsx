import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import SliderImage from "./../../assets/SliderImg1.png";
import SliderImage2 from "./../../assets/SliderImg2.png";
import Button from "@mui/material/Button";
const HomeBannerV2 = () => {
  return (
    <Swiper
      loop={true}
      spaceBetween={30}
      effect={"fade"}
      navigation={true}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="homeSliderV2"
    >
      <SwiperSlide>
        <div className="item w-full rounded-md overflow-hidden relative">
          <img src={SliderImage} />
          <div className="info absolute top-10 -right-[100%] opacity-0 w-[45%] h-[100%] z-50 p-8 flex items-center flex-col justify-center transition-all duration-700">
            <h4 className="text-[18px] font-[500] w-full text-left !mb-3">
              Big Saving Days Sale
            </h4>
            <h2 className="text-[35px] font-[700] w-full">
              Women Solid Round Green T-Shirt
            </h2>
            <h3 className="flex items-center gap-3 text-[18px] font-[500] w-full text-left !mt-3 !mb-3">
              Starting At Only{" "}
              <span className="text-[#ff5252] text-[30px] font-[700]">
                ₹199
              </span>
            </h3>
            <div className="w-full">
              <Button className="btn-org">SHOP NOW</Button>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="item w-full rounded-md overflow-hidden">
          <img src={SliderImage2} />
          <div className="info absolute top-10 -right-[100%] opacity-0 w-[45%] h-[100%] z-50 p-8 flex items-center flex-col justify-center transition-all duration-700">
            <h4 className="text-[18px] font-[500] w-full text-left !mb-3">
              Big Saving Days Sale
            </h4>
            <h2 className="text-[35px] font-[700] w-full">
              Modern Chair In Black Color
            </h2>
            <h3 className="flex items-center gap-3 text-[18px] font-[500] w-full text-left !mt-3 !mb-3">
              Starting At Only{" "}
              <span className="text-[#ff5252] text-[30px] font-[700]">
                ₹499
              </span>
            </h3>
            <div className="w-full">
              <Button className="btn-org">SHOP NOW</Button>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeBannerV2;
