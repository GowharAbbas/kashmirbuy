import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import ProductsSlider from "../../components/ProductsSlider";
import ProductZoom from "../../components/ProductZoom";
import ProductDetailRight from "../../components/ProductDetailRight";
import { fetchDataFromApi } from "../../utils/api";

const ProductDetails = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Fetch single product
  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const res = await fetchDataFromApi(`/api/product/${id}`);
      if (res?.success) {
        setProduct(res.product);
        if (res.product?.catName) {
          fetchRelated(res.product.catName, res.product._id);
        }
      }
    } catch (err) {
      console.log("Product fetch error:", err);
    } finally {
      setLoadingProduct(false);
    }
  };

  // Fetch related products
  const fetchRelated = async (catName, currentId) => {
    try {
      setLoadingRelated(true);
      const res = await fetchDataFromApi(
        `/api/product/getAllProductsByCatName?catName=${encodeURIComponent(
          catName
        )}`
      );
      if (res?.success) {
        const filtered = (res.products || []).filter(
          (p) => p._id !== currentId
        );
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.log("Related products error:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const descriptionText =
    product?.description ||
    "No description available for this product at the moment.";

  return (
    <>
      {/* ---------- BREADCRUMBS ---------- */}
      <div className="bg-white border-b border-gray-100 !mt-8">
        <div className="container !py-2 !px-3 md:!px-0">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="!text-[13px] md:!text-[14px] link">
              Home
            </Link>
            {product?.catName && (
              <span className="!text-[13px] md:!text-[14px] text-gray-500">
                {product.catName}
              </span>
            )}
            <p className="text-[#ff5252] font-[600] !text-[13px] md:!text-[14px] truncate max-w-[120px] md:max-w-[240px]">
              {product?.name || "Product"}
            </p>
          </Breadcrumbs>
        </div>
      </div>

      {/* ---------- MAIN PRODUCT SECTION ---------- */}
      <section className="bg-white !py-5 !pt-6 md:!pt-8">
        <div className="container flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* LEFT: IMAGE ZOOM */}
          <div className="productZoomContainer w-full lg:w-[45%]">
            {loadingProduct ? (
              <div className="w-full h-[260px] md:h-[420px] bg-gray-100 animate-pulse rounded-md" />
            ) : (
              <ProductZoom images={product?.images || []} />
            )}
          </div>

          {/* RIGHT: PRODUCT CONTENT */}
          <div className="productContent w-full lg:w-[55%] lg:!pr-10 !mt-2">
            {loadingProduct ? (
              <div className="space-y-3">
                <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                <div className="h-8 bg-gray-100 rounded w-1/3 animate-pulse" />
                <div className="h-20 bg-gray-100 rounded w-full animate-pulse" />
              </div>
            ) : (
              <ProductDetailRight product={product} />
            )}
          </div>
        </div>

        {/* ---------- TABS SECTION ---------- */}
        <div className="container !mt-8">
          <div className="flex flex-wrap items-center gap-5 !mb-5 border-b border-gray-200 !pb-2">
            <span
              className={`link text-[15px] md:text-[17px] cursor-pointer font-[500] ${
                activeTab === 0 && "text-[#ff5252]"
              }`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>

            <span
              className={`link text-[15px] md:text-[17px] cursor-pointer font-[500] ${
                activeTab === 1 && "text-[#ff5252]"
              }`}
              onClick={() => setActiveTab(1)}
            >
              Product Details
            </span>

            {/* ---------------------------- */}
            {/* ❌ REVIEWS TAB REMOVED HERE */}
            {/* 
            <span
              className={`link text-[15px] md:text-[17px] cursor-pointer font-[500] ${
                activeTab === 2 && "text-[#ff5252]"
              }`}
              onClick={() => setActiveTab(2)}
            >
              Reviews (5)
            </span>
            */}
            {/* ---------------------------- */}
          </div>

          {/* TAB 0 : DESCRIPTION */}
          {activeTab === 0 && (
            <div className="shadow-md w-full !py-5 !px-5 md:!px-8 rounded-md text-[14px] leading-relaxed text-gray-700 space-y-3">
              <p>{descriptionText}</p>

              {product?.brand && (
                <>
                  <h4 className="font-semibold !mt-3">Brand</h4>
                  <p>{product.brand}</p>
                </>
              )}

              {product?.size && (
                <>
                  <h4 className="font-semibold !mt-3">Available Sizes</h4>
                  {/* <p>
                    {Array.isArray(product.size)
                      ? product.size.join(", ")
                      : product.size}
                  </p> */}
                  <p className="!mt-2">All Sizes Available</p>
                </>
              )}
            </div>
          )}

          {/* TAB 1 : PRODUCT DETAILS TABLE */}
          {activeTab === 1 && (
            <div className="shadow-md w-full !py-5 !px-3 md:!px-8 rounded-md overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="!px-6 !py-3">Attribute</th>
                    <th className="!px-6 !py-3">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product?.brand && (
                    <tr className="bg-white border-b">
                      <td className="!px-6 !py-3 font-[500]">Brand</td>
                      <td className="!px-6 !py-3">{product.brand}</td>
                    </tr>
                  )}

                  {product?.catName && (
                    <tr className="bg-white border-b">
                      <td className="!px-6 !py-3 font-[500]">Category</td>
                      <td className="!px-6 !py-3">{product.catName}</td>
                    </tr>
                  )}

                  {product?.subCat && (
                    <tr className="bg-white border-b">
                      <td className="!px-6 !py-3 font-[500]">Sub Category</td>
                      <td className="!px-6 !py-3">{product.subCat}</td>
                    </tr>
                  )}

                  {product?.thirdSubCat && (
                    <tr className="bg-white border-b">
                      <td className="!px-6 !py-3 font-[500]">
                        Third Level Category
                      </td>
                      <td className="!px-6 !py-3">{product.thirdSubCat}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ------------------------------------- */}
          {/* ❌ ENTIRE REVIEWS SECTION COMMENTED */}
          {/* 
          {activeTab === 2 && (
             ... FULL REVIEWS BLOCK ...
          )}
          */}
          {/* ------------------------------------- */}
        </div>

        {/* ---------- RELATED PRODUCTS ---------- */}
        <div className="container !pt-8 !pb-6">
          <h2 className="text-[18px] md:text-[20px] font-[600] mb-2">
            Related Products
          </h2>

          {loadingRelated ? (
            <p className="text-gray-400 text-sm !py-4">
              Loading related products...
            </p>
          ) : (
            <ProductsSlider products={relatedProducts} />
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
