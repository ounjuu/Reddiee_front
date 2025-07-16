"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import socket from "@/utils/socket";

type Message = {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    nickName: string;
    role: string;
  };
  chatRoom: {
    id: number;
  };
};

export default function AdminChatPage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 임시로 admin이 보는 채팅방 id 지정 (관리자용 모든 채팅방을 보려면 API/백엔드 추가 필요)
  const ADMIN_CHAT_ROOM_ID = 5;

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("access_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("인증 실패");

        const userData = await res.json();
        setUser(userData);

        if (userData.role !== "admin") {
          router.replace("/403");
          return;
        }

        setLoading(false);
      } catch {
        router.replace("/login");
      }
    }

    if (!user) {
      fetchUser();
    } else {
      if (user.role !== "admin") {
        router.replace("/");
      } else {
        setLoading(false);
      }
    }
  }, [user, setUser, router]);

  useEffect(() => {
    if (loading) return;

    // 서버에서 메시지 수신
    socket.on("message", (msg: Message) => {
      // 관리자니까 모든 메시지 받거나, 채팅방 필터링 가능
      if (msg.chatRoom && msg.chatRoom.id === ADMIN_CHAT_ROOM_ID) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // 초기 메시지 불러오기 (필요시 API 추가)
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${ADMIN_CHAT_ROOM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((msgs) => {
        setMessages(Array.isArray(msgs) ? msgs : []);
      })
      .catch(console.error);

    return () => {
      socket.off("message");
    };
  }, [loading]);

  // 스크롤 아래 고정
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    socket.emit("message", {
      chatRoomId: ADMIN_CHAT_ROOM_ID,
      senderId: user.id,
      message: input.trim(),
    });

    setInput("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        권한 검사 중...
      </div>
    );

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4  pt-[100px]">
      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-white">
        {messages.length === 0 && (
          <p className="text-center text-gray-500">채팅이 없습니다.</p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.sender.id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-1 rounded-lg max-w-xs break-words ${
                msg.sender.id === user?.id
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="text-xs font-semibold">
                {msg.sender.nickName} ({msg.sender.role})
              </p>
              <p>{msg.content}</p>
              <p className="text-xs text-gray-400 text-right">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 mr-2"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </div>
  );
}
