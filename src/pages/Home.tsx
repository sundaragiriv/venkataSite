import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { signals, fmt } from "../lib/signals";

export default function Home() {
  const latestSignals = signals.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-brand-light/5 to-transparent animate-gradient bg-[length:400%_400%]" />
        <div className="container max-w-wrap relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold text-brand-ink mb-6">
              SAP Architect & AI Pioneer
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Bridging enterprise systems with AI innovation through proven blueprints, 
              Vedic wisdom, and hands-on experimentation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Three Sections */}
      <section className="py-16">
        <div className="container max-w-wrap">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-soft border border-black/5"
            >
              <h3 className="text-xl font-semibold text-brand mb-3">Blueprint Stories</h3>
              <p className="text-slate-600 mb-4">
                Real-world SAP implementations with detailed case studies, 
                architecture diagrams, and measurable outcomes.
              </p>
              <a href="/work/example-project" className="text-brand hover:text-brand-light font-medium">
                View Case Studies →
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-soft border border-black/5"
            >
              <h3 className="text-xl font-semibold text-brand mb-3">Vedic Studio</h3>
              <p className="text-slate-600 mb-4">
                Ancient wisdom for modern teams. Sanskrit verses with 
                transliteration, audio, and practical applications.
              </p>
              <a href="/veda" className="text-brand hover:text-brand-light font-medium">
                Explore Wisdom →
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg p-6 shadow-soft border border-black/5"
            >
              <h3 className="text-xl font-semibold text-brand mb-3">AI Lab</h3>
              <p className="text-slate-600 mb-4">
                AI patterns for SAP environments. Principles, anti-patterns, 
                and hands-on experiments with enterprise context.
              </p>
              <a href="/ai" className="text-brand hover:text-brand-light font-medium">
                Enter Lab →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Signals */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-wrap">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-semibold text-brand-ink">Latest Signals</h2>
            <Link to="/signals" className="text-brand hover:text-brand-light font-medium">
              See all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {signals.length === 0 ? (
              <div className="rounded-2xl bg-white border border-black/10 p-6 text-slate-600">
                No posts yet. Add files to <code>content/signals/</code> with front-matter:
                <pre className="mt-2 text-xs">{`---
title: …
date: YYYY-MM-DD
tag: Tech|AI-in-SAP|Vedic
---`}</pre>
              </div>
            ) : (
              latestSignals.map((signal, i) => (
                <motion.div
                  key={signal.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                >
                  <Link to={`/signals/${signal.slug}`} className="block bg-white rounded-lg p-6 shadow-soft border border-black/5 hover:shadow-lg transition">
                    <div className="text-xs text-slate-500 mb-2">{fmt(signal.date)}</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{signal.title}</h3>
                    <div className="text-xs font-medium text-brand mb-2">{signal.tag}</div>
                    {signal.summary && <p className="text-sm text-slate-600">{signal.summary}</p>}
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-16">
        <div className="container max-w-wrap">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-brand-ink mb-4">About Venkata</h2>
            <p className="text-slate-600 mb-6">
              22+ years architecting SAP solutions, leading digital transformations, and exploring the intersection 
              of ancient wisdom with modern technology. From executive strategy to hands-on implementation.
            </p>
            <Link to="/about" className="inline-flex items-center px-6 py-3 bg-brand text-white rounded-lg font-medium hover:brightness-110 transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}