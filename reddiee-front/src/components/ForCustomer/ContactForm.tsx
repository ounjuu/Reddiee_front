"use client";

import React, { useState } from "react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 Axios 등으로 백엔드 API 요청 가능
    console.log({ name, email, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white p-6 rounded-lg border mt-[5px]"
    >
      {submitted && (
        <p className="mb-4 text-green-600 font-semibold">
          문의가 정상적으로 제출되었습니다.
        </p>
      )}
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
