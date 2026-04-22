"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

type AuthFormCardProps = {
  mode: AuthMode;
};

export default function AuthFormCard({ mode }: AuthFormCardProps) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!isLogin && fullName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email, password }
        : { fullName, email, password, confirmPassword };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        message?: string;
        user?: { id: number; fullName: string; email: string; role: string };
      };

      if (!response.ok) {
        setError(data.message ?? "Request failed.");
        return;
      }

      setSuccess(data.message ?? "Success.");
      form.reset();

      if (isLogin) {
        if (data.user) {
          localStorage.setItem("didasko_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("didasko-auth-changed"));
        }
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const { getApps, getApp, initializeApp } = await import("firebase/app");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      if (!firebaseConfig.apiKey) {
        setError("Firebase API key is missing. Please check environment variables.");
        setIsSubmitting(false);
        return;
      }

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      const credential = await signInWithPopup(auth, provider);
      const googleUser = credential.user;
      const email = googleUser.email ?? "";
      const fullName = googleUser.displayName ?? "Google User";

      if (!email) {
        setError("Google account does not provide an email.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });

      const data = (await response.json()) as {
        message?: string;
        user?: { id: number; fullName: string; email: string; role: string };
      };

      if (!response.ok || !data.user) {
        setError(data.message ?? "Google login failed.");
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("didasko_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("didasko-auth-changed"));
      setSuccess(data.message ?? "Google login successful.");
      router.push("/");
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pixel-frame mx-auto w-full max-w-md bg-[#f2efe4] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Didasko logo" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-black uppercase tracking-wide text-black">Didasko</span>
        </Link>
      </div>

      <h1 className="section-title mt-6 text-2xl sm:text-3xl">
        {isLogin ? "Welcome back" : "Create account"}
      </h1>
      <p className="mt-2 text-sm font-semibold text-black/65">
        {isLogin
          ? "Log in to manage your courses, learners and progress."
          : "Start teaching online with one account for all tools."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {!isLogin ? (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-xs font-black uppercase tracking-wide">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              className="pixel-input h-12 w-full px-3 text-sm font-semibold outline-none"
            />
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-black uppercase tracking-wide">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@domain.com"
            className="pixel-input h-12 w-full px-3 text-sm font-semibold outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-black uppercase tracking-wide">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="Enter your password"
            className="pixel-input h-12 w-full px-3 text-sm font-semibold outline-none"
          />
        </div>

        {!isLogin ? (
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-black uppercase tracking-wide">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              className="pixel-input h-12 w-full px-3 text-sm font-semibold outline-none"
            />
          </div>
        ) : null}

        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        {success ? <p className="text-sm font-semibold text-green-700">{success}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="pixel-btn h-12 w-full bg-[#ffbe0b] text-sm uppercase tracking-wide text-black disabled:opacity-70"
        >
          {isSubmitting ? "Processing..." : isLogin ? "Sign in" : "Create account"}
        </button>

        {isLogin ? (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="pixel-btn h-12 w-full bg-white text-sm uppercase tracking-wide text-black disabled:opacity-70"
          >
            Continue with Google
          </button>
        ) : null}
      </form>

      <p className="mt-5 text-center text-sm font-semibold text-black/70">
        {isLogin ? "New to Didasko?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-black uppercase tracking-wide text-black underline"
        >
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </div>
  );
}
