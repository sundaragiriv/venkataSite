import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import useSpotlight from "../hooks/useSpotlight";
import AuroraHero from "../components/AuroraHero";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";
import HomeAboutSnapshot from "../sections/HomeAboutSnapshot";
import { BrandTagline } from "../components/Brand";

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
        <section className="relative py-20 overflow-hidden">
          <AuroraHero />
          <div className="container max-w-wrap relative">
            <FadeIn className="text-center max-w-3xl mx-auto">
              <div className="mb-4">
                <BrandTagline />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-brand-700 to-slate-900 bg-clip-text text-transparent mb-6">
                SAP Architect & AI Pioneer
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Bridging enterprise systems with AI innovation through proven blueprints, 
                Vedic wisdom, and hands-on experimentation.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/configure" className="btn-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-glow-lg hover:shadow-glow group" onMouseEnter={() => import("../pages/Configure")}>
                  <span className="flex items-center gap-2">
                    Try the Configurator
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Three Sections */}
        <section className="py-16">
          <div className="container max-w-wrap">
            <div className="grid md:grid-cols-3 gap-8">
              <FadeIn>
                <MotionCard className="card-glow group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200">
                      <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-brand-700 to-brand-600 bg-clip-text text-transparent">Blueprint Stories</h3>
                  </div>
                  <p className="text-slate-600 mb-4 flex-1">
                    Real-world SAP implementations with detailed case studies, 
                    architecture diagrams, and measurable outcomes.
                  </p>
                  <a href="/work/example-project" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium group-hover:gap-3 transition-all">
                    View Case Studies
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </MotionCard>
              </FadeIn>

              <FadeIn>
                <MotionCard className="card-glow group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-vedic/20 to-vedic/30">
                      <svg className="w-5 h-5 text-vedic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-vedic to-amber-600 bg-clip-text text-transparent">Vedic Studio</h3>
                  </div>
                  <p className="text-slate-600 mb-4 flex-1">
                    Ancient wisdom for modern teams. Sanskrit verses with 
                    transliteration, audio, and practical applications.
                  </p>
                  <a href="/veda" className="inline-flex items-center gap-2 text-vedic hover:text-amber-700 font-medium group-hover:gap-3 transition-all">
                    Explore Wisdom
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </MotionCard>
              </FadeIn>

              <FadeIn>
                <MotionCard className="card-glow group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">AI Lab</h3>
                  </div>
                  <p className="text-slate-600 mb-4 flex-1">
                    AI patterns for SAP environments. Principles, anti-patterns, 
                    and hands-on experiments with enterprise context.
                  </p>
                  <a href="/ai" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium group-hover:gap-3 transition-all">
                    Enter Lab
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </MotionCard>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* About Venkata Snapshot */}
        <HomeAboutSnapshot />

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
                latestSignals.map((signal, i) => (
                  <FadeIn key={signal.slug}>
                    <MotionCard className="p-0 card-glow group overflow-hidden">
                      <Link to={`/signals/${signal.slug}`} className="block p-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-slate-500">{fmt(signal.date)}</div>
                            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                              signal.tag === 'Tech' ? 'bg-blue-100 text-blue-700' :
                              signal.tag === 'AI-in-SAP' ? 'bg-purple-100 text-purple-700' :
                              signal.tag === 'Vedic' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{signal.tag}</div>
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