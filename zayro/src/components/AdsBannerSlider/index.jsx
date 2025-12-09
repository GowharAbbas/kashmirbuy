import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";
import BannerBox from "../BannerBox";

const AdsBannerSlider = () => {
  const [banners, setBanners] = useState([]);

  const fetchBanners = async () => {
    const res = await fetchDataFromApi("/api/sliderSmall1");
    if (res?.success) setBanners(res.data);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="w-full !py-6 relative">
      <Swiper
        loop={true}
        navigation={true}
        autoplay={false}
        effect="slide"
        speed={900} // smoother transition
        modules={[Navigation, Autoplay, EffectFade]}
        className="adsSwiper"
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 12 },
          1024: { slidesPerView: 4, spaceBetween: 14 },
        }}
      >
        {banners?.length > 0 ? (
          banners.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="banner-wrapper group transition-all duration-700">
                <img
                  src={item.images?.[0]}
                  alt="banner"
                  loading="lazy"
                  className="
                    w-full rounded-lg 
                    transition-all duration-[900ms] 
                    ease-[cubic-bezier(.22,.61,.36,1)]
                    group-hover:scale-[1.10]
                    group-hover:shadow-2xl
                    group-hover:brightness-110
                  "
                />

                {/* subtle floating fade overlay */}
                <div
                  className="
                    absolute inset-0 
                    bg-gradient-to-t from-black/30 to-transparent 
                    opacity-0 group-hover:opacity-40 
                    transition-all duration-700
                  "
                ></div>

                {/* tilt effect */}
                <style>
                  {`
                    .banner-wrapper:hover {
                      transform: perspective(800px) rotateY(2deg) rotateX(1deg);
                    }
                  `}
                </style>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="text-center !py-10 text-gray-500">
              Loading banners...
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <style>
        {`
          .adsSwiper .swiper-button-prev,
          .adsSwiper .swiper-button-next {
            width: 30px;
            height: 30px;
            background-color: rgba(255,255,255,0.6);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            transition: all 0.4s ease;
          }

          .adsSwiper .swiper-button-prev:hover,
          .adsSwiper .swiper-button-next:hover {
            background-color: #ff5252;
            transform: scale(1.15);
          }

          .adsSwiper .swiper-button-prev:after,
          .adsSwiper .swiper-button-next:after {
            font-size: 14px;
            font-weight: bold;
            color: #000;
            transition: all 0.4s ease;
          }

          .adsSwiper .swiper-button-prev:hover:after,
          .adsSwiper .swiper-button-next:hover:after {
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default AdsBannerSlider; ////////////////
