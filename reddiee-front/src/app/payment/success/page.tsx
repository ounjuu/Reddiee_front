"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const router = useRouter();

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white animate-fadeIn">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center border border-gray-100 transition-all duration-300 hover:shadow-lg">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16 animate-bounce-slow" />
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          결제가 완료되었습니다 🎉
        </h1>
        <p className="text-gray-500 mb-6">
          소중한 주문이 정상적으로 처리되었습니다.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">주문번호:</span>{" "}
            {orderId}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold text-gray-800">결제금액:</span>{" "}
            {Number(amount).toLocaleString()}원
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition-colors duration-200"
        >
          홈으로 돌아가기
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
