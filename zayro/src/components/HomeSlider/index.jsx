import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";

const HomeSlider = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await fetchDataFromApi("/api/slider");
      if (res?.success) setSlides(res.data);
    };
    fetchSlides();
  }, []);

  return (
    <div className="homeSlider !mb-4 !mt-12 relative">
      <div className="container">
        <Swiper
          loop={true}
          slidesPerView={1}
          navigation={true}
          speed={1600} // smoother transition
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
            1400: { slidesPerView: 1 },
          }}
          className="homeSwiper"
        >
          {slides.length > 0 ? (
            slides.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt="banner"
                    className="
                      w-full object-cover rounded-xl 
                      max-h-[200px] sm:max-h-[260px] md:max-h-[340px] 
                      lg:max-h-[420px] xl:max-h-[480px]
                      transition-all duration-[1600ms]
                    "
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="rounded-xl overflow-hidden">
                <div className="w-full text-center py-10 text-gray-500">
                  Loading slider...
                </div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Navigation Button Styling */}
      <style>
        {`
          .homeSwiper .swiper-wrapper {
            transition-timing-function: cubic-bezier(0.35, 0.01, 0.28, 1) !important;
          }

          .homeSwiper .swiper-button-prev,
          .homeSwiper .swiper-button-next {
            width: 30px;
            height: 30px;
            background-color: rgba(255,255,255,0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            transition: all 0.3s ease-in-out;
          }

          .homeSwiper .swiper-button-prev:hover,
          .homeSwiper .swiper-button-next:hover {
            background-color: rgba(255,82,82,0.9);
          }

          .homeSwiper .swiper-button-prev:after,
          .homeSwiper .swiper-button-next:after {
            font-size: 16px;
            font-weight: bold;
            color: #000;
          }

          .homeSwiper .swiper-button-prev:hover:after,
          .homeSwiper .swiper-button-next:hover:after {
            color: #fff;
          }
        `}
      </style>
    </div>
  );
};

export default HomeSlider;
