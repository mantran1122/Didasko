"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Benefits", href: "#benefits" },
  { label: "How it work", href: "#how-it-work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

type ClientUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

function readStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("didasko_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClientUser;
  } catch {
    return null;
  }
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());
    syncUser();
    window.addEventListener("didasko-auth-changed", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("didasko-auth-changed", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("didasko_user");
    setUser(null);
    window.dispatchEvent(new Event("didasko-auth-changed"));
  };

  const handleRequireLogin = () => {
    alert("Please login first.");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#90e0ef]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Didasko logo" width={30} height={30} className="h-8 w-8" priority />
          <span className="text-xl font-black uppercase tracking-wide text-black">Didasko</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
            >
              {item.label}
            </a>
          ))}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className="text-sm font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
            >
              Admin
            </Link>
          ) : null}
        </nav>

        {user ? (
          <div className="flex items-center gap-2">
            <p className="hidden text-xs font-black uppercase text-black sm:block">
              Hello, {user.fullName}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="pixel-btn bg-white px-3 py-2 text-[11px] text-black sm:px-4 sm:text-xs"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRequireLogin}
            className="pixel-btn bg-[#ffd166] px-3 py-2 text-[11px] text-black sm:px-4 sm:text-xs"
          >
            Start for free
          </button>
        )}
      </div>

      <div className="border-t-2 border-black/20 px-4 pb-2 md:hidden">
        <nav className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <a
              key={`mobile-${item.label}`}
              href={item.href}
              className="pixel-btn shrink-0 bg-white px-3 py-1.5 text-[10px] uppercase text-black"
            >
              {item.label}
            </a>
          ))}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className="pixel-btn shrink-0 bg-white px-3 py-1.5 text-[10px] uppercase text-black"
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
