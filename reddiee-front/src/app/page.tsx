"use client";

import { useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  useEffect(() => {
    axios
      .get(`${API_URL}/api/health`, { withCredentials: true })
      .then((res) => console.log("백엔드 연결:", res.data))
      .catch((err) => console.error("백엔드 연결 실패:", err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">홈 페이지입니다</h1>
    </div>
  );
}
