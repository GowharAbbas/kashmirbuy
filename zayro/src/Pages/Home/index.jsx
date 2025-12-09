import React, { useState, useEffect, useRef } from "react";
import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/CatSlider";
import AdsBannerSlider from "../../components/AdsBannerSlider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductsSlider from "../../components/ProductsSlider";
import { fetchDataFromApi } from "../../utils/api";
import AdsBannerSlider2 from "../../components/AdsBannerSlider2";
import ProductItem from "../../components/ProductItem";

const LIMIT = 20;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [tabValue, setTabValue] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // ---- ALL PRODUCTS (Infinite Scroll) ----
  const [allProducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingAll, setLoadingAll] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  // ------------------ Fetch Categories ------------------
  const fetchCategories = async () => {
    const res = await fetchDataFromApi("/api/category");
    if (res?.data?.length > 0) {
      setCategories(res.data);
      setTabValue(res.data[0]?.name);
    }
  };

  // ------------------ Category Products ------------------
  const fetchCategoryProducts = async () => {
    if (!tabValue) return;
    const res = await fetchDataFromApi(
      `/api/product/getAllProductsByCatName?catName=${tabValue}`
    );
    if (res?.success) {
      setCategoryProducts(res.products);
    }
  };

  // ------------------ Latest Products ------------------
  const fetchLatestProducts = async () => {
    const res = await fetchDataFromApi(`/api/product/latest`);
    if (res?.success) {
      setLatestProducts(res.products);
    }
  };

  // ------------------ Featured Products ------------------
  const fetchFeaturedProducts = async () => {
    const res = await fetchDataFromApi(`/api/product/getAllFeaturedProducts`);
    if (res?.success) {
      setFeaturedProducts(res.products);
    }
  };

  // ------------------ ALL PRODUCTS (Infinite Scroll) ------------------
  const loadAllProducts = async (pageNum) => {
    if (loadingAll || !hasMore) return;

    setLoadingAll(true);

    const res = await fetchDataFromApi(
      `/api/product/getAllProducts?page=${pageNum}&perPage=${LIMIT}`
    );

    if (res?.success) {
      const newData = res.products || [];

      // prevent duplicates
      setAllProducts((prev) => {
        const cleaned = newData.filter(
          (p) => !prev.find((x) => x._id === p._id)
        );
        return [...prev, ...cleaned];
      });

      if (newData.length < LIMIT) setHasMore(false);
    }

    setLoadingAll(false);
  };

  // ------------------ Load more pages ------------------
  useEffect(() => {
    loadAllProducts(page);
  }, [page]);

  // ------------------ Infinite Scroll Observer ------------------
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingAll) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadingAll, hasMore]);

  // ------------------ Initial Loads ------------------
  useEffect(() => {
    fetchCategories();
    fetchLatestProducts();
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    fetchCategoryProducts();
  }, [tabValue]);

  return (
    <>
      {/* HERO SLIDER */}
      <HomeSlider />

      {/* CATEGORY ICON SLIDER */}
      <HomeCatSlider />

      {/* CATEGORY TAB SLIDER */}
      <section className="bg-white !py-6">
        <div className="container">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:flex-nowrap">
            <div className="text-gray-800 font-semibold truncate text-[14px] sm:text-[22px]">
              {tabValue} Products
            </div>

            <div className="flex-1 sm:w-[60%] overflow-x-auto no-scrollbar">
              <Tabs
                value={tabValue}
                onChange={(e, val) => setTabValue(val)}
                variant="scrollable"
                scrollButtons
              >
                {categories.map((cat) => (
                  <Tab key={cat._id} label={cat.name} value={cat.name} />
                ))}
              </Tabs>
            </div>
          </div>

          <ProductsSlider products={categoryProducts} />
          <AdsBannerSlider />
        </div>
      </section>

      {/* MID BANNER - YOUR CUSTOM BEAUTIFUL GRADIENT */}
      <section className="bg-white !pt-0 !pb-8">
        <div className="container flex justify-center">
          <div
            className="
        !mb-10 w-[95%] sm:w-[85%] md:w-[80%]
        rounded-2xl shadow-[0_8px_25px_rgba(255,82,82,0.25)]
        relative overflow-hidden text-center cursor-pointer
        transition-all duration-500
        hover:shadow-[0_12px_35px_rgba(255,82,82,0.35)]

        animate-gradient
        bg-[length:300%_300%]
        bg-gradient-to-r from-[#ffe1e1] via-[#ffd4d4] to-[#ffc8c8]

        hover:scale-[1.01]
        parallax
      "
          >
            {/* Floating Pattern Elements */}
            <div className="absolute top-[-20px] left-[-20px] w-28 h-28 bg-[#ff525230] rounded-full blur-2xl animate-float-slow"></div>
            <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-[#ff525220] rounded-full blur-3xl animate-float"></div>

            {/* Content */}
            <div className="!px-6 !py-10 sm:py-12 fade-in">
              <h1 className="text-[26px] sm:text-[38px] font-extrabold text-[#B22222] tracking-wide">
                KashmirBuy
                <span className="text-[16px] sm:text-[22px] font-bold text-[#ff5252]">
                  .com
                </span>
              </h1>

              <p className="!mt-4 text-[14px] sm:text-[18px] font-medium text-gray-700 leading-relaxed fade-in-delayed">
                Discover the Joy of Shopping with
                <span className="text-[#ff5252] font-semibold">
                  {" "}
                  KashmirBuy<span className="text-[10px]">.com</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="!pt-3 !py-5 bg-white">
        <div className="container">
          <h2 className="text-[22px] font-[600]">Featured Products</h2>
          <ProductsSlider items={5} products={featuredProducts} />
          <AdsBannerSlider2 />
        </div>
      </section>

      {/* ALL PRODUCTS - INFINITE SCROLL */}
      <section className="bg-white !py-6">
        <div className="container">
          <h2 className="text-[22px] font-[600] !mb-4">All Products</h2>

          {/* PRODUCTS GRID */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allProducts.map((item) => (
              <ProductItem key={item._id} item={item} />
            ))}
          </div>

          {/* LOADING */}
          {loadingAll && (
            <p className="text-center !py-3 text-gray-500">Loading more...</p>
          )}

          {/* END MESSAGE */}
          {!hasMore && (
            <p className="text-center !py-4 text-gray-600 text-[15px]">
              🎉 You reached the end
            </p>
          )}

          {/* SENTINEL */}
          <div ref={sentinelRef} className="!h-10" />
        </div>
      </section>
    </>
  );
};

export default Home;
