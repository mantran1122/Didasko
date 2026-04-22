type BenefitRow = {
  left: {
    title: string;
    text: string;
    tone: string;
    mock?: "course" | "tracker";
  };
  right: {
    title: string;
    text: string;
    tone: string;
    mock?: "gauge";
  };
};

const benefitRows: BenefitRow[] = [
  {
    left: {
      title: "Course builder that works",
      text: "Create lessons with clear text, files and quizzes using an editor made for real teachers.",
      tone: "bg-[#f6f79c]",
      mock: "course",
    },
    right: {
      title: "Built-in automation",
      text: "Send reminders, updates and certificates without lifting a finger.",
      tone: "bg-[#f5f5f5]",
    },
  },
  {
    left: {
      title: "One place for everything",
      text: "No need to jump between tools. Manage content, students and your flow on one dashboard.",
      tone: "bg-[#f5f5f5]",
    },
    right: {
      title: "Track how students learn",
      text: "See who is active, who is falling behind and who is ready to move ahead.",
      tone: "bg-[#d7f6f4]",
      mock: "gauge",
    },
  },
  {
    left: {
      title: "Fun smooth way to learn",
      text: "Keep students engaged with clean design, fast navigation and mobile friendly lessons.",
      tone: "bg-[#f5dbbd]",
      mock: "tracker",
    },
    right: {
      title: "Quick setup no tech stress",
      text: "Launch your course in days, not weeks, with no need for coding or complex tools.",
      tone: "bg-[#f5f5f5]",
    },
  },
];

function MockCard({ variant }: { variant: "course" | "tracker" | "gauge" }) {
  if (variant === "course") {
    return (
      <div className="w-fit border-2 border-black bg-[#eef0ff] px-3 py-2 text-[9px] font-bold uppercase">
        <p className="text-[8px] text-black/60">Course</p>
        <p>Basic html css</p>
        <div className="mt-1 flex gap-1">
          <span className="border border-black px-1">24</span>
          <span className="border border-black px-1">8</span>
          <span className="border border-black px-1">99</span>
        </div>
      </div>
    );
  }

  if (variant === "tracker") {
    return (
      <div className="w-fit border-2 border-black bg-[#fff] px-3 py-2 text-[9px] font-bold uppercase">
        <p className="mb-1">Leader board</p>
        <div className="space-y-1 text-[8px] font-semibold normal-case">
          <p>1. Ariana - 13.4k</p>
          <p>2. Marcus - 10.3k</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit border-2 border-black bg-[#e7fffa] px-3 py-2 text-center">
      <p className="text-[8px] font-bold uppercase">Point progress</p>
      <div className="mx-auto mt-1 h-10 w-10 rounded-full border-4 border-black border-t-[#fb8500]" />
      <p className="text-[8px] font-bold">8.9k</p>
    </div>
  );
}

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pixel-chip bg-[#ffd166]">Benefits</p>
          <h2 className="section-title mt-5 text-3xl leading-[1.06] sm:text-4xl md:text-5xl">
            Everything is built to
            <br />
            help you teach better
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-black/60 md:text-base">
            From creating content to tracking progress, the platform simplifies your work and
            improves the learning experience.
          </p>
        </div>

        <div className="mt-8 space-y-4 md:mt-10">
          {benefitRows.map((row) => (
            <div key={row.left.title} className="grid gap-4 md:grid-cols-[1.35fr_0.65fr]">
              <article className={`pixel-frame flex flex-col gap-4 p-4 sm:flex-row sm:justify-between ${row.left.tone}`}>
                <div className="max-w-[290px]">
                  <h3 className="text-xl font-black uppercase leading-[1.05] sm:text-2xl md:text-[30px]">
                    {row.left.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-black/70 md:text-sm">
                    {row.left.text}
                  </p>
                </div>
                {row.left.mock ? (
                  <div className="self-start sm:self-center">
                    <MockCard variant={row.left.mock} />
                  </div>
                ) : null}
              </article>

              <article className={`pixel-frame flex flex-col gap-3 p-4 sm:flex-row sm:justify-between ${row.right.tone}`}>
                <div className="max-w-[190px]">
                  <h3 className="text-xl font-black uppercase leading-[1.05] sm:text-2xl md:text-[30px]">
                    {row.right.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-black/70 md:text-sm">
                    {row.right.text}
                  </p>
                </div>
                {row.right.mock ? (
                  <div className="self-start sm:self-center">
                    <MockCard variant={row.right.mock} />
                  </div>
                ) : null}
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

