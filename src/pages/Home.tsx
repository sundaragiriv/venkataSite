import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import useSpotlight from "../hooks/useSpotlight";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";
import MinimalHero from "../components/MinimalHero";
import AboutSnapshot from "../components/AboutSnapshot";
import FeaturedCaseStudy from "../components/FeaturedCaseStudy";
import { gridPatterns, spacing, typography } from "../lib/responsive";

export default function Home() {
  const latestSignals = signals.slice(0, 3);
  
  // Enable spotlight on desktop with fine pointer and no reduced motion
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer:fine)").matches;
  useSpotlight(finePointer && !reducedMotion);

  return (
    <>
      <SEO />
      <div className="min-h-screen">
        {/* Hero Section */}
        <MinimalHero />

        {/* About Venkata Snapshot */}
        <AboutSnapshot />

        {/* Featured Case Study */}
        <FeaturedCaseStudy />

        {/* Latest Signals */}
        <section className={`${spacing.sectionY} bg-slate-50`}>
          <div className={`container max-w-wrap ${spacing.container}`}>
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8 mb-6 sm:mb-8">
                <h2 className={`${typography.h2} text-brand-ink`}>Latest Signals</h2>
                <Link to="/signals" className={`${typography.nav} text-brand hover:text-brand-light inline-flex items-center gap-2 hover:gap-3 transition-all`}>
                  See all →
                </Link>
              </div>
            </FadeIn>
            <div className={gridPatterns.signals}>
              {signals.length === 0 ? (
                <FadeIn>
                  <div className={`${spacing.cardPadding} rounded-xl sm:rounded-2xl bg-white border border-black/10 text-slate-600 col-span-full`}>
                    No posts yet. Add files to <code>content/signals/</code> with front-matter:
                    <pre className="mt-2 text-xs">{`---
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
                      <Link to={`/signals/${signal.slug}`} className={`block ${spacing.cardPadding} relative h-full flex flex-col`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                        <div className="relative flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${typography.caption}`}>{fmt(signal.date)}</div>
                            <div className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                              signal.primary === 'SAP' ? 'bg-blue-100 text-blue-700' :
                              signal.primary === 'AI/ML' ? 'bg-purple-100 text-purple-700' :
                              signal.primary === 'Dharma' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {signal.primary}
                            </div>
                          </div>
                          <h3 className={`${typography.h4} text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2`}>{signal.title}</h3>
                          {signal.summary && <p className={`${typography.small} line-clamp-2 sm:line-clamp-3 mt-auto`}>{signal.summary}</p>}
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