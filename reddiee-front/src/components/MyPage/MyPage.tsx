"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { ShoppingCart } from "lucide-react";

export default function MyPage() {
  const [keyword, setKeyword] = useState("");
  const [likedProducts, setLikedProducts] = useState<any[]>([]);
  const [cartCounts, setCartCounts] = useState<{ [id: number]: number }>({});
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [modalInput, setModalInput] = useState<number>(1);
  const [loading, setLoading] = useState(true);

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

  // ✅ 좋아요 상품 & 장바구니 불러오기
  useEffect(() => {
    async function fetchData() {
      try {
        const [likesRes, cartsRes] = await Promise.all([
          axiosInstance.get("/likes/me"),
          axiosInstance.get("/carts"),
        ]);

        setLikedProducts(likesRes.data);

        const items = Array.isArray(cartsRes.data.items)
          ? cartsRes.data.items
          : [];
        const counts: { [id: number]: number } = {};
        items.forEach((item: any) => {
          counts[item.product.id] = item.quantity;
        });
        setCartCounts(counts);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false); // ✅ 로딩 종료
      }
    }

    fetchData();
  }, []);

  const openModal = (productId: number) => {
    setModalInput(cartCounts[productId] || 1);
    setOpenModalId(productId);
  };
  const closeModal = () => setOpenModalId(null);

  const handleConfirm = async (productId: number) => {
    try {
      await axiosInstance.post("/carts", {
        productId,
        quantity: modalInput,
      });
      setCartCounts((prev) => ({ ...prev, [productId]: modalInput }));
      closeModal();
    } catch (err) {
      console.error(err);
      alert("장바구니 저장 실패");
    }
  };

  // ✅ 로딩 중 화면
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-gray-600">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-3"></div>
        <p className="text-sm">불러오는 중...</p>
      </div>
    );
  }

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

      {/* 좋아요 상품 */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">내가 찜한 상품</h2>
        {likedProducts.length === 0 ? (
          <p className="text-gray-500">아직 좋아요한 상품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {likedProducts.map((like: any) => (
              <div
                key={like.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${like.product.imageUrl}`}
                  alt={like.product.name}
                  className="w-full h-40 object-contain p-4"
                />
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{like.product.name}</p>
                    <p className="text-sm text-gray-600">
                      {like.product.price.toLocaleString()}원
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                      onClick={() => openModal(like.product.id)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                    {cartCounts[like.product.id] > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                        {cartCounts[like.product.id]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 모달 */}
      {openModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-72">
            <h2 className="text-lg font-semibold mb-4">수량 선택</h2>
            <input
              type="number"
              min="1"
              value={modalInput}
              onChange={(e) => setModalInput(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mb-4 text-center"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={closeModal}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleConfirm(openModalId)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
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
