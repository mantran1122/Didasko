type PricingItem = {
  plan: string;
  price: string;
  text: string;
  features: string[];
  highlighted?: boolean;
};

const pricing: PricingItem[] = [
  {
    plan: "Starter",
    price: "$19",
    text: "Best for launching your first online program.",
    features: ["1 course", "Unlimited students", "Email support"],
  },
  {
    plan: "Growth",
    price: "$49",
    text: "Scale with advanced automations and bundles.",
    features: ["10 courses", "Automations", "Priority support"],
    highlighted: true,
  },
  {
    plan: "Scale",
    price: "$99",
    text: "For teams running multi-brand education products.",
    features: ["Unlimited courses", "Team roles", "Analytics suite"],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <h2 className="section-title text-3xl md:text-4xl">Pricing</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((item) => (
            <article
              key={item.plan}
              className={`pixel-frame p-6 ${
                item.highlighted ? "bg-[#ff4d6d] text-white" : "bg-[#fdffb6] text-black"
              }`}
            >
              <p className="text-sm font-black uppercase tracking-wider">{item.plan}</p>
              <p className="mt-4 text-4xl font-black">{item.price}</p>
              <p className={`mt-2 text-sm font-semibold ${item.highlighted ? "text-white/90" : "text-black/80"}`}>
                {item.text}
              </p>
              <ul className="mt-6 space-y-2 text-sm font-semibold">
                {item.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <a
                href="#newsletter"
                className={`pixel-btn mt-7 px-5 py-2.5 text-sm ${
                  item.highlighted ? "bg-[#ffd166] text-black" : "bg-black text-white"
                }`}
              >
                Choose plan
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

