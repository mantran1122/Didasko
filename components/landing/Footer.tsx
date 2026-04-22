import Image from "next/image";

const footerLinks = [
  { label: "Benefits", href: "#benefits" },
  { label: "How it work", href: "#how-it-work" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export default function Footer() {
  return (
    <footer className="bg-[#90e0ef] py-8 md:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 px-5 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Didasko logo" width={28} height={28} className="h-7 w-7" />
          <p className="text-sm font-black uppercase tracking-wide text-black">Didasko © 2026</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
          {footerLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-black uppercase tracking-wide text-black transition hover:-translate-y-0.5"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
