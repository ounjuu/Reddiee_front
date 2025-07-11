"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";

export default function AdminPage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!user) {
        const token = Cookies.get("access_token");
        if (!token) {
          router.push("/login");
          return;
        }
        // 백엔드에 토큰 보내서 유저 정보 받아오기
        try {
          const res = await fetch("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("인증 실패");
          const userData = await res.json();
          setUser(userData);

          if (userData.role !== "admin") {
            router.push("/403");
          }
        } catch {
          router.push("/login");
        }
      } else {
        if (user.role !== "admin") {
          router.push("/403");
        }
      }
    }
    fetchUser();
  }, [user, router, setUser]);

  if (!user || user.role !== "admin") return <div>권한 검사 중...</div>;

  return <div>관리자 전용 페이지 콘텐츠</div>;
}
