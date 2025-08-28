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
  user1: {
    id: number;
    nickName: string;
    role: string;
  };
  user2: {
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
  const [chatRooms, setChatRooms] = useState<number[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    })
      .then((res) => res.json())
      .then((msgs: Message[]) => {
        setMessages(msgs);
        console.log(msgs, "msgs?");
        // 채팅방 ID 목록 추출
        const uniqueRoomIds = [
          ...new Set(
            msgs
              .filter((msg) => msg.chatRoom && msg.chatRoom.id !== undefined)
              .map((msg) => msg.chatRoom.id)
          ),
        ];
        setChatRooms(uniqueRoomIds);
        setSelectedRoom(uniqueRoomIds[0] || null); // 기본 선택
      })
      .catch(console.error);

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      if (!chatRooms.includes(msg.chatRoom.id)) {
        setChatRooms((prev) => [...prev, msg.chatRoom.id]);
      }
    });

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
    <>
      <div className="flex justify-between h-screen p-4 pt-[100px] w-screen">
        {/* 왼쪽 영역 */}
        <div className="flex-1 flex justify-start">
          <div
            onClick={() => router.push("admin/addproduct")}
            className="self-start cursor-pointer px-4 py-2 rounded-lg bg-reddieetext text-white font-medium shadow-md hover:bg-red-600 transition-colors "
          >
            상품 등록 페이지 &gt;
          </div>
        </div>
        {/* 가운데 영역 */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto">
          <div className="flex mb-4 space-x-2">
            {chatRooms.map((roomId) => (
              <button
                key={roomId}
                onClick={() => setSelectedRoom(roomId)}
                className={`px-3 py-1 rounded ${
                  selectedRoom === roomId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                방 #{roomId}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-white">
            {messages.length === 0 && (
              <p className="text-center text-gray-500">채팅이 없습니다.</p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${
                  msg.user1?.id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-1 rounded-lg max-w-xs break-words ${
                    msg.user1.id === user?.id
                      ? "bg-red-400 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    {msg.user1.nickName} ({msg.user1.role})
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
              className="bg-reddieetext text-white px-3 py-1 rounded hover:bg-red-600"
            >
              전송
            </button>
          </div>
        </div>
        {/* 오른쪽 영역 */}
        <div className="flex-1 flex justify-end"></div>
      </div>
    </>
  );
}
