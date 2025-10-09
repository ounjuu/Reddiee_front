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

        const likedProductIds = likesRes.data.map(
          (like: any) => like.product.id
        );
        setLiked(likedProductIds.includes(Number(id)));

        const foundCart = cartRes.data.items?.find(
          (item: any) => item.product.id === Number(id)
        );
        setCartCount(foundCart ? foundCart.quantity : 0);
      } catch (err) {
        console.error("상품 상세 불러오기 실패", err);
      }
    };

    fetchData();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return alert("로그인이 필요합니다.");

    try {
      if (liked) {
        await axiosInstance.delete(`/likes/${id}`);
        setLiked(false);
      } else {
        await axiosInstance.post(`/likes/${id}`);
        setLiked(true);
      }
    } catch {
      alert("좋아요 처리 실패");
    }
  };

  const openCartModal = () => {
    if (!user) return alert("로그인이 필요합니다.");
    setModalInput(cartCount || 1);
    setOpenModal(true);
  };

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
    } catch {
      alert("장바구니 담기 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!product)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg font-semibold text-reddieetext">
          상품 정보를 불러올 수 없습니다.
        </p>
      </div>
    );

  return (
    <div className="pt-[120px] px-6 md:px-20">
      {/* ✅ 전체 정렬 */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-12">
        {/* ✅ 이미지 섹션 */}
        <div className="flex justify-center md:w-1/2">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* ✅ 오른쪽 상품 정보 섹션 */}
        <div className="flex flex-col justify-between md:w-1/2 mt-8 md:mt-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-reddieetext mb-6">
              ₩{product.price.toLocaleString()}
            </p>
            <p className="text-gray-600 leading-relaxed border-t pt-4">
              {product.description}
            </p>
          </div>

          {/* ✅ 버튼 영역 */}
          <div className="flex items-center gap-4 mt-8">
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

      {/* ✅ 수량 모달 */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-72">
            <h2 className="text-lg font-semibold mb-4 text-center">
              수량 선택
            </h2>
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
                className="px-4 py-2 bg-reddieetext text-white rounded hover:bg-red-600 disabled:opacity-50"
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
