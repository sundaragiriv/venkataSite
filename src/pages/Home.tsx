import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";
import useSpotlight from "../hooks/useSpotlight";
import AuroraHero from "../components/AuroraHero";
import MotionCard from "../components/MotionCard";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";
import HomeAboutSnapshot from "../sections/HomeAboutSnapshot";

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
            <h1 className="text-5xl font-bold text-brand-ink mb-6">
              SAP Architect & AI Pioneer
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Bridging enterprise systems with AI innovation through proven blueprints, 
              Vedic wisdom, and hands-on experimentation.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/configure" className="btn-accent px-6 py-3 rounded-lg shadow-soft hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2" onMouseEnter={() => import("../pages/Configure")}>
                Try the Configurator
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
              <MotionCard>
                <h3 className="text-xl font-semibold text-brand mb-3">Blueprint Stories</h3>
                <p className="text-slate-600 mb-4">
                  Real-world SAP implementations with detailed case studies, 
                  architecture diagrams, and measurable outcomes.
                </p>
                <a href="/work/example-project" className="text-brand hover:text-brand-light font-medium">
                  View Case Studies →
                </a>
              </MotionCard>
            </FadeIn>

            <FadeIn>
              <MotionCard>
                <h3 className="text-xl font-semibold text-brand mb-3">Vedic Studio</h3>
                <p className="text-slate-600 mb-4">
                  Ancient wisdom for modern teams. Sanskrit verses with 
                  transliteration, audio, and practical applications.
                </p>
                <a href="/veda" className="text-brand hover:text-brand-light font-medium">
                  Explore Wisdom →
                </a>
              </MotionCard>
            </FadeIn>

            <FadeIn>
              <MotionCard>
                <h3 className="text-xl font-semibold text-brand mb-3">AI Lab</h3>
                <p className="text-slate-600 mb-4">
                  AI patterns for SAP environments. Principles, anti-patterns, 
                  and hands-on experiments with enterprise context.
                </p>
                <a href="/ai" className="text-brand hover:text-brand-light font-medium">
                  Enter Lab →
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
                  <MotionCard className="p-0">
                    <Link to={`/signals/${signal.slug}`} className="block p-6">
                      <div className="text-xs text-slate-500 mb-2">{fmt(signal.date)}</div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{signal.title}</h3>
                      <div className="text-xs font-medium text-brand mb-2">{signal.tag}</div>
                      {signal.summary && <p className="text-sm text-slate-600">{signal.summary}</p>}
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