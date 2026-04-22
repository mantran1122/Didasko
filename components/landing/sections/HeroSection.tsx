"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const element = sectionRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height * 0.5);
      setProgress(clamp(raw, 0, 1));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const liftProgress = clamp((progress - 0.04) / 0.9, 0, 1);
  const easedLift = liftProgress * liftProgress * (3 - 2 * liftProgress);
  const imageTranslate = 64 - easedLift * 64;
  const imageScale = 0.86 + easedLift * 0.14;
  const imageTiltX = 72 - easedLift * 72;
  const imageRotateZ = -2 + easedLift * 2;
  const textTranslate = progress * -14;

  return (
    <section ref={sectionRef} className="py-10 md:py-14 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="pixel-chip bg-[#ffd6a5]">Over 50k courses launched</p>

          <h1
            className="section-title mt-6 text-3xl leading-[1.03] sm:text-4xl md:text-6xl lg:text-7xl"
            style={{ transform: `translateY(${textTranslate}px)` }}
          >
            Launch and run your
            <br />
            course with ease
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-7 text-black/65 md:text-lg md:leading-8">
            Everything you need is in one place, so you can focus on creating great lessons,
            supporting your students, and building a lasting learning experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <a href="#pricing" className="pixel-btn bg-[#ffbe0b] px-5 py-2.5 text-base text-black md:px-7 md:py-3 md:text-lg">
              Start for free
            </a>
            <a href="#pricing" className="pixel-btn bg-white px-5 py-2.5 text-base text-black md:px-7 md:py-3 md:text-lg">
              Compare plans
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl [perspective:1800px]">
          <div
            className="relative [transform-style:preserve-3d] will-change-transform"
            style={{
              transform: `translateY(${imageTranslate}px) scale(${imageScale}) rotateX(${imageTiltX}deg) rotateZ(${imageRotateZ}deg)`,
              transformOrigin: "center bottom",
              transition: "transform 120ms linear",
            }}
          >
            <div className="absolute -left-6 -top-6 h-12 w-12 border-4 border-black bg-[#caffbf]" />
            <div className="absolute -bottom-6 -right-6 h-12 w-12 border-4 border-black bg-[#ffadad]" />

            <div className="pixel-frame overflow-hidden bg-[#bde0fe] p-2">
              <Image
                src="/hero.jpg"
                alt="Dashboard preview"
                width={1400}
                height={800}
                priority
                className="h-full w-full border-4 border-black object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

