/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../Footer.js";
import "../../full.css";
import ImageWithFallback from "./ImageWithFallback.js";
import axios from "axios"; 

const BASE_URL = "http://localhost:8000"; // 🛠 BACKEND URL chuẩn

const Drinks = () => {
  const [drinkList, setDrinkList] = useState([]);
  const [search, setSearch] = useState("");
  const [displayedItems, setDisplayedItems] = useState(8);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/foods`);
        if (data && data.success) {
          const drinks = data.foods.filter((item) => item.category.toLowerCase() === "drink");
          setDrinkList(drinks);
          setDisplayedItems(8);
          setAllLoaded(drinks.length <= 8);
        }
      } catch (error) {
        console.error("Lỗi khi lấy đồ uống:", error);
        toast.error("Không thể tải danh sách đồ uống.");
      }
    };

    fetchDrinks();
  }, []);

  const filteredDrinks = drinkList.filter(
    (drink) =>
      drink.name.toLowerCase().includes(search.toLowerCase()) ||
      drink.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setDisplayedItems(8);
    setAllLoaded(filteredDrinks.length <= 8);
  }, [search, filteredDrinks.length]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        setLoading(true);
        setTimeout(() => {
          const nextItems = displayedItems + 4;
          setDisplayedItems(nextItems);
          setLoading(false);

          if (nextItems >= filteredDrinks.length) {
            setAllLoaded(true);
          }
        }, 1000);
      }
    },
    [displayedItems, loading, filteredDrinks.length]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loadingRef.current && !allLoaded) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [handleObserver, allLoaded]);

  const addToCart = (drink) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(
      (item) => item.name === drink.name && item.category === "drink"
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name: drink.name,
        price: drink.price,
        quantity: 1,
        image: `${BASE_URL}/uploads/${drink.image}`,
        category: drink.category,
        origin: drink.origin,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`Đã thêm "${drink.name}" vào giỏ hàng!`);
  };

  return (
    <>
      <div className="luxury-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h1 className="luxury-header">
                <span className="luxury-header-accent-blue">Đồ Uống</span> Giải Khát
              </h1>
              <p className="luxury-subtitle">
                Khám phá các loại đồ uống thơm ngon của chúng tôi
              </p>
            </div>

            <div className="w-full md:w-1/3 relative">
              <input
                type="text"
                placeholder="Tìm kiếm đồ uống..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="luxury-search"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="luxury-search-icon"
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
            </div>
          </div>

          {filteredDrinks.length === 0 ? (
            <div className="luxury-not-found">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="luxury-not-found-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <p className="luxury-not-found-text">
                Không tìm thấy đồ uống phù hợp với từ khóa "{search}"
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredDrinks.slice(0, displayedItems).map((drink, idx) => (
                  <div
                    key={idx}
                    className="luxury-card"
                    onClick={() => navigate(`/drinks/${drink._id}`)}
                  >
                    <ImageWithFallback
                      src={`${BASE_URL}/uploads/${drink.image}`} 
                      alt={drink.name}
                      category="drink"
                    />
                    <div className="luxury-card-content">
                      <h2 className="luxury-product-name">{drink.name}</h2>
                      <p className="luxury-product-desc">{drink.description}</p>
                      <div className="luxury-card-footer">
                        <p className="luxury-price-blue">
                          {drink.price.toLocaleString()} VNĐ
                        </p>
                        <button
                          className="luxury-button-blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(drink);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div ref={loadingRef}>
                {loading && (
                  <div className="text-center py-6">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {allLoaded && filteredDrinks.length > 0 && (
                  <div className="luxury-end-results">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="luxury-end-results-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="luxury-end-results-text">
                      Bạn đã xem tất cả đồ uống
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Drinks;
