"use client";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="text-reddieetext">
      {/* 흘러가기 */}
      <div className="Header_eventFlow"></div>

      {/* 메뉴바 */}
      <div className="Header_nav flex justify-between items-center px-4 py-2 text-reddieetext">
        {/* 왼쪽 - 햄버거 버튼 */}
        <button
          className="flex flex-col justify-between w-6 h-5"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span
            className={`block h-0.5 bg-black transition-transform duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 bg-black transition-opacity duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 bg-black transition-transform duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          />
        </button>

        {/* 가운데 로고 */}
        <div className="text-lg font-bold absolute left-1/2 -translate-x-1/2">
          REDDIEE
        </div>

        {/* 오른쪽 메뉴 */}
        <div className="flex gap-3 text-sm">
          <div>Login</div>
          <div>Cart</div>
          <div>My Page</div>
        </div>
      </div>
    </header>
  );
}
