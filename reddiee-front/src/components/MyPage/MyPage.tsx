"use client";

import { useState } from "react";

export default function MyPage() {
  const [keyword, setKeyword] = useState("");

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2025-08-18",
      items: 2,
      total: 69200,
      status: "배송중",
    },
    {
      id: "ORD-002",
      date: "2025-07-30",
      items: 1,
      total: 39800,
      status: "배송완료",
    },
    {
      id: "ORD-003",
      date: "2025-07-25",
      items: 3,
      total: 125400,
      status: "결제완료",
    },
  ];

  return (
    <div className="w-full mx-auto max-w-[1000px] px-4 py-8">
      {/* 헤더 */}
      <h1 className="text-2xl font-bold mb-2">마이페이지</h1>
      <p className="text-gray-500 mb-6">
        주문, 쿠폰, 포인트, 배송지 관리를 한 곳에서 확인하세요.
      </p>

      {/* 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryBox title="포인트" value="1,250P" />
        <SummaryBox title="쿠폰" value="3장" />
        <SummaryBox title="주문" value="27건" />
        <SummaryBox title="리뷰" value="11개" />
      </div>

      {/* 검색 */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="주문번호, 상품명 검색"
          className="border rounded px-3 py-2 flex-1"
        />
        <button className="border rounded px-4 py-2 bg-gray-100">검색</button>
      </div>

      {/* 최근 주문 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">최근 주문</h2>
        <div className="space-y-3">
          {recentOrders.map((o) => (
            <div
              key={o.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{o.id}</p>
                <p className="text-sm text-gray-500">
                  {o.date} · {o.items}개 상품
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{o.total.toLocaleString()}원</p>
                <p className="text-sm text-gray-600 mt-1">{o.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 배송지 & 결제수단 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">기본 배송지</h3>
          <p className="text-sm">서울특별시 성동구 성수일로 99, 101동 1203호</p>
          <p className="text-sm text-gray-500">홍길동 · 010-1234-5678</p>
          <button className="mt-2 text-sm border rounded px-3 py-1 bg-gray-50">
            배송지 관리
          </button>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">결제 수단</h3>
          <p className="text-sm">토스카드 (**** 1234)</p>
          <p className="text-sm text-gray-500">간편결제 사용중</p>
          <button className="mt-2 text-sm border rounded px-3 py-1 bg-gray-50">
            결제수단 관리
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="font-bold text-lg mt-1">{value}</p>
    </div>
  );
}
