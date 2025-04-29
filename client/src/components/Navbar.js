import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AppContent } from "../contexts/AppContext.js";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const searchBoxRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý click ra ngoài để ẩn kết quả tìm kiếm
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();

    // Lắng nghe sự thay đổi trong localStorage
    window.addEventListener("storage", updateCartCount);

    // Kiểm tra mỗi 2 giây để cập nhật giỏ hàng khi thay đổi từ tab khác
    const interval = setInterval(updateCartCount, 2000);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Hàm tìm kiếm nâng cao - CHỈ TÌM THEO TÊN
  // Phần handleSearch:
const handleSearch = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  if (query.length > 1) {
    setLoadingSearch(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/foods`);
      if (data && data.success) {
        const allFoods = data.foods;

        // Tìm kiếm theo name
        const results = allFoods.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  } else {
    setSearchResults([]);
  }
};


  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-lg bg-white"
          : "bg-gradient-to-b from-yellow-50 to-orange-50"
      }`}
    >
      {/* Top navbar section */}
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="h-14 w-auto drop-shadow-md cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* SearchGlobal */}
        <div className="hidden md:block w-[40%] relative" ref={searchBoxRef}>
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Tìm kiếm món ăn theo tên..."
              className="border border-orange-200 bg-white/80 backdrop-blur-sm rounded-full pl-10 pr-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-md"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-orange-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {loadingSearch && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="animate-spin h-4 w-4 text-orange-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <div className="p-2 bg-orange-50 text-sm text-gray-700 font-medium border-b border-orange-100">
                Tìm thấy {searchResults.length} kết quả
              </div>

              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-2 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    if (item.category === "food") {
                      navigate(`/foods/${item._id}`);
                    } else if (item.category === "drink") {
                      navigate(`/drinks/${item._id}`);
                    } else if (item.category === "dessert") {
                      navigate(`/desserts/${item._id}`);
                    }
                    setSearchResults([]);
                    setSearchQuery("");
                  }}
                >
                  <div className="w-14 h-14 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                  <img
  src={`http://localhost:8000/uploads/${item.image}`}
  alt={item.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default-food.jpg";
  }}
/>
                  </div>

                  <div className="ml-3 flex-1">
                    <h2 className="text-base font-medium text-gray-800">
                      {item.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 ${
                          item.category === "food"
                            ? "bg-orange-100 text-orange-700"
                            : item.category === "drink"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
                        } rounded-md`}
                      >
                        {item.category === "food"
                          ? "Món ăn"
                          : item.category === "drink"
                          ? "Đồ uống"
                          : "Tráng miệng"}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {item.price?.toLocaleString()} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {searchResults.length > 5 && (
                <div
                  className="p-2 text-center text-sm text-orange-600 hover:underline cursor-pointer bg-orange-50"
                  onClick={() => {
                    navigate(`/search?q=${searchQuery}`);
                    setSearchResults([]);
                  }}
                >
                  Xem tất cả kết quả
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auth/User & Cart */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <div className="relative">
            <button
              onClick={() => {
                if (userData) {
                  navigate("/cart");
                } else {
                  toast.error("Bạn cần đăng nhập để xem giỏ hàng!");
                  navigate("/login");
                }
              }}
              className="p-1.5 hover:bg-orange-50 rounded-full transition-colors"
            >
              <svg
                className="h-5 w-5 text-orange-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>

          {/* Auth/User */}
          {userData ? (
            <div className="relative group">
              <div className="w-8 h-8 flex justify-center items-center rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-colors cursor-pointer">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="font-semibold">
                    {userData.name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute hidden group-hover:block top-full right-0 z-10 min-w-[160px] mt-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {userData.email}
                    </p>
                  </div>
                  <ul className="py-1">
                    {!userData.isAccountVerified && (
                      <li className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer">
                        Verify email
                      </li>
                    )}
                    <li
                      onClick={logout}
                      className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        ></path>
                      </svg>
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 border border-orange-500 bg-orange-500 text-white rounded-full px-6 py-2 hover:bg-orange-600 hover:border-orange-600 transition-all"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
              </svg>
              Đăng nhập
            </NavLink>
          )}
        </div>
      </div>

      {/* Category navigation */}
      <div
        className={`${
          scrolled
            ? "bg-gradient-to-r from-orange-400 to-red-400"
            : "bg-gradient-to-r from-orange-500 to-red-500"
        } shadow-sm transition-colors duration-300`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex justify-center space-x-1 py-2.5 overflow-x-auto no-scrollbar">
            <NavLink
              to="/foods"
              className={({ isActive }) =>
                `flex items-center justify-center px-3 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white/25 text-white font-medium shadow-inner"
                    : "text-white hover:bg-white/15 font-medium"
                }`
              }
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 11s.3-2.2-3-4c-3.1 1.8-3 4-3 4m6 4v3c0 1.1-.9 2-2 2H9a2 2 0 01-2-2v-3" />
                <path d="M12 19v4m-2-2h4M3 11h18M5 11V7c0-1.1.9-2 2-2h10a2 2 0 012 2v4" />
              </svg>
              <span className="text-sm whitespace-nowrap">Thức ăn</span>
            </NavLink>

            {/* Đồ uống */}
            <NavLink
              to="/drinks"
              className={({ isActive }) =>
                `flex items-center justify-center px-3 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white/25 text-white font-medium shadow-inner"
                    : "text-white hover:bg-white/15 font-medium"
                }`
              }
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2h8M9 2v2.789a4 4 0 01-.672 2.219l-.656.984A4 4 0 007 10.212V20a2 2 0 002 2h6a2 2 0 002-2v-9.789a4 4 0 00-.672-2.219l-.656-.984A4 4 0 0015 4.788V2" />
              </svg>
              <span className="text-sm whitespace-nowrap">Đồ uống</span>
            </NavLink>

            <NavLink
              to="/desserts"
              className={({ isActive }) =>
                `flex items-center justify-center px-3 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white/25 text-white font-medium shadow-inner"
                    : "text-white hover:bg-white/15 font-medium"
                }`
              }
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a6 6 0 00-6 6c0 1.5 1 3 2 4l2 2c1 1 2 2.5 2 4a6 6 0 006-6c0-1.5-1-3-2-4l-2-2c-1-1-2-2.5-2-4z" />
                <path d="M6 14c-2 1-3 3.5-3 6h18c0-2.5-1-5-3-6" />
              </svg>
              <span className="text-sm whitespace-nowrap">Tráng miệng</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
