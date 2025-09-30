"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  // 주문하기 버튼
  const handleOrder = async () => {
    try {
      const res = await axiosInstance.post("/orders", {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      alert("주문이 완료되었습니다!");
      console.log(res.data);
      // 주문 완료 후 장바구니 비우기
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert("주문에 실패했습니다.");
    }
  };

  // 장바구니 불러오기
  const fetchCart = async () => {
    try {
      setLoading(true);
      setNotLoggedIn(false);

      const res = await axiosInstance.get("/carts");
      // res.data.items가 배열인지 확인 후 세팅
      const items = Array.isArray(res.data.items) ? res.data.items : [];
      setCartItems(items);

      console.log(res.data, "?카트");
    } catch (err: any) {
      // 로그인 안됨
      if (err.response?.status === 401) {
        setNotLoggedIn(true);
        setCartItems([]);
      } else {
        console.error(err);
      }
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
      await axiosInstance.patch(`/carts/${productId}`, { quantity });
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
      await axiosInstance.delete(`/carts/${productId}`);
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
      await axiosInstance.delete("/carts/clear");
      setCartItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] text-xm font-bold">
        Loading...
      </div>
    );

  if (notLoggedIn)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] text-xm font-bold">
        장바구니를 보려면 로그인해주세요.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">장바구니</h1>

      {!Array.isArray(cartItems) || cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.product.imageUrl}`}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        // 입력 중일 때는 서버 호출 X
                        return;
                      }
                      updateQuantity(item.product.id, Number(value));
                    }}
                    onBlur={(e) => {
                      const num = Math.max(1, Number(e.target.value));
                      updateQuantity(item.product.id, num);
                    }}
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
            <button
              onClick={handleOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
