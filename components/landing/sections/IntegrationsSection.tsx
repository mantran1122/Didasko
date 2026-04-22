"use client";

import { useEffect, useRef } from "react";

const iconsRowTop = ["SL", "DB", "XD", "FG", "NT", "MC", "ZR", "CF", "PP", "GM"];
const iconsRowBottom = ["AP", "DR", "XD", "FG", "SL", "NT", "MC", "ZR", "CF", "GM"];

function IconTile({ label }: { label: string }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-black/45 bg-white/70 text-[14px] font-black text-black/45">
      {label}
    </div>
  );
}

export default function IntegrationsSection() {
  const topTrackRef = useRef<HTMLDivElement | null>(null);
  const bottomTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const topTrack = topTrackRef.current;
    const bottomTrack = bottomTrackRef.current;
    if (!topTrack || !bottomTrack) return;

    const singleSetWidth = iconsRowTop.length * (56 + 18);
    let animationFrame = 0;
    let lastTs = 0;
    let offset = 0;
    const speed = 36;

    const animate = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const delta = (ts - lastTs) / 1000;
      lastTs = ts;

      offset = (offset + speed * delta) % singleSetWidth;

      topTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;
      bottomTrack.style.transform = `translate3d(${-(singleSetWidth - offset)}px, 0, 0)`;

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section id="how-it-work" className="py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="pixel-frame bg-[#ebebeb] px-4 py-7 md:px-10 md:py-12">
          <div className="integrations-marquee">
            <div ref={topTrackRef} className="flex w-max gap-[18px] will-change-transform">
              {[...iconsRowTop, ...iconsRowTop].map((icon, index) => (
                <IconTile key={`top-${icon}-${index}`} label={icon} />
              ))}
            </div>
          </div>

          <div className="integrations-marquee mt-4">
            <div ref={bottomTrackRef} className="flex w-max gap-[18px] will-change-transform">
              {[...iconsRowBottom, ...iconsRowBottom].map((icon, index) => (
                <IconTile key={`bottom-${icon}-${index}`} label={icon} />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="pixel-chip bg-[#ffd6a5]">Integrations</p>
            <h2 className="section-title mt-5 text-3xl leading-[1.06] sm:text-4xl md:text-6xl">
              Seamless integration
              <br />
              with all your tools
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-black/60 md:text-lg">
              Integrations with your favorite apps streamline workflows, unify data, and boost
              e-learning platform efficiency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

