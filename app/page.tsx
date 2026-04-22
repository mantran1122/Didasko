import BackToTopButton from "@/components/landing/BackToTopButton";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import BenefitsSection from "@/components/landing/sections/BenefitsSection";
import FaqSection from "@/components/landing/sections/FaqSection";
import HeroSection from "@/components/landing/sections/HeroSection";
import IntegrationsSection from "@/components/landing/sections/IntegrationsSection";
import NewsletterSection from "@/components/landing/sections/NewsletterSection";
import PricingSection from "@/components/landing/sections/PricingSection";
import ProblemSection from "@/components/landing/sections/ProblemSection";
import TestimonialsSection from "@/components/landing/sections/TestimonialsSection";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Didasko",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    description: "Didasko helps educators launch and manage online courses with ease.",
  };

  return (
    <div className="pixel-shell text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="space-y-7 py-5 md:space-y-10 md:py-8">
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <NewsletterSection />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}
