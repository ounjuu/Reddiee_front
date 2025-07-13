"use client";

import React, { useState, useEffect, useRef } from "react";
import socket from "@/utils/socket";
import { useUserStore } from "@/stores/useUserStore";

type Message = {
  id: number;
  content: string;
  sender: { id: number; nickName: string; role: string };
  createdAt: string;
};

export default function ChatBtnRoom({
  isOpen,
  toggleChat,
}: {
  isOpen: boolean;
  toggleChat: () => void;
}) {
  const user = useUserStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    socket.emit("message", {
      chatRoomId: 1 /* 여기에 실제 채팅방 ID */,
      senderId: user.id,
      message: input.trim(),
    });
    setInput("");
  };

  return (
    <div
      className={`fixed bg-white w-[250px] xs:w-1/2 h-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center px-2 py-1 border-b">
        <span className="text-lg font-semibold">채팅방</span>
        <button onClick={toggleChat}>✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">채팅이 없습니다.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${
                msg.sender.id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-1 rounded-lg max-w-[80%] break-words ${
                  msg.sender.id === user?.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-xs font-semibold">{msg.sender.nickName}</p>
                <p>{msg.content}</p>
                <p className="text-xs text-gray-400 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="p-2 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded px-2 py-1 mr-2"
          placeholder="메시지 입력..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-3 rounded"
        >
          전송
        </button>
      </div>
    </div>
  );
}
