import axios from "axios";

const api = axios.create({
  baseURL: "https://learnly-backend-05ix.onrender.com",
  //baseURL: 'https://admin-website-backend.onrender.com',
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
