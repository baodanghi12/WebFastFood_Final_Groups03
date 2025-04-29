import React, { useContext, useState, useEffect } from "react";
import { AppContent } from "../../contexts/AppContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const { userData } = useContext(AppContent) || {};
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!userData) {
      toast.error("Bạn cần đăng nhập để xem giỏ hàng!");
      navigate("/login");
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(localCart);
    }
  }, [userData, navigate]);

  const increaseQty = (name, category) => {
    const updatedCart = cartItems.map((item) =>
      item.name === name && item.category === category
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQty = (name, category) => {
    const updatedCart = cartItems.map((item) =>
      item.name === name && item.category === category && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (name, category) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.name === name && item.category === category)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (!userData) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white/50 rounded-2xl shadow-sm backdrop-blur-sm">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-4 border-orange-200">
        Giỏ hàng của bạn
      </h1>

      <div className="bg-orange-50 p-3 rounded-lg mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-orange-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
        <h2 className="text-lg text-gray-700">
          Tổng số sản phẩm:{" "}
          <span className="font-bold text-orange-600">{totalQuantity}</span>
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
          <button
            onClick={() => navigate("/foods")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            Xem món ăn
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.name + item.category}
              className="flex flex-col sm:flex-row items-center border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg mr-4 mb-3 sm:mb-0"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-orange-500 font-medium">
                  {item.price.toLocaleString()} VNĐ
                </p>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {item.category}
                  </span>
                  {item.origin && (
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {item.origin}
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-3 gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
                    onClick={() => decreaseQty(item.name, item.category)}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition"
                    onClick={() => increaseQty(item.name, item.category)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right mt-3 sm:mt-0">
                <p className="text-xl font-bold text-gray-800">
                  {(item.price * item.quantity).toLocaleString()} VNĐ
                </p>
                <button
                  onClick={() => removeItem(item.name, item.category)}
                  className="mt-2 px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-full transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-10 p-6 bg-gray-50 rounded-xl shadow-inner">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600">Tổng tiền:</p>
              <h2 className="text-3xl font-bold text-orange-600">
                {totalAmount.toLocaleString()} VNĐ
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/foods")}
                className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Tiếp tục mua sắm
              </button>
              <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition flex items-center gap-2 shadow-lg shadow-orange-200">
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
