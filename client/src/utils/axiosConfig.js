import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Ví dụ: http://localhost:8000
  withCredentials: true, // ⚡ Bắt buộc để gửi cookie
});

export default axiosInstance;
