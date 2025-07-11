"use client";
import { useState } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="fixed bottom-4 right-4 cursor-pointer z-50 p-4 rounded-full border-[1.5px] border-reddieetext w-16 h-16 flex flex-col items-center justify-center"
      onClick={toggleChat}
    >
      <img src="/cherry.png" className="w-8 h-8" alt="chat icon" />
      <span className="font-semibold text-reddieetext text-sm">Chat</span>
    </div>
  );
}
