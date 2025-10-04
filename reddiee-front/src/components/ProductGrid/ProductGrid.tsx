"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const user = useUserStore((state) => state.user);

  // 상품별 상태 관리
  const [cartCounts, setCartCounts] = useState<{ [id: number]: number }>({});
  const [likedItems, setLikedItems] = useState<{ [id: number]: boolean }>({});
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [modalInput, setModalInput] = useState<number>(1);

  // 서버에서 장바구니 불러오기
  useEffect(() => {
    if (!user) return;

    axiosInstance
      .get("/carts")
      .then((res) => {
        const items = Array.isArray(res.data.items) ? res.data.items : [];
        const counts: { [id: number]: number } = {};
        items.forEach((item: any) => {
          counts[item.product.id] = item.quantity;
        });
        setCartCounts(counts);
      })
      .catch((err) => {
        console.error(err);
        setCartCounts({});
      });
    // 좋아요 불러오기
    axiosInstance
      .get("/likes/me")
      .then((res) => {
        // 응답 예시: [{ id: 1, product: { id: 5, ... }, created_at: ... }]
        const likes = res.data;
        const liked: { [id: number]: boolean } = {};

        likes.forEach((like: any) => {
          liked[like.product.id] = true; // ✅ productId 직접 접근
        });

        setLikedItems(liked);
      })
      .catch((err) => {
        console.error(err);
        setLikedItems({});
      });
  }, [user]);

  const openModal = (productId: number) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <Link href={`/products/${product.id}`}>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
                alt={product.name}
                className="w-full h-48 object-contain p-5"
              />
            </div>
          </Link>

          <div className="p-4 flex justify-between">
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600">
                {product.price.toLocaleString()}원
              </p>
              <p>{product.description}</p>
            </div>
            <div className="flex items-end space-x-2">
              {/* 장바구니 버튼 */}
              <div className="relative">
                <button
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  onClick={() => openModal(product.id)}
                >
                  <ShoppingCart size={20} />
                </button>
                {cartCounts[product.id] > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                    {cartCounts[product.id]}
                  </span>
                )}
              </div>

              {/* 좋아요 버튼 */}
              <button
                className={`p-2 rounded-full ${
                  likedItems[product.id]
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={async () => {
                  if (!user) {
                    alert("로그인이 필요합니다.");
                    return;
                  }

                  try {
                    if (likedItems[product.id]) {
                      // 이미 좋아요 → 취소 요청
                      await axiosInstance.delete(`/likes/${product.id}`);
                      setLikedItems((prev) => ({
                        ...prev,
                        [product.id]: false,
                      }));
                    } else {
                      // 좋아요 추가
                      await axiosInstance.post(`/likes/${product.id}`);
                      setLikedItems((prev) => ({
                        ...prev,
                        [product.id]: true,
                      }));
                    }
                  } catch (err) {
                    console.error(err);
                    alert("좋아요 처리 실패");
                  }
                }}
              >
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* 모달 */}
          {openModalId === product.id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                    className="px-4 py-2 bg-reddieetext text-white rounded hover:bg-blue-600"
                    onClick={() => handleConfirm(product.id)}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
