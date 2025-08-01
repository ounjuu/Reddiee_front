"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";

import ProductAdd from "@/components/ProductAdd/ProductAdd";

export default function AddProduct() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("access_token");
      // 토큰이 없다면 로그인 페이지로
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("인증 실패");

        const userData = await res.json();
        setUser(userData);

        // admin이 아니면 403
        if (userData.role !== "admin") {
          router.replace("/403");
          return;
        }

        setLoading(false);
      } catch (err) {
        router.replace("/login");
      }
    }

    // zustand에 유저가 없을 때만 fetch
    if (!user) {
      fetchUser();
    } else {
      if (user.role !== "admin") {
        router.replace("/");
      } else {
        setLoading(false);
      }
    }
  }, [user, setUser, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700 font-semibold">
            권한 검사 중입니다...
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex justify-center pt-[100px]">
      <ProductAdd />
    </div>
  );
}
