"use client";
import { useState } from "react";
import { Titan_One } from "next/font/google";

const titanOne = Titan_One({
  subsets: ["latin"], // 라틴 문자 지원
  weight: "400", // Titan One은 보통 400(regular)만 있음
  variable: "--font-titan-one",
});

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="text-primary">
      {/* 흘러가기 */}
      <div className="Header_eventFlow"></div>

      {/* 메뉴바 */}
      <div className="Header_nav flex justify-between items-center px-5 py-6 text-reddieetext backdrop-blur">
        {/* 왼쪽 - 햄버거 버튼 */}
        <button
          className="flex flex-col justify-between w-6 h-5 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span
            className={`block h-0.5 bg-reddieetext transition-transform duration-300  ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 bg-reddieetext transition-opacity duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 bg-reddieetext transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </button>

        {/* 가운데 로고 */}
        <div
          className={`text-2xl absolute left-1/2 -translate-x-1/2 cursor-pointer ${titanOne.variable} tracking-wide`}
          style={{ fontFamily: "var(--font-titan-one)" }}
        >
          Reddie
        </div>

        {/* 오른쪽 메뉴 */}
        <div className="flex gap-3 text-sm cursor-pointer">
          <div>Login</div>
          <div>Cart</div>
          <div>My Page</div>
        </div>
      </div>
    </header>
  );
}
