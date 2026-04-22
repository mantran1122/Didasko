import type { Metadata } from "next";
import AuthFormCard from "@/components/auth/AuthFormCard";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Didasko account and continue managing your courses.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="pixel-shell flex min-h-screen items-center px-4 py-10 sm:px-6">
      <AuthFormCard mode="login" />
    </main>
  );
}
