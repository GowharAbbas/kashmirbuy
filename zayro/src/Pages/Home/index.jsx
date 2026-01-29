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
      `/api/product/getAllProductsByCatName?catName=${tabValue}`,
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
      `/api/product/getAllProducts?page=${pageNum}&perPage=${LIMIT}`,
    );

    if (res?.success) {
      const newData = res.products || [];

      // prevent duplicates
      setAllProducts((prev) => {
        const cleaned = newData.filter(
          (p) => !prev.find((x) => x._id === p._id),
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
      { threshold: 1 },
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

      {/* MID BANNER – FAST DELIVERY MAP VIEW */}
      <section className="bg-white !pt-0 !pb-10">
        <div className="container flex justify-center">
          <div
            className="
        relative w-[95%] sm:w-[85%] md:w-[80%]
        h-[340px] sm:h-[380px]
        rounded-2xl overflow-hidden
        bg-gradient-to-br from-[#fff1f1] via-[#ffeaea] to-[#ffdede]
        shadow-[0_10px_30px_rgba(255,82,82,0.25)]
      "
          >
            {/* Soft map grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffcccc_1px,transparent_0)] bg-[size:22px_22px] opacity-40"></div>

            {/* FAST DELIVERY ZONE */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full border-2 border-dashed border-[#ff5252] bg-[#ff525210] animate-pulse"></div>
            </div>

            {/* Connection Lines */}
            <div className="absolute top-1/2 left-1/2 w-[32%] h-[2px] bg-[#ff5252]/40"></div>
            <div className="absolute top-1/2 left-[18%] w-[32%] h-[2px] bg-[#ff5252]/40"></div>
            <div className="absolute top-[18%] left-1/2 h-[32%] w-[2px] bg-[#ff5252]/40"></div>
            <div className="absolute bottom-[22%] left-1/2 h-[32%] w-[2px] bg-[#ff5252]/40"></div>

            {/* Center – Magam */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg magam-animate">
                Magam
              </div>
            </div>

            {/* Right – Beerwah */}
            <div className="absolute right-[8%] top-1/2 -translate-y-1/2 z-20">
              <div className="!px-4 !py-1 rounded-full bg-white shadow text-sm font-semibold text-gray-700">
                Beerwah
              </div>
            </div>

            {/* Left – Pattan */}
            <div className="absolute left-[8%] top-1/2 -translate-y-1/2 z-20">
              <div className="!px-4 !py-1 rounded-full bg-white shadow text-sm font-semibold text-gray-700">
                Pattan
              </div>
            </div>

            {/* Top – Narbal */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20">
              <div className="!px-4 !py-1 rounded-full bg-white shadow text-sm font-semibold text-gray-700">
                Narbal
              </div>
            </div>

            {/* Bottom – Kunzer (MOVED UP) */}
            <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 z-20">
              <div className="!px-4 py-1 rounded-full bg-white shadow text-sm font-semibold text-gray-700">
                Kunzer
              </div>
            </div>

            {/* ✅ FAST DELIVERY BADGE (FIXED & ALWAYS VISIBLE) */}
            <div className="absolute bottom-4 w-full flex justify-center z-30">
              <span className="!px-6 !py-2 rounded-full bg-[#ff5252] text-white text-sm sm:text-base font-bold shadow-xl">
                FAST DELIVERY IN THIS AREA
              </span>
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
