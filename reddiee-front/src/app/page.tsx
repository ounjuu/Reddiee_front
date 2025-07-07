"use client";

import { useEffect } from "react";
import axios from "axios";
import HomePage from "@/components/Home/HomePage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  useEffect(() => {
    axios
      .get(`${API_URL}/api/health`, { withCredentials: true })
      .then((res) => console.log("백엔드 연결:", res.data))
      .catch((err) => console.error("백엔드 연결 실패:", err));
  }, []);

  return (
    <div className="flex items-center justify-center ">
      <h1 className="text-2xl font-bold">
        <HomePage />
      </h1>
    </div>
  );
}
