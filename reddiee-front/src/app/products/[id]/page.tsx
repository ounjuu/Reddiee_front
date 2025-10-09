"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/stores/useUserStore";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const user = useUserStore((state) => state.user);

  const [product, setProduct] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalInput, setModalInput] = useState<number>(1);

  // ✅ 상품 상세 및 좋아요, 장바구니 정보 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [productRes, likesRes, cartRes] = await Promise.all([
          axiosInstance.get(`/products/${id}`),
          user ? axiosInstance.get(`/likes/me`) : Promise.resolve({ data: [] }),
          user
            ? axiosInstance.get(`/carts`)
            : Promise.resolve({ data: { items: [] } }),
        ]);

        setProduct(productRes.data);

        // 좋아요 여부
        const likedProductIds = likesRes.data.map(
          (like: any) => like.product.id
        );
        setLiked(likedProductIds.includes(Number(id)));

        // 장바구니 수량
        const foundCart = cartRes.data.items?.find(
          (item: any) => item.product.id === Number(id)
        );
        setCartCount(foundCart ? foundCart.quantity : 0);
      } catch (err) {
        console.error("상품 상세 불러오기 실패", err);
        setProduct(null);
      }
    };

    fetchData();
  }, [id, user]);

  /** ✅ 좋아요 토글 */
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      if (liked) {
        await axiosInstance.delete(`/likes/${id}`);
        setLiked(false);
      } else {
        await axiosInstance.post(`/likes/${id}`);
        setLiked(true);
      }
    } catch (err) {
      console.error("좋아요 처리 실패", err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  /** ✅ 장바구니 버튼 클릭 → 수량 선택 모달 */
  const openCartModal = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setModalInput(cartCount || 1);
    setOpenModal(true);
  };

  /** ✅ 장바구니 확인 */
  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/carts`, {
        productId: product.id,
        quantity: modalInput,
      });
      setCartCount(modalInput);
      alert("장바구니에 담겼습니다!");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("장바구니 담기 실패");
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

      <div className="flex gap-8 flex-col md:flex-row">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
          alt={product.name}
          className="w-[300px] h-[300px] object-cover rounded-xl shadow-md mx-auto"
        />

        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              ₩{product.price.toLocaleString()}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
          </div>

          {/* ✅ 버튼 영역 */}
          <div className="flex items-center gap-4">
            {/* 좋아요 버튼 */}
            <button
              onClick={handleLike}
              className={`p-3 rounded-full transition-all ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <Heart size={22} />
            </button>

            {/* 장바구니 버튼 */}
            <div className="relative">
              <button
                onClick={openCartModal}
                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
              >
                <ShoppingCart size={22} />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 모달 */}
      {openModal && (
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
                onClick={() => setOpenModal(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-reddieetext text-white rounded hover:bg-blue-600 disabled:opacity-50"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "처리 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
