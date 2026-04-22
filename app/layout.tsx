import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Didasko | Launch And Run Your Course With Ease",
    template: "%s | Didasko",
  },
  description:
    "Didasko helps educators launch courses faster, track student progress, and grow with built-in tools and integrations.",
  applicationName: "Didasko",
  category: "education",
  keywords: [
    "online course platform",
    "e-learning",
    "learning management",
    "course builder",
    "student analytics",
  ],
  alternates: { canonical: "/" },
  authors: [{ name: "Didasko Team" }],
  creator: "Didasko Team",
  publisher: "Didasko",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Didasko",
    title: "Didasko | Launch And Run Your Course With Ease",
    description:
      "Build, teach, and scale your online courses with an all-in-one platform designed for modern educators.",
    url: siteUrl,
    images: [{ url: "/hero.jpg", width: 1400, height: 800, alt: "Didasko dashboard preview" }],
  },
  twitter: {
    site: "@didasko",
    creator: "@didasko",
    card: "summary_large_image",
    title: "Didasko | Launch And Run Your Course With Ease",
    description:
      "Build, teach, and scale your online courses with an all-in-one platform designed for modern educators.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
