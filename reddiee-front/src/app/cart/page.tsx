"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";
import Cart from "@/components/Cart/Cart";

export default function CartPage() {
  return (
    <div className="flex justify-center pt-[100px]">
      <Cart />
    </div>
  );
}
