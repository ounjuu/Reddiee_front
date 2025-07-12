"use client";

import { useUserStore } from "@/stores/useUserStore";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "로그인 실패");
        return;
      }

      const data = await res.json();

      Cookies.set("access_token", data.access_token, { expires: 1, path: "/" });
      useUserStore.getState().setUser(data.user);
      console.log(data.user, "data.user?");
      console.log(useUserStore.getState().user);
      alert("로그인 성공!");
      if (data.user.role === "admin") {
        router.push("/admin/chat");
      } else {
        router.push("/");
      }
    } catch {
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-12">
      <form
        onSubmit={onSubmit}
        style={{
          maxWidth: 400,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          value={form.email}
          onChange={onChange}
          style={{ padding: 8, fontSize: 16 }}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          value={form.password}
          onChange={onChange}
          style={{ padding: 8, fontSize: 16 }}
        />
        <button
          type="submit"
          style={{ padding: 10, fontSize: 16, cursor: "pointer" }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
