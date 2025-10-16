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

type ChatRoom = {
  id: number;
  user1Exited: boolean;
  user2Exited: boolean;
  createdAt: string;
  updatedAt: string;
  user1?: { id: number; nickName: string };
  user2?: { id: number; nickName: string };
  lastMessage?: string | null;
  lastSenderNick?: string | null;
};

export default function AdminChatPage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ 사용자 인증
  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("access_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
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

    if (!user) fetchUser();
    else {
      if (user.role !== "admin") router.replace("/");
      else setLoading(false);
    }
  }, [user, setUser, router]);

  // ✅ 채팅방 목록 불러오기
  useEffect(() => {
    if (loading) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms`, {
      headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
    })
      .then((res) => res.json())
      .then((rooms: ChatRoom[]) => {
        setChatRooms(rooms);
        setSelectedRoom(rooms[0]?.id || null);
      })
      .catch(console.error);
  }, [loading]);

  // ✅ 메시지 불러오기
  useEffect(() => {
    if (!selectedRoom) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${selectedRoom}`, {
      headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
    })
      .then((res) => res.json())
      .then((msgs) => {
        if (Array.isArray(msgs)) setMessages(msgs);
        else if (msgs?.data && Array.isArray(msgs.data)) setMessages(msgs.data);
        else setMessages([]);
      })
      .catch((err) => {
        console.error("메시지 불러오기 실패:", err);
        setMessages([]);
      });

    socket.on("message", (msg: Message) => {
      if (msg.chatRoom.id === selectedRoom) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [selectedRoom]);

  // ✅ 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (!input.trim() || !user || !selectedRoom) return;

    socket.emit("message", {
      chatRoomId: selectedRoom,
      senderId: user.id,
      content: input.trim(),
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
    <div className="flex h-screen pt-[100px] bg-gray-50">
      {/* 왼쪽 영역 */}
      <div className="w-1/4 p-6 border-r bg-white flex flex-col items-start space-y-6 overflow-y-auto">
        {[
          {
            label: "상품 등록 페이지 가기",
            path: "/admin/addproduct",
          },
          {
            label: "문의사항 관리 페이지 가기",
            path: "/admin/admininquiries",
          },
          {
            label: "제품 리스트 페이지 가기",
            path: "/admin/productlist",
          },
        ].map((item) => (
          <div
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full cursor-pointer rounded-2xl p-5 shadow-md 
        bg-gradient-to-br from-red-100 to-red-50 hover:from-red-300 hover:to-red-100
        transition-all transform hover:-translate-y-1 hover:shadow-lg 
        flex flex-col items-start justify-between border border-red-200`}
          >
            <div className="text-base font-semibold text-red-800 mb-1">
              {item.label}
            </div>
            <div className="text-xs text-red-500 flex items-center gap-1">
              이동하기 <span className="text-sm">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* 가운데 영역 */}
      <div className="w-2/4 flex flex-col px-6">
        {/* 채팅방 목록 */}
        <div className="flex mb-4 space-x-2 overflow-x-auto">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`px-3 py-1 rounded whitespace-nowrap ${
                selectedRoom === room.id
                  ? "bg-reddieetext text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              방 #{room.id} {room.lastSenderNick && `(${room.lastSenderNick})`}{" "}
              {room.lastMessage && `: ${room.lastMessage}`}
            </button>
          ))}
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-white shadow-inner">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">채팅이 없습니다.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${
                  msg.sender?.id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-1 rounded-lg max-w-xs break-words ${
                    msg.sender?.id === user?.id
                      ? "bg-red-400 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    {msg.sender?.nickName} ({msg.sender?.role})
                  </p>
                  <p>{msg.content}</p>
                  <p className="text-xs text-gray-400 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 */}
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
      <div className="w-1/4 bg-white border-l p-6 flex flex-col justify-center items-center text-gray-400">
        (추후 관리자 정보나 통계 표시 예정)
      </div>
    </div>
  );
}
