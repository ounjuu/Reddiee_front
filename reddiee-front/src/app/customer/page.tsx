"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

export default function CategoryPage() {
  const params = useParams();

  return (
    <div className="pt-[100px] px-[30px]">
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-reddieetext text-lg font-semibold">For Customer</p>
      </div>
    </div>
  );
}
