import React, { useEffect, useState, useRef } from "react";
import ProductItem from "../../components/ProductItem";
import { useSearchParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const LIMIT = 12;

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sentinelRef = useRef(null);
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const sub = searchParams.get("sub");
  const third = searchParams.get("third");
  const keyword = searchParams.get("keyword"); // 🔍 added search support

  const buildUrl = (pageNumber) => {
    if (keyword) {
      setTitle(`Search: ${keyword}`);
      return `/api/product/search/${keyword}?page=${pageNumber}&limit=${LIMIT}`;
    }

    if (third) {
      setTitle(third);
      return `/api/product/getAllProductsByThirdSubCatName?thirdSubCat=${third}&page=${pageNumber}&limit=${LIMIT}`;
    }
    if (sub) {
      setTitle(sub);
      return `/api/product/getAllProductsBySubCatName?subCat=${sub}&page=${pageNumber}&limit=${LIMIT}`;
    }
    if (category) {
      setTitle(category);
      return `/api/product/getAllProductsByCatName?catName=${category}&page=${pageNumber}&limit=${LIMIT}`;
    }

    return null;
  };

  const fetchProducts = async (pageNumber) => {
    const url = buildUrl(pageNumber);
    if (!url || isLoading || !hasMore) return;

    setIsLoading(true);
    const res = await fetchDataFromApi(url);

    if (res?.success) {
      const newData = res.products || res.data || [];

      setProducts((prev) => {
        const clean = newData.filter((p) => !prev.find((x) => x._id === p._id));
        return [...prev, ...clean];
      });

      if (newData.length < LIMIT) setHasMore(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [category, sub, third, keyword]);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  return (
    <section className="bg-white !py-6 !mt-4">
      <div className="container">
        <h2 className="text-[20px] sm:text-[22px] font-semibold !mb-4">
          {title} ({products.length})
        </h2>

        {/* No results */}
        {products.length === 0 && !isLoading && (
          <p className="text-center text-gray-500 text-[15px] !py-10">
            ❌ No products found
          </p>
        )}

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((item) => (
            <ProductItem key={item._id} item={item} />
          ))}
        </div>

        {isLoading && hasMore && (
          <p className="text-center !py-3 text-gray-500">Loading more...</p>
        )}

        {!hasMore && products.length > 0 && (
          <p className="text-center !py-4 text-gray-600 text-[15px]">
            🎉 No more products to load
          </p>
        )}

        <div ref={sentinelRef} className="!h-10" />
      </div>
    </section>
  );
};

export default ProductListing;
