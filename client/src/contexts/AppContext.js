import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosConfig.js"; 
export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/auth/is-auth");
  
      if (data.success) {
        setIsLoggedin(true);
        setUserData(data.userData);
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error("Error checking auth state:", error.message);
      setIsLoggedin(false);
    }
  }, []);
  

  const getUserData = async () => {
    try {
      const { data } = await axiosInstance.get("/api/user/data");
  
      if (data.success) {
        setUserData(data.userData);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      toast.error(error.response?.data?.message || "Lỗi lấy thông tin user");
      return false;
    }
  };
  
  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
