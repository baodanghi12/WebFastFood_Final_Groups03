import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/auth/Home.jsx";
import Navbar from "./components/Navbar.js";
import Login from "./pages/auth/Login.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import EmailVeriFy from "./pages/auth/EmailVeriFy.jsx";
import Foods from "./components/navbar/foods.js";
import Drinks from "./components/navbar/drinks.js";
import Desserts from "./components/navbar/desserts.js";
import FoodDetail from "./components/navbar/FoodDetail.js";
import Cart from "./pages/auth/Cart.jsx";

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        {/* Các route không dùng layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVeriFy />} />

        {/* Các route dùng layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/foods"
          element={
            <MainLayout>
              <Foods />
            </MainLayout>
          }
        />
        <Route
          path="/drinks"
          element={
            <MainLayout>
              <Drinks />
            </MainLayout>
          }
        />
        <Route
          path="/desserts"
          element={
            <MainLayout>
              <Desserts />
            </MainLayout>
          }
        />
        <Route
          path="/foods/:id"
          element={
            <MainLayout>
              <FoodDetail />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
