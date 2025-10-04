"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    axiosInstance
      .get(`/products/${params.id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("상품 상세 불러오기 실패", err);
        setProduct(null);
      });
  }, [id]);

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
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
          alt={product.name}
          className="w-[300px] h-[300px] object-cover rounded-xl shadow-md"
        />
        <div>
          <p className="text-xl font-semibold text-gray-800 mb-4">
            ₩{product.price.toLocaleString()}
          </p>
          <p className="text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
