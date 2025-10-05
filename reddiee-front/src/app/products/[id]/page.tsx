"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [loading, setLoading] = useState(false); // 버튼 중복 클릭 방지용

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("상품 상세 불러오기 실패", err);
        setProduct(null);
      });
  }, [id]);

  /** ✅ 좋아요 토글 */
  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  /** ✅ 장바구니 담기 */
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setLoading(true);
      await axiosInstance.post(`/carts`, {
        productId: product.id,
        quantity: 1,
      });
      alert("장바구니에 담겼습니다!");
    } catch (error: any) {
      console.error("장바구니 담기 실패", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert("장바구니 담기에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-lg font-semibold text-reddieetext">
          상품 정보를 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-[100px] px-[30px]">
      <h1 className="text-3xl font-bold text-reddieetext mb-6">
        {product.name}
      </h1>

      <div className="flex gap-8">
        {/* 이미지 */}
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
          alt={product.name}
          className="w-[300px] h-[300px] object-cover rounded-xl shadow-md"
        />

        {/* 정보 영역 */}
        <div>
          <p className="text-xl font-semibold text-gray-800 mb-4">
            ₩{product.price.toLocaleString()}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* ✅ 버튼 영역 */}
          <div className="flex items-center gap-4">
            {/* 좋아요 버튼 */}
            <button
              onClick={handleLike}
              className={`px-5 py-2 rounded-xl font-semibold transition-all duration-200 ${
                liked
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {liked ? "좋아요 취소" : "좋아요"}
            </button>

            {/* 장바구니 담기 버튼 */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="px-5 py-2 rounded-xl font-semibold bg-reddieetext text-white hover:bg-red-600 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "담는 중..." : "🛒 장바구니 담기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
