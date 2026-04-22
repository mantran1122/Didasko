"use client";

import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="pixel-btn fixed bottom-5 right-5 z-50 h-11 w-11 bg-[#ffd166] text-sm font-black text-black shadow-[4px_4px_0_#111111]"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
