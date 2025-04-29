/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets.js";
import { AppContent } from "../../contexts/AppContext.js";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig.js";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Login"); // 👈 Mặc định là "Login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      let response;
      if (state === "Sign Up") {
        response = await axiosInstance.post("/api/auth/register", {
          name,
          email,
          password,
        });
      } else {
        response = await axiosInstance.post("/api/auth/login", {
          email,
          password,
        });
      }

      if (response.data.success) {
        toast.success(
          state === "Sign Up" ? "Đăng ký thành công!" : "Đăng nhập thành công!"
        );

        const success = await getUserData(); // 👉 CHỜ getUserData xong

        if (success) {
          setIsLoggedin(true);
          navigate("/"); // 👉 Chỉ navigate nếu getUserData OK
        } else {
          toast.error(
            "Đăng nhập thành công nhưng không lấy được thông tin user!"
          );
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during login/register:", error.message);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi server!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account to get started"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none w-full text-white"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-white"
              required
            />
          </div>

          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium text-lg hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300"
          >
            {state === "Sign Up" ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-6">
          {state === "Sign Up" ? (
            <>
              Đã có tài khoản?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-400 cursor-pointer underline"
              >
                Đăng nhập tại đây
              </span>
            </>
          ) : (
            <>
              Chưa có tài khoản?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
              >
                Đăng ký tại đây
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
