import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  // 유저
  const user = useUserStore((state) => state.user);

  const [liked, setLiked] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState<number>(1); // 모달에서 입력한 수량

  const openModal = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setModalInput(cartCount > 0 ? cartCount : 1); // 기존 장바구니 수량으로 초기화
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleConfirm = () => {
    setCartCount(Number(modalInput));
    closeModal();
  };

  console.log(products);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
      {products.map((product) => (
        <div key={product.id}>
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
              alt={product.name}
              className="w-full h-48 object-contain p-5"
            />
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
                    onClick={openModal}
                  >
                    <ShoppingCart size={20} />
                  </button>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* 좋아요 버튼 */}
                <button
                  className={`p-2 rounded-full ${
                    liked
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart size={20} />
                </button>
                {/* 모달 */}
                {isModalOpen && (
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
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={handleConfirm}
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
