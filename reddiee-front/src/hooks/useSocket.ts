import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export function useSocket() {
  const [messages, setMessages] = useState<{ user: string; message: string }[]>(
    []
  );

  useEffect(() => {
    socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("connected to socket server");
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (message: string, user: string) => {
    socket.emit("message", { message, user });
  };

  return { messages, sendMessage };
}
