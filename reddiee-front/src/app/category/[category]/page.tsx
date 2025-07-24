"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category) return;

    axiosInstance
      .get(`/products?category=${category}`)
      .then((res) => {
        const filterd = res.data.filter((x: any) => {
          return x.category.toLowerCase() === category;
        });
        setProducts(filterd);
      })
      .catch((err) => {
        console.error("상품 불러오기 실패", err);
        setProducts([]);
      });
  }, [category]);

  return (
    <div className="pt-[100px] px-[30px]">
      <h1 className="text-2xl font-bold capitalize mb-6">{category}</h1>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p>해당 카테고리에 등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}
