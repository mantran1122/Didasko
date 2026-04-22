const questions = [
  "Can I migrate my current course content?",
  "Does Didasko support recurring subscriptions?",
  "Can I add team members and instructors?",
];

export default function FaqSection() {
  return (
    <section className="py-12 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <h2 className="section-title text-3xl md:text-4xl">FAQ</h2>
        <div className="mt-8 space-y-5">
          {questions.map((question) => (
            <details key={question} className="pixel-frame bg-[#bde0fe] px-6 py-4">
              <summary className="cursor-pointer list-none text-base font-black uppercase">{question}</summary>
              <p className="mt-3 text-sm font-semibold leading-6 text-black/85">
                Yes. The platform supports straightforward migration and gives you templates so
                you can publish quickly.
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

