"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Titan_One } from "next/font/google";
import { ShoppingCart, LogIn, User } from "lucide-react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import Link from "next/link";

const titanOne = Titan_One({
  subsets: ["latin"], // 라틴 문자 지원
  weight: "400",
  variable: "--font-titan-one",
});

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const clickMain = () => {
    router.push("/");
  };

  return (
    <header
      className="text-primary z-0 fixed top-0 left-0 w-screen"
      ref={menuRef}
    >
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
          onClick={clickMain}
        >
          Reddie
        </div>

        <div className="flex items-center gap-3 sm:pr-5">
          {/* 텍스트 메뉴 (sm 이상에서만 보임) */}
          <div className="hidden sm:flex gap-3 text-sm cursor-pointer">
            <div onClick={() => router.push("/login")}>Login</div>
            <div>Cart</div>
            <div>My Page</div>
          </div>

          {/* 아이콘 메뉴 (sm 미만에서만 보임) */}
          <div className="flex sm:hidden gap-2 text-reddieetext cursor-pointer">
            <LogIn size={16} onClick={() => router.push("/login")} />
            <ShoppingCart size={16} />
            <User size={16} />
          </div>
        </div>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
    fixed top-0 left-0 h-full w-64 bg-reddieetext text-white z-49
    transform transition-transform duration-300 ease-in-out flex justify-start items-start px-3 py-24 
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    
  `}
      >
        <div className="p-4 flex flex-col justify-between items-start gap-4 cursor-pointer">
          <Link href="/category/caps">
            <span className="text-lg font-bold hover:text-red-500 cursor-pointer">
              Caps
            </span>
          </Link>
          <Link href="/category/bags">
            <span className="text-lg font-bold hover:text-red-500 cursor-pointer">
              Bags
            </span>
          </Link>
          <Link href="/category/apparel">
            <span className="text-lg font-bold hover:text-red-500 cursor-pointer">
              Apparel
            </span>
          </Link>
          <Link href="/category/acc">
            <span className="text-lg font-bold hover:text-red-500 cursor-pointer">
              ACC
            </span>
          </Link>
          <Link href="/customer">
            <span className="text-lg font-bold hover:text-red-500 cursor-pointer">
              For Customer
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
