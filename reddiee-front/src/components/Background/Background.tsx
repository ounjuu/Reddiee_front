"use client";

import { usePathname } from "next/navigation";

export default function Background() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/wave.png')" }}
      aria-hidden="true"
    />
  );
}
