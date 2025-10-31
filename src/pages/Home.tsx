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
      <div className="min-h-screen relative overflow-hidden">
        {/* Fluid Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-400/3 rounded-full blur-3xl animate-float stagger-2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-600/4 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Hero Section */}
        <div className="animate-fadeInUp">
          <MinimalHero />
        </div>

        {/* About Venkata Snapshot */}
        <div className="animate-slideInLeft stagger-1">
          <AboutSnapshot />
        </div>

        {/* Featured Case Study */}
        <div className="animate-slideInRight stagger-2">
          <FeaturedCaseStudy />
        </div>

        {/* Latest Signals */}
        <section className={`${spacing.sectionY} relative`}>
          <div className="absolute inset-0 bg-dark-card/30"></div>
          <div className={`container max-w-wrap ${spacing.container} relative`}>
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8 mb-8 sm:mb-12">
                <h2 className={`${typography.h2} text-primary font-bold`}>Latest Signals</h2>
                <Link to="/signals" className={`${typography.nav} text-accent hover:text-primary inline-flex items-center gap-2 hover:gap-4 transition-all duration-300 group font-medium`}>
                  <span>See all</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
              </div>
            </FadeIn>
            <div className={`${gridPatterns.signals} gap-6`}>
              {signals.length === 0 ? (
                <FadeIn>
                  <div className={`${spacing.cardPadding} card-glow text-secondary col-span-full`}>
                    No posts yet. Add files to <code className="text-accent font-medium">content/signals/</code> with front-matter:
                    <pre className="mt-3 text-xs bg-dark-card p-4 rounded-lg border border-dark-tertiary">{`---
title: …
date: YYYY-MM-DD
tag: Tech|AI-in-SAP|Vedic
---`}</pre>
                  </div>
                </FadeIn>
              ) : (
                latestSignals.map((signal, index) => (
                  <FadeIn key={signal.slug}>
                    <MotionCard className={`p-0 card-glow group overflow-hidden h-full animate-fadeInUp stagger-${index + 1}`}>
                      <Link to={`/signals/${signal.slug}`} className={`block ${spacing.cardPadding} relative h-full flex flex-col`}>
                        <div className="relative flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${typography.caption} text-muted font-medium`}>{fmt(signal.date)}</div>
                            <div className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg bg-dark-tertiary text-accent border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                              {signal.primary}
                            </div>
                          </div>
                          <h3 className={`${typography.h4} text-primary mb-4 group-hover:text-accent transition-all duration-300 line-clamp-2 font-semibold`}>{signal.title}</h3>
                          {signal.summary && <p className={`${typography.small} text-secondary group-hover:text-primary transition-colors duration-300 line-clamp-2 sm:line-clamp-3 mt-auto leading-relaxed`}>{signal.summary}</p>}
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