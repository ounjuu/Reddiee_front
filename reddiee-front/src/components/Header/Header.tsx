"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Titan_One } from "next/font/google";
import { ShoppingCart, LogIn, User, Shield, LogOut } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
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
  // 로그인 정보
  const { user, clearUser } = useUserStore();

  const clickMain = () => {
    router.push("/");
  };

  const handleLogout = () => {
    clearUser();
    alert("로그아웃 되었습니다.");
    router.push("/"); // 홈으로 이동하거나 필요에 따라 로그인 페이지로 이동
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
            {user?.role === "admin" && (
              <div onClick={() => router.push("/admin/chat")}>Admin</div>
            )}
            {user ? (
              <div onClick={handleLogout}>Logout</div>
            ) : (
              <div onClick={() => router.push("/login")}>Login</div>
            )}
            <div onClick={() => router.push("/cart")}>Cart</div>
            <div onClick={() => router.push("/mypage")}>My Page</div>
          </div>

          {/* 아이콘 메뉴 (sm 미만에서만 보임) */}
          <div className="flex sm:hidden gap-2 text-reddieetext cursor-pointer">
            {user?.role === "admin" && (
              <Shield size={16} onClick={() => router.push("/admin/chat")} />
            )}
            {user ? (
              <LogOut size={16} onClick={handleLogout} />
            ) : (
              <LogIn size={16} onClick={() => router.push("/login")} />
            )}
            <ShoppingCart size={16} onClick={() => router.push("/cart")} />
            <User size={16} onClick={() => router.push("/mypage")} />
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
