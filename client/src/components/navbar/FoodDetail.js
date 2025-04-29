import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8000"; // ✅ tách riêng

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/foods/${id}`);
        if (data && data.success) {
          setFood(data.food);
          setError(null);
        } else {
          setError("Không tìm thấy món ăn");
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu món ăn:", err);
        setError("Có lỗi xảy ra khi tải món ăn");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFood();
    }
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(
      (item) => item.name === food.name && item.category === food.category
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        name: food.name,
        price: food.price,
        quantity,
        image: food.image ? `${BASE_URL}/uploads/${food.image}` : "/default-food.jpg", // ✅ dùng ảnh backend
        category: food.category,
        origin: food.origin,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`Đã thêm ${quantity} "${food.name}" vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (!food) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm max-w-6xl mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={food.image ? `${BASE_URL}/uploads/${food.image}` : "/default-food.jpg"} // ✅ load ảnh thật
            alt={food.name}
            className="w-full h-80 md:h-full object-cover"
          />
        </div>
        <div className="p-8 md:w-1/2">
          <div className="flex items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                food.category === "food"
                  ? "bg-orange-100 text-orange-600"
                  : food.category === "drink"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-pink-100 text-pink-600"
              }`}
            >
              {food.category}
            </span>
            <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              {food.origin}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">{food.name}</h1>

          <p className="text-gray-600 mb-6">{food.description}</p>

          <div className="flex items-center mb-6">
            <span className="text-2xl font-bold text-orange-500">
              {food.price.toLocaleString()} VNĐ
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Số lượng</label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-l-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                {quantity}
              </div>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-r-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <button
            onClick={addToCart}
            className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
              food.category === "food"
                ? "bg-orange-500 hover:bg-orange-600"
                : food.category === "drink"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
