"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import MyPage from "@/components/MyPage/MyPage";

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // 로그인 상태 확인 API
        await axiosInstance.get("/auth/me");
        setIsLoading(false);
      } catch (error) {
        console.error("로그인 상태가 아닙니다:", error);
        router.push("/login");
      }
    };

    checkLogin();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-[100px]">
      <MyPage />
    </div>
  );
}
