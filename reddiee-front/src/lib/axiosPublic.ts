// lib/axiosPublic.ts
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 5000,
});

export default axiosPublic;
