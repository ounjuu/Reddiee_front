"use client";

import { useEffect } from "react";
import HomePage from "@/components/Home/HomePage";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axiosInstance";
import axiosPublic from "@/lib/axiosPublic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);
  useEffect(() => {
    // 백엔드 연결 확인
    axiosPublic
      .get(`${API_URL}/api/health`, { withCredentials: true })
      .then((res) => console.log("백엔드 연결:", res.data))
      .catch((err) => console.error("백엔드 연결 실패:", err));

    // 로그인 유지용 유저 정보 요청
    const fetchUser = async () => {
      const token = Cookies.get("access_token");

      try {
        const res = await axiosInstance.get(`${API_URL}/auth/me`);
        setUser(res.data);
      } catch (error) {
        clearUser(); // ✅ 로그인 안 되어 있음
        console.log("로그인 유지 실패:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-2xl font-bold">
        <HomePage />
      </h1>
    </div>
  );
}
