"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  category: string;
  message: string;
  created_at: string;
  status: "pending" | "done";
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleMarkDone = async (id: number) => {
    try {
      await axiosInstance.patch(`/inquiries/${id}/done`);
      // 상태를 UI에서도 바로 반영
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: "done" } : inq))
      );
    } catch (err) {
      alert("처리 상태 변경 실패");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/inquiries/${id}`);
      // 삭제된 아이템을 UI에서도 제거
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (err) {
      alert("삭제 실패");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await axiosInstance.get("/inquiries");
        setInquiries(res.data);
      } catch (err: any) {
        setError("문의글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">문의글 관리</h1>

      {inquiries.length === 0 ? (
        <p className="text-gray-500">문의글이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">ID</th>
                <th className="p-3">작성자</th>
                <th className="p-3">이메일</th>
                <th className="p-3">카테고리</th>
                <th className="p-3">메시지</th>
                <th className="p-3">작성일</th>
                <th className="p-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{inq.id}</td>
                  <td className="p-3">{inq.name}</td>
                  <td className="p-3">{inq.email}</td>
                  <td className="p-3">{inq.category}</td>
                  <td className="p-3">{inq.message}</td>
                  <td className="p-3">
                    {new Date(inq.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 space-x-2">
                    {inq.status === "done" ? (
                      <span className="inline-block px-3 py-1 bg-gray-400 text-white rounded text-center">
                        완료
                      </span>
                    ) : (
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleMarkDone(inq.id)}
                      >
                        처리완료
                      </button>
                    )}
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(inq.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
