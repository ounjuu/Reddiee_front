"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import MyPage from "@/components/MyPage/MyPage";

export default function CartPage() {
  return (
    <div className="flex justify-center pt-[100px]">
      <MyPage />
    </div>
  );
}
