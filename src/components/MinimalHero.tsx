import { Link } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { motion } from "framer-motion";
import { gridPatterns, spacing, typography, interactive } from "../lib/responsive";

export default function MinimalHero() {
  return (
    <section className={`relative ${spacing.sectionY} lg:py-32 overflow-hidden bg-black`}>
      {/* Spiral Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-float">
            <path d="M100,100 m-80,0 a80,80 0 1,1 160,0 a70,70 0 1,1 -140,0 a60,60 0 1,1 120,0 a50,50 0 1,1 -100,0 a40,40 0 1,1 80,0 a30,30 0 1,1 -60,0 a20,20 0 1,1 40,0 a10,10 0 1,1 -20,0" 
                  stroke="#00ff41" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 w-64 h-64 opacity-3">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-float stagger-2">
            <circle cx="100" cy="100" r="80" stroke="#00ff41" strokeWidth="1" fill="none" opacity="0.3"/>
            <circle cx="100" cy="100" r="60" stroke="#00ff41" strokeWidth="1" fill="none" opacity="0.5"/>
            <circle cx="100" cy="100" r="40" stroke="#00ff41" strokeWidth="1" fill="none" opacity="0.7"/>
            <circle cx="100" cy="100" r="20" stroke="#00ff41" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <div className={`container mx-auto ${spacing.container} relative z-10`}>
        <FadeIn className="text-center max-w-4xl mx-auto">
          <h1 className={`${typography.h1} text-primary mb-4 sm:mb-6 font-bold`}>
            SAP Architect & AI Pioneer
          </h1>
          
          <p className={`${typography.lead} text-secondary mb-6 sm:mb-8 font-medium`}>
            Designing enterprise S/4HANA and AI-powered CX that scale. 
            Practical blueprints, measurable outcomes, and short experiments.
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16">
            <Link to="/blueprints" className="btn-gradient inline-flex items-center justify-center gap-2 transition-all">
              Explore Blueprints
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/signals" className="btn-soft inline-flex items-center justify-center gap-2 transition-all">
              Read Latest Signal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        {/* Three-Funnel Cards */}
        <motion.div 
          className={`${gridPatterns.hero} max-w-5xl mx-auto`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Blueprint Stories */}
          <motion.div 
            className="group card-glow p-8 hover-lift"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-tertiary border border-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">Blueprint Stories</h3>
            </div>
            <p className="text-secondary mb-6">Enterprise-grade SAP implementations with measurable ROI and technical depth.</p>
            <Link to="/work" className="text-accent font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              View Case Studies
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Dharmic Wisdom */}
          <motion.div 
            className="group card-glow p-8 hover-lift"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-tertiary border border-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">Dharmic Wisdom</h3>
            </div>
            <p className="text-secondary mb-6">Ancient wisdom principles applied to modern team dynamics and leadership.</p>
            <Link to="/veda" className="text-accent font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore Wisdom
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* AI Lab */}
          <motion.div 
            className="group card-glow p-8 hover-lift"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-dark-tertiary border border-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary">AI Lab</h3>
            </div>
            <p className="text-secondary mb-6">SAP Joule integration patterns, ML experiments, and enterprise AI implementations.</p>
            <Link to="/ai" className="text-accent font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              Enter Lab
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}