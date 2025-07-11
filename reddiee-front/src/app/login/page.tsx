"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

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
      alert("로그인 성공!");
      console.log("토큰:", data.access_token);
      // 토큰 저장 및 인증 상태 처리 필요
      Cookies.set("access_token", data.access_token, { expires: 1, path: "/" });
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
