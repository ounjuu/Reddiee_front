"use client";
import { useRef, useEffect } from "react";

// 메인페이지
export default function HomePage() {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const sections = [section1Ref, section2Ref, section3Ref];
  let current = 0;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0 && current < sections.length - 1) {
        current += 1;
      } else if (e.deltaY < 0 && current > 0) {
        current -= 1;
      }

      sections[current].current?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <div
        className="h-screen pt-[72px] bg-cover bg-no-repeat bg-center flex items-center justify-center overflow-x-hidden"
        ref={section1Ref}
      >
        <img
          alt="swimming_people image "
          src="/swimming_people.png"
          className="max-h-full object-contain"
        />
      </div>
      <div
        className="pt-[72px] h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center overflow-x-hidden "
        ref={section2Ref}
      >
        <img
          alt="swimming_people image"
          src="/swimming_people.png"
          className="max-h-full object-contain"
        />
      </div>
      <div
        className="pt-[72px] h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center overflow-x-hidden"
        ref={section3Ref}
      >
        <img
          alt="swimming_people image"
          src="/swimming_people.png"
          className="max-h-full object-contain"
        />
      </div>
    </>
  );
}
