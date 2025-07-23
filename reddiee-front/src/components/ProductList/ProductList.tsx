// ProductList.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}
const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // 상품 불러오기
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`
      );
      setProducts(res.data);
      console.log(res.data, "?");
    } catch (err) {
      console.error("상품 불러오기 실패:", err);
    }
  };

  // 상품 삭제하기
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      // 삭제 후 목록 다시 불러오기
      fetchProducts();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-extrabold mb-6 border-b-2 border-gray-600 pb-2">
        상품 목록
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>이미지</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>이름</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>설명</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>
              카테고리
            </th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>가격</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`}
                  alt={product.name}
                  width={100}
                  height={100}
                />
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {product.name}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {product.description}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {product.category}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                ₩{product.price.toLocaleString()}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                <button onClick={() => handleDelete(product.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
