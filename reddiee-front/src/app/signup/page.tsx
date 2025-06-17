"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    nickName: "",
    phone: "",
    gender: "",
    password: "", // ✅ 추가
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("회원가입 성공!");
      setForm({
        email: "",
        nickName: "",
        phone: "",
        gender: "",
        password: "", // ✅ 초기화
      });
    } else {
      alert("오류 발생");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <input
        name="email"
        value={form.email}
        onChange={onChange}
        placeholder="이메일"
        type="email"
        required
      />
      <input
        name="nickName"
        value={form.nickName}
        onChange={onChange}
        placeholder="닉네임"
        required
      />
      <input
        name="phone"
        value={form.phone}
        onChange={onChange}
        placeholder="전화번호"
      />
      <select name="gender" value={form.gender} onChange={onChange}>
        <option value="">성별 선택</option>
        <option value="male">남자</option>
        <option value="female">여자</option>
      </select>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={onChange}
        placeholder="비밀번호"
        required // ✅ 필수
      />
      <button type="submit">회원가입</button>
    </form>
  );
}
