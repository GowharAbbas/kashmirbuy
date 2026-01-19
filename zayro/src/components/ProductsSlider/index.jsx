import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
//import { Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";

import "swiper/css/effect-fade";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";

const ProductsSlider = ({ products = [] }) => {
  return (
    <div className="productsSlider !py-3 relative">
      {products.length > 0 ? (
        <Swiper
          loop={true}
          navigation={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={5000}
          modules={[Navigation, Autoplay, EffectFade]}
          breakpoints={{
            0: { slidesPerView: 3, spaceBetween: 10 },
            600: { slidesPerView: 4, spaceBetween: 15 },
            1024: { slidesPerView: 6, spaceBetween: 20 },
          }}
          effect="slide"
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductItem item={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-400 !py-5 text-[15px]">
          No products found in this category.
        </p>
      )}

      <style>
        {`
        .productsSlider .swiper-button-prev,
.productsSlider .swiper-button-next {
  display: none !important;
}
          .productsSlider .swiper-button-prev,
          .productsSlider .swiper-button-next {
            width: 32px;
            height: 32px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            backdrop-filter: blur(4px);
            transition:.2s;
          }

          .productsSlider .swiper-button-prev:hover,
          .productsSlider .swiper-button-next:hover {
            background: #ff5252;
          }

          .productsSlider .swiper-button-prev:after,
          .productsSlider .swiper-button-next:after {
            font-size: 14px;
            color: #222;
          }

          .productsSlider .swiper-button-prev:hover:after,
          .productsSlider .swiper-button-next:hover:after {
            color: white;
          }
        `}
      </style>
    </div>
  );
};

export default ProductsSlider; ////////////////
