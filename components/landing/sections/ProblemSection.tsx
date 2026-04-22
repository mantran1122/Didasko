const problems = [
  {
    title: "Too many tools break flow",
    text: "Jumping between platforms for videos, quizzes, emails and files breaks your flow every day.",
  },
  {
    title: "No clear view of progress",
    text: "You do not know who is learning, who is stuck, or who already dropped out of the course.",
  },
  {
    title: "Most students lose focus fast",
    text: "Learners get bored, lose motivation, and drop out before finishing even your best content.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="pixel-chip bg-[#ffd6a5]">Problem</p>
          <h2 className="section-title mt-5 text-3xl leading-[1.06] sm:text-4xl md:text-5xl">
            Teaching online
            <br />
            should not be hard
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-black/65 md:text-lg">
            Many teachers and teams waste time switching tools, lose track of students, and
            struggle to keep courses engaging.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-6 lg:mt-14 lg:grid-cols-3">
          {problems.map((item) => (
            <article key={item.title} className="pixel-frame bg-[#ececec] px-6 pb-7 pt-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center border-2 border-black bg-[#ffcf40] text-xl font-black text-[#ff4d6d]">
                X
              </div>
              <h3 className="mt-5 text-2xl font-black uppercase leading-[1.03] tracking-tight sm:text-[30px] md:text-[38px]">
                {item.title}
              </h3>
              <p className="mt-4 text-base font-semibold leading-7 text-black/60 md:text-lg">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

