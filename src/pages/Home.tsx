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
      <div className="min-h-screen">
        {/* Hero Section */}
        <MinimalHero />

        {/* About Venkata Snapshot */}
        <AboutSnapshot />

        {/* Featured Case Study */}
        <FeaturedCaseStudy />

        {/* Latest Signals */}
        <section className="py-16 bg-slate-50">
          <div className="container max-w-wrap">
            <FadeIn>
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl font-semibold text-brand-ink">Latest Signals</h2>
                <Link to="/signals" className="text-brand hover:text-brand-light font-medium">
                  See all →
                </Link>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-6">
              {signals.length === 0 ? (
                <FadeIn>
                  <div className="rounded-2xl bg-white border border-black/10 p-6 text-slate-600">
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
                    <MotionCard className="p-0 card-glow group overflow-hidden">
                      <Link to={`/signals/${signal.slug}`} className="block p-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-slate-500">{fmt(signal.date)}</div>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                              signal.primary === 'SAP' ? 'bg-blue-100 text-blue-700' :
                              signal.primary === 'AI/ML' ? 'bg-purple-100 text-purple-700' :
                              signal.primary === 'Dharma' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {signal.primary}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{signal.title}</h3>
                          {signal.summary && <p className="text-sm text-slate-600 line-clamp-2">{signal.summary}</p>}
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