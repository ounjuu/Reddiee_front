"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";

// 관리자 챗 컴포넌트
import ProductList from "@/components/ProductList/ProductList";

export default function AdminPage() {
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
      <div className="flex justify-center items-center h-screen">
        권한 검사 중...
      </div>
    );

  return (
    <div className="flex justify-center items-center h-screen">
      <ProductList />
    </div>
  );
}
