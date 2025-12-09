import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch suggestions while typing
  const fetchSuggestions = async (text) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetchDataFromApi(`/api/product/search/${text}`);

    if (res?.success) {
      setSuggestions(res.data?.slice(0, 5)); // show only top 5
    }
  };

  const handleInput = (e) => {
    const text = e.target.value;
    setQuery(text);
    fetchSuggestions(text);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(query)}`);
    setSuggestions([]);
    setQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative w-[85%] mx-auto !mt-2 z-50">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyPress}
        className="w-full !px-4 !py-2 pr-10 border border-gray-300 rounded-md text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
      />

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600 hover:text-[#ff5252] transition"
      >
        <IoSearch size={20} />
      </button>

      {/* ---- Live Suggestions Dropdown ---- */}
      {suggestions.length > 0 && (
        <div className="absolute w-full bg-white shadow-lg rounded-md !mt-2 !py-2 border border-gray-200 max-h-[180px] overflow-auto">
          {suggestions.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 !px-3 !py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                navigate(`/product/${item._id}`);
                setSuggestions([]);
                setQuery("");
              }}
            >
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="!w-10 !h-10 rounded object-cover"
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}

          {/* Footer Option: See All Results */}
          <div
            className="text-center !py-2 cursor-pointer text-[#ff5252] text-sm border-t hover:bg-gray-50"
            onClick={handleSearch}
          >
            🔍 Show all results for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
