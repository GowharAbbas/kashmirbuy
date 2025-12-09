import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const HomeCatSlider = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const res = await fetchDataFromApi("/api/category");
    setCategories(res?.data || []);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="w-full !pt-6 !pb-8">
      <div className="container mx-auto !px-4">
        <div
          className="
            grid 
            grid-cols-4
            sm:grid-cols-5
            md:grid-cols-6
            lg:grid-cols-8
            xl:grid-cols-8
            gap-4 
            place-items-center
          "
        >
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/productListing?category=${cat.name}`}
              className="flex flex-col items-center text-center"
            >
              <div
                className="
                  w-16 h-16
                  sm:w-20 sm:h-20
                  md:w-20 md:h-20
                  lg:w-24 lg:h-24
                  rounded-full 
                  overflow-hidden 
                  bg-white 
                  shadow-md 
                  hover:shadow-xl
                  transition-all 
                  duration-300
                  transform 
                  hover:scale-105
                  flex 
                  items-center 
                  justify-center
                "
              >
                <img
                  src={
                    cat?.images?.length > 0 ? cat.images[0] : "/no-image.png"
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
                />
              </div>

              <h3
                className="
                  text-[12px]
                  sm:text-[13px]
                  md:text-[14px]
                  lg:text-[15px]
                  mt-2 
                  font-semibold 
                  truncate 
                  w-20 
                  sm:w-24 
                  lg:w-28
                "
              >
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCatSlider;
