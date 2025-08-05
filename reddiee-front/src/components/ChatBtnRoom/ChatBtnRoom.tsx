"use client";

import React, { useState, useEffect, useRef } from "react";
import socket from "@/utils/socket";
import { useUserStore } from "@/stores/useUserStore";
import axios from "axios";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axiosInstance";

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
  const token = Cookies.get("access_token");

  // 방 id 추가
  const [roomId, setRoomId] = useState<number | null>(null);

  useEffect(() => {
    console.log(user, "user?");
    if (!user) {
      console.log("채팅 이용을 위해 로그인이 필요합니다.");
      return;
    }
    console.log(user, "user?");
    socket.emit("createChatRoom", { user1Id: user.id, user2Id: 5 });

    socket.on("chatRoomCreated", (newRoomId: number) => {
      setRoomId(newRoomId);
      console.log(newRoomId, "newRoomId");
      socket.emit("joinRoom", newRoomId);

      // 방 메시지 API 호출해서 기존 메시지 가져오기
      fetchMessages(newRoomId);
    });

    return () => {
      socket.off("chatRoomCreated");
    };
  }, [user]);

  const fetchMessages = async (roomId: number) => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${roomId}`
      );
      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

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
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!input.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    socket.emit("message", {
      chatRoomId: roomId,
      senderId: user.id,
      message: input.trim(),
    });
    setInput("");
  };

  return (
    <div
      className={`fixed bg-white w-[250px] xs:w-1/2 h-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded flex flex-col ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center px-2 py-2 border-b flex-shrink-0">
        <span className="text-[14px] font-semibold pl-1">채팅방</span>
        <button onClick={toggleChat} className="pr-1">
          ✕
        </button>
      </div>

      {/* 메시지 목록 영역: flex-grow로 남은 공간 다 차지, 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto p-2">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="flex justify-center items-center text-gray-500 text-[13px] ">
              채팅이 없습니다.
            </p>
          </div>
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
                    ? "bg-red-300 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-xs font-semibold">{msg.sender.nickName}</p>
                <p>{msg.content}</p>
                <p className="text-xs text-gray-500 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* 입력 영역: flex-shrink-0로 크기 고정, 항상 하단 */}
      <div className="p-2 border-t flex flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded px-2 py-1 mr-2 text-[12px]"
          placeholder="메시지 입력..."
        />
        <button
          onClick={sendMessage}
          className="bg-reddieetext text-white px-2 rounded text-[12px] flex justify-center items-center"
        >
          전송
        </button>
      </div>
    </div>
  );
}
