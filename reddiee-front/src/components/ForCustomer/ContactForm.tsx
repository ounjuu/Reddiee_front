"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance"; // 상대경로 확인
import { useUserStore } from "@/stores/useUserStore";

const ContactForm = () => {
  const { user } = useUserStore(); // 로그인 정보
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/inquiries", {
        name,
        email,
        category,
        message,
      });

      setSubmitted(true);
      alert("문의가 정상적으로 제출되었습니다.");

      // 초기화
      setName("");
      setEmail("");
      setCategory("");
      setMessage("");
    } catch (error: any) {
      console.error(error);
      alert("문의 제출 중 오류가 발생했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white p-6 rounded-lg border mt-[5px] text-sm"
    >
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">문의 카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          required
        >
          <option value="">카테고리를 선택해주세요</option>
          <option value="product">상품 관련</option>
          <option value="order">주문 관련</option>
          <option value="payment">결제 관련</option>
          <option value="delivery">배송 관련</option>
          <option value="exchange">교환/반품/환불</option>
          <option value="account">회원/계정 관련</option>
          <option value="etc">기타</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">문의사항</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          rows={5}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-reddieetext text-white px-4 py-2 rounded-md transition"
      >
        제출
      </button>
    </form>
  );
};

export default ContactForm;
