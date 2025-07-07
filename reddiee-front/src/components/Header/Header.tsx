"use client";
import { useState } from "react";
import { Titan_One } from "next/font/google";

const titanOne = Titan_One({
  subsets: ["latin"], // 라틴 문자 지원
  weight: "400",
  variable: "--font-titan-one",
});

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="text-primary relative z-0">
      {/* 흘러가기 */}
      <div
        className={`overflow-hidden whitespace-nowrap text-reddieetext text-xs py-2 border-b border-reddieetext border-opacity-30 ${
          isOpen ? "" : "backdrop-blur"
        }`}
      >
        <div className="flex animate-marquee w-max tracking-wider">
          {/* 문장 블록 1 */}
          <div className="flex shrink-0 w-1/2 grow-0" aria-hidden="true">
            <span className="px-16">Ready to move? Get geared at reddiee.</span>
            <span className="px-16">Ready to move? Get geared at reddiee.</span>
            <span className="px-16">Ready to move? Get geared at reddiee.</span>
          </div>

          {/* 문장 블록 2 (복제) */}
          <div className="flex shrink-0 w-1/2 grow-0" aria-hidden="true">
            <span className="px-16">Ready to move? Get geared at reddiee.</span>
            <span className="px-16">Ready to move? Get geared at reddiee.</span>
            <span className="px-16">Ready to move? Get geared at reddiee.</span>
          </div>
        </div>
      </div>

      {/* 메뉴바 */}
      <div
        className={`Header_nav flex justify-between items-center px-5 py-6 text-reddieetext relative z-10 ${
          isOpen ? "" : "backdrop-blur"
        }`}
      >
        {/* 왼쪽 - 햄버거 버튼 */}
        <button
          className="flex flex-col justify-between w-6 h-5 cursor-pointer z-50 relative"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span
            className={`block h-0.5 bg-reddieetext transition-transform duration-300 z-50 relative  ${
              isOpen ? "rotate-45 translate-y-2 bg-white" : ""
            }`}
          />
          <span
            className={`block h-0.5 bg-reddieetext transition-opacity duration-300 z-50 relative ${
              isOpen ? "opacity-0 " : ""
            }`}
          />
          <span
            className={`block h-0.5 bg-reddieetext transition-transform duration-300 z-50 relative ${
              isOpen ? "-rotate-45 -translate-y-2.5 bg-white" : ""
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
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
    fixed top-0 left-0 h-full w-64 bg-reddieetext text-white z-49
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    
  `}
      >
        <div className="p-4 flex justify-between items-center">
          <span className="text-lg font-bold"></span>
        </div>
      </div>
    </header>
  );
}
