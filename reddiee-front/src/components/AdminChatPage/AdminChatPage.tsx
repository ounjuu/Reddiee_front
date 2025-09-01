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

  // 사용자 인증
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

  // 채팅방 목록 불러오기
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

  // 방 선택 시 메시지 불러오기
  useEffect(() => {
    if (!selectedRoom) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${selectedRoom}`, {
      headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
    })
      .then((res) => res.json())
      .then((msgs) => {
        if (Array.isArray(msgs)) {
          setMessages(msgs);
        } else if (msgs && msgs.data && Array.isArray(msgs.data)) {
          // 혹시 { data: [...] } 형태라면
          setMessages(msgs.data);
        } else {
          setMessages([]); // 잘못된 응답이면 빈 배열
        }
      })
      .catch((err) => {
        console.error("메시지 불러오기 실패:", err);
        setMessages([]);
      });

    // 소켓 수신
    socket.on("message", (msg: Message) => {
      if (msg.chatRoom.id === selectedRoom) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [selectedRoom]);

  // 스크롤 아래 고정
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const sendMessage = () => {
    if (!input.trim() || !user || !selectedRoom) return;

    socket.emit("message", {
      chatRoomId: selectedRoom,
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
        {/* 채팅방 버튼 */}
        <div className="flex mb-4 space-x-2">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`px-3 py-1 rounded ${
                selectedRoom === room.id
                  ? "bg-reddieetext text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              방 #{room.id}{" "}
              {room.lastMessage && (
                <span className="text-xs">({room.lastMessage})</span>
              )}
            </button>
          ))}
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-white">
          {messages.length === 0 && (
            <p className="text-center text-gray-500">채팅이 없습니다.</p>
          )}

          {messages.map((msg) => (
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
          ))}
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
      <div className="flex-1 flex justify-end"></div>
    </div>
  );
}
