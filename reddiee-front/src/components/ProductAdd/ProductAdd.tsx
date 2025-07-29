"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axiosInstance";

export default function ProductAdd() {
  const token = Cookies.get("access_token");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "Caps",
    image: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        formData
      );
      alert("상품 등록 성공!");
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록 실패");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">상품 등록</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">상품명</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">가격</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">설명</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1">카테고리</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          >
            <option value="Caps">Caps</option>
            <option value="Bags">Bags</option>
            <option value="Apparel">Apparel</option>
            <option value="ACC">ACC</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          상품 등록하기
        </button>
      </form>
    </div>
  );
}
