"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { CheckCircle, XCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "fail">(
    "loading"
  );

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await axiosInstance.post("/payments/confirm", {
          paymentKey,
          orderId,
          amount: Number(amount),
        });
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("fail");
      }
    };
    confirmPayment();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f5faff] to-white">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-lg bg-white/70 backdrop-blur-xl border border-gray-100 animate-fadeIn">
          {/* 로딩 스피너 */}
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>

          {/* 텍스트 */}
          <p className="text-gray-600 text-lg font-semibold tracking-tight">
            결제 확인 중입니다
          </p>
          <p className="text-gray-400 text-sm">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        isSuccess
          ? "bg-gradient-to-b from-blue-50 to-white"
          : "bg-gradient-to-b from-red-50 to-white"
      } animate-fadeIn`}
    >
      <div
        className={`bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center border transition-all duration-300 hover:shadow-lg ${
          isSuccess ? "border-gray-100" : "border-red-100"
        }`}
      >
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle className="text-green-500 w-16 h-16 animate-bounce-slow" />
          ) : (
            <XCircle className="text-red-500 w-16 h-16 animate-bounce-slow" />
          )}
        </div>

        <h1
          className={`text-2xl font-semibold mb-2 ${
            isSuccess ? "text-gray-800" : "text-red-700"
          }`}
        >
          {isSuccess ? "결제가 완료되었습니다 🎉" : "결제에 실패했습니다 ❌"}
        </h1>

        <p className="text-gray-500 mb-6">
          {isSuccess
            ? "소중한 주문이 정상적으로 처리되었습니다."
            : "결제 과정에서 오류가 발생했습니다. 다시 시도해주세요."}
        </p>

        {isSuccess ? (
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
        ) : null}

        <button
          onClick={() => router.push("/")}
          className={`w-full ${
            isSuccess
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-red-500 hover:bg-red-600"
          } text-white py-2 rounded-xl transition-colors duration-200`}
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
