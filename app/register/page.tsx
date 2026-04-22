import type { Metadata } from "next";
import AuthFormCard from "@/components/auth/AuthFormCard";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Didasko account to launch and manage your online courses.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <main className="pixel-shell flex min-h-screen items-center px-4 py-10 sm:px-6">
      <AuthFormCard mode="register" />
    </main>
  );
}
