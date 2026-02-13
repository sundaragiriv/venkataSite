import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import useSpotlight from "../hooks/useSpotlight";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";
import MinimalHero from "../components/MinimalHero";
import AboutSnapshot from "../components/AboutSnapshot";
import FeaturedCaseStudy from "../components/FeaturedCaseStudy";

export default function Home() {
  const latestSignals = signals.slice(0, 3);

  // Enable spotlight on desktop with fine pointer and no reduced motion
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer:fine)").matches;
  useSpotlight(finePointer && !reducedMotion);

  return (
    <>
      <SEO />
      <div className="min-h-screen relative overflow-hidden">
        <MinimalHero />
        <AboutSnapshot />
        <FeaturedCaseStudy />

        {/* Latest Signals */}
        <section className="py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-dark-card/30"></div>
          <div className="container max-w-wrap px-6 lg:px-8 relative">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8 mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white font-sans">Latest Signals</h2>
                <Link to="/signals" className="text-sm text-[#00ff41] hover:text-white inline-flex items-center gap-2 transition-colors duration-300 group font-medium">
                  <span>See all</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </Link>
              </div>
            </FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {signals.length === 0 ? (
                <FadeIn>
                  <div className="p-6 card-glow text-secondary col-span-full">
                    No posts yet. Add files to <code className="text-accent font-medium">content/signals/</code> with front-matter:
                    <pre className="mt-3 text-xs bg-dark-card p-4 rounded-lg border border-dark-tertiary">{`---
title: …
date: YYYY-MM-DD
tag: Tech|AI-in-SAP|Vedic
---`}</pre>
                  </div>
                </FadeIn>
              ) : (
                latestSignals.map((signal) => (
                  <FadeIn key={signal.slug}>
                    <MotionCard className="p-0 card-glow group overflow-hidden h-full">
                      <Link to={`/signals/${signal.slug}`} className="block p-6 relative h-full flex flex-col">
                        <div className="relative flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-xs text-muted font-medium">{fmt(signal.date)}</div>
                            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-dark-tertiary text-accent border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                              {signal.primary}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-[#00ff41] transition-colors duration-300 line-clamp-2 font-sans">{signal.title}</h3>
                          {signal.summary && <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 line-clamp-3 mt-auto leading-relaxed">{signal.summary}</p>}
                        </div>
                      </Link>
                    </MotionCard>
                  </FadeIn>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}