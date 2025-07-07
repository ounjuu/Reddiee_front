"use client";
import { useState } from "react";
import { Nanum_Gothic } from "next/font/google";

const nanumGothic = Nanum_Gothic({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-nanum-gothic",
});

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFooter = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`w-screen text-reddieetext text-xs ${
        nanumGothic.variable
      } text-center backdrop-blur pt-8 pb-6 relative fixed bottom-0 left-0 transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ fontFamily: "var(--font-nanum-gothic)" }}
    >
      <div
        className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        onClick={toggleFooter}
      >
        <img src="/cherry.png" className="w-9"></img>
      </div>
      <span>
        <b>COMPANY :</b> 레디(REDDIEE)
        <br /> <b>CEO :</b> 김은주
        <br /> <b>본사주소 :</b> 서울특별시 관악구
        <br />
        <b>BUSINESS LICENSE NUMBER :</b> 123-45-67890
        <br />
        <b>MAIL ORDER LICENSE NUMBER :</b> 2025-서울관악-0001
        <br />
        <b>CONTACT :</b> https://github.com/ounjuu
      </span>
    </div>
  );
}
