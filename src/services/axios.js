import axios from "axios";
import { getCookie } from "@/utils/cookies";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Intercepta requisições e adiciona o token
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;