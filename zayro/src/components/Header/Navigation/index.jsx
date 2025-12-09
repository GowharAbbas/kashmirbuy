import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../../utils/api";

const Navigation = () => {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [openSubcategoryId, setOpenSubcategoryId] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchDataFromApi("/api/category");
        if (res?.success) setCategories(res.data);
      } catch (err) {
        console.log("Navigation category fetch error:", err);
      }
    };
    loadCategories();
  }, []);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  const handleToggleCategory = (id) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
    setOpenSubcategoryId(null);
  };

  const handleToggleSubcategory = (id) => {
    setOpenSubcategoryId((prev) => (prev === id ? null : id));
  };

  // 🔥 Close menu when third category clicked (mobile only)
  const closeMenuOnSelect = () => {
    setMobileOpen(false);
    setOpenCategoryId(null);
    setOpenSubcategoryId(null);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="w-full max-w-6xl mx-auto !px-2">
        {/* ---------------- MOBILE ---------------- */}
        <div className="flex items-center justify-between md:hidden !py-2">
          <button
            onClick={toggleMobileMenu}
            className="!p-2 !m-auto rounded-md border border-gray-300 text-xs font-semibold"
          >
            {mobileOpen ? "Close" : "Browse Categories"}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden !pb-2 space-y-1">
            {categories.map((cat) => {
              const isCatOpen = openCategoryId === cat._id;

              return (
                <div
                  key={cat._id}
                  className="border border-gray-200 rounded-md overflow-hidden"
                >
                  {/* First Level (Not Clickable) */}
                  <button
                    onClick={() => handleToggleCategory(cat._id)}
                    className="w-full flex items-center justify-between !px-3 !py-2 text-[12px] font-semibold uppercase tracking-wide"
                  >
                    {cat.name}
                    <span className="text-[10px]">{isCatOpen ? "−" : "+"}</span>
                  </button>

                  {/* Second Level */}
                  {isCatOpen && cat.Children?.length > 0 && (
                    <div className="bg-gray-50 border-t border-gray-200">
                      {cat.Children.map((sub) => {
                        const isSubOpen = openSubcategoryId === sub._id;

                        return (
                          <div
                            key={sub._id}
                            className="border-b border-gray-100"
                          >
                            <button
                              onClick={() => handleToggleSubcategory(sub._id)}
                              className="w-full flex items-center justify-between !px-5 !py-2 text-[11px] font-medium"
                            >
                              {sub.name}
                              {sub.Children?.length > 0 && (
                                <span className="text-[10px]">
                                  {isSubOpen ? "▲" : "▼"}
                                </span>
                              )}
                            </button>

                            {/* 👉 Third Level (Clickable) */}
                            {isSubOpen && sub.Children?.length > 0 && (
                              <div className="!pl-8 !pr-3 !pb-2 space-y-1">
                                {sub.Children.map((third) => (
                                  <Link
                                    key={third._id}
                                    to={`/productListing?third=${third.name}`}
                                    className="block text-[12px] py-1 hover:text-[#ff5252]"
                                    onClick={closeMenuOnSelect}
                                  >
                                    {third.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- DESKTOP ---------------- */}
        <div className="hidden md:flex justify-center !m-auto w-full !py-2">
          <ul className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <li key={cat._id} className="relative list-none group">
                {/* First Level (Not Clickable) */}
                <Button className="!text-[13px] !font-bold !py-3 !px-3 !normal-case !text-[rgba(0,0,0,0.7)] group-hover:!text-[#ff5252]">
                  {cat.name.toUpperCase()}
                </Button>

                {/* Dropdown */}
                {cat.Children?.length > 0 && (
                  <div className="absolute top-full left-0 !mt-1 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[160px]">
                    <ul>
                      {cat.Children.map((sub) => (
                        <li key={sub._id} className="relative group/sub">
                          <Button className="!w-full text-left !px-4 !py-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-[13px] hover:!text-[#ff5252] hover:!bg-gray-50">
                            {sub.name}
                          </Button>

                          {/* 👉 Third Level (Clickable) */}
                          {sub.Children?.length > 0 && (
                            <div className="absolute top-0 left-full ml-1 bg-white shadow-lg rounded-md opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all z-50 min-w-[160px]">
                              {sub.Children.map((third) => (
                                <Link
                                  key={third._id}
                                  to={`/productListing?third=${third.name}`}
                                >
                                  <Button className="!w-full !px-4 !py-2 !rounded-none !text-[rgba(0,0,0,0.8)] !text-[13px] hover:!bg-gray-100 hover:!text-[#ff5252]">
                                    {third.name}
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
