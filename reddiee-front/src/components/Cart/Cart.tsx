"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 장바구니 불러오기
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/carts", { withCredentials: true });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 수량 변경
  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      await axiosInstance.patch(
        `/carts/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 아이템 삭제
  const removeItem = async (productId: number) => {
    try {
      await axiosInstance.delete(`/carts/${productId}`, {
        withCredentials: true,
      });
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 전체 삭제
  const clearCart = async () => {
    try {
      await axiosInstance.delete("/carts", { withCredentials: true });
      setCartItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">장바구니</h1>

      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="font-bold">{item.product.name}</h3>
                <p className="mb-2">
                  {Number(item.product.price).toLocaleString()}원
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product.id, Number(e.target.value))
                    }
                    className="border w-16 p-1"
                  />
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>

                <p>
                  총액:{" "}
                  {(
                    Number(item.product.price) * item.quantity
                  ).toLocaleString()}
                  원
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">
              전체 합계:{" "}
              {cartItems
                .reduce(
                  (sum, item) =>
                    sum + Number(item.product.price) * item.quantity,
                  0
                )
                .toLocaleString()}
              원
            </h2>
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              장바구니 비우기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
