function CurvedArrow() {
  return (
    <svg viewBox="0 0 120 70" className="h-12 w-20 text-black" fill="none" aria-hidden>
      <path d="M12 10c22 0 24 22 10 34-6 6-12 9-18 12" stroke="currentColor" strokeWidth="3" />
      <path d="m5 49 2 8 8-2" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function BlockCard({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <div className={`pixel-frame w-full p-4 md:max-w-[430px] md:p-6 ${tone}`}>{children}</div>;
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-[#f4dcc0] py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="grid items-start gap-6 md:gap-8 md:grid-cols-[0.85fr_1.15fr]">
          <div className="pt-2 md:pt-8">
            <h3 className="text-2xl font-black uppercase leading-[1.03] sm:text-3xl md:text-[38px]">Build courses fast</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-black/75">
              Add videos, files, quizzes and pages using simple editor tools for teachers who
              want structure, full control and a clear workflow from day one.
            </p>
          </div>

          <BlockCard tone="bg-[#e4ec90]">
            <div className="rounded-xl border-2 border-black bg-[#eceef5] p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-[#d9dbf8] p-3">
                  <p className="text-[11px] font-black uppercase">Basic html and css</p>
                  <div className="mt-2 flex gap-1 text-[10px] font-bold">
                    <span className="border border-black px-1">24</span>
                    <span className="border border-black px-1">8</span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#efe6da] p-3">
                  <p className="text-[11px] font-black uppercase">Branding design</p>
                  <div className="mt-2 flex gap-1 text-[10px] font-bold">
                    <span className="border border-black px-1">24</span>
                    <span className="border border-black px-1">8</span>
                  </div>
                </div>
              </div>
            </div>
          </BlockCard>
        </div>

        <div className="my-3 hidden justify-center md:flex">
          <CurvedArrow />
        </div>

        <div className="grid items-center gap-6 md:gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <BlockCard tone="bg-[#cbe6e2]">
            <div className="rounded-xl border-2 border-black bg-[#f2f2f2] p-3">
              <div className="h-36 rounded-lg border border-black/20 bg-white p-3">
                <div className="grid h-full grid-cols-5 items-end gap-3">
                  {[44, 26, 54, 38, 20].map((h, index) => (
                    <div key={h} className="rounded-md bg-[#f58b45]" style={{ height: `${h}%` }}>
                      <span className="sr-only">bar {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlockCard>

          <div>
            <h3 className="text-2xl font-black uppercase leading-[1.03] sm:text-3xl md:text-[38px]">
              Focus on your students
            </h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-black/75">
              Send reminders, track activity and make learning interactive with smart tools that
              boost focus, motivation and student progress over time.
            </p>
          </div>
        </div>

        <div className="my-3 hidden justify-center md:flex">
          <CurvedArrow />
        </div>

        <div className="grid items-start gap-6 md:gap-8 md:grid-cols-[0.85fr_1.15fr]">
          <div className="pt-2 md:pt-8">
            <h3 className="text-2xl font-black uppercase leading-[1.03] sm:text-3xl md:text-[38px]">Track, learn, improve</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-black/75">
              Use built-in analytics to see what works, update your content and grow your course
              using real-time data that helps you improve every lesson.
            </p>
          </div>

          <BlockCard tone="bg-[#e5ccec]">
            <div className="rounded-xl border-2 border-black bg-[#f2f2f2] p-4">
              <h4 className="text-xl font-black">Leader Board</h4>
              <div className="mt-4 space-y-3 text-sm font-semibold">
                <div className="flex items-center justify-between border-t border-black/10 pt-3">
                  <span>1 Charlie Rawal</span>
                  <span>13.450</span>
                </div>
                <div className="flex items-center justify-between border-t border-black/10 pt-3">
                  <span>2 Ariana Agarwal</span>
                  <span>10.333</span>
                </div>
              </div>
            </div>
          </BlockCard>
        </div>
      </div>
    </section>
  );
}

