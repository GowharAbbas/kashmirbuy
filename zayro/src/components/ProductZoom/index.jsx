import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const ProductZoom = ({ images = [] }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  const fallbackImg = "/no-image.png"; // you can change this

  // If no images found → avoid error & return a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center">
        <img
          src={fallbackImg}
          alt="No product"
          className="w-[300px] h-[420px] rounded-lg object-contain border shadow"
        />
      </div>
    );
  }

  return (
    <>
      {/* Wrapper */}
      <div className="w-full flex flex-col md:flex-row gap-4">
        {/* Thumbnails */}
        <div
          className="
            flex md:flex-col gap-3 order-2 md:order-1 
            justify-center md:justify-start
          "
        >
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className={`
                cursor-pointer border p-1 rounded-md transition-all hover:scale-105
                w-16 h-24 md:w-20 md:h-28 lg:w-24 lg:h-36
                flex items-center justify-center
                ${
                  selected === i
                    ? "border-red-500 shadow-lg scale-[1.05]"
                    : "border-gray-300"
                }
              `}
            >
              <img src={img} className="w-full h-full object-contain" alt="" />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="order-1 md:order-2 flex-1 flex justify-center">
          <img
            src={images[selected] || fallbackImg}
            alt="Main"
            onClick={() => setOpen(true)}
            className="
              rounded-lg cursor-zoom-in transition-all 
              w-[300px] h-[420px] 
              sm:w-[350px] sm:h-[490px]
              md:w-[420px] md:h-[590px]
              lg:w-[500px] lg:h-[700px] 
              object-contain shadow-md border
            "
          />
        </div>
      </div>

      {/* Lightbox */}
      {open && images.length > 0 && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={selected}
          slides={images.map((img) => ({ src: img }))}
          plugins={[Zoom, Thumbnails, Slideshow]}
          slideshow={{ autoplay: true, delay: 2500 }}
          zoom={{ maxZoomPixelRatio: 3 }}
        />
      )}
    </>
  );
};

export default ProductZoom;
