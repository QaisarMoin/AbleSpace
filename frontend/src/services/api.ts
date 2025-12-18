import axios from "axios";

const api = axios.create({
  baseURL: "https://ablespace-xyiu.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response.data);
      // Redirect to login if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
