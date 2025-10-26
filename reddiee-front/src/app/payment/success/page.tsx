"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await axiosInstance.post("/payments/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
        });
        alert("결제가 완료되었습니다!");
      } catch (err) {
        console.error(err);
        alert("결제 승인 실패");
      }
    };
    confirmPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">결제가 완료되었습니다 🎉</h1>
      <p>주문번호: {orderId}</p>
      <p>결제금액: {amount}원</p>
    </div>
  );
}
