import { Link } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { motion } from "framer-motion";

export default function MinimalHero() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 opacity-60" />
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 opacity-30 animate-pulse" />
      <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* AI Neural Network SVG Background */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 800 400">
        <defs>
          <pattern id="neural" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="40" cy="40" r="2" fill="var(--brand-blue)" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#neural)" />
        <g stroke="var(--brand-blue)" strokeWidth="1" fill="none" opacity="0.2">
          <path d="M100,100 L200,150 L300,100 L400,180 L500,120" />
          <path d="M150,200 L250,250 L350,200 L450,280 L550,220" />
          <circle cx="100" cy="100" r="4" fill="var(--brand-blue)" />
          <circle cx="300" cy="100" r="4" fill="var(--accent-turmeric)" />
          <circle cx="500" cy="120" r="4" fill="var(--brand-blue)" />
        </g>
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        <FadeIn className="text-center max-w-4xl mx-auto">
          {/* Neural Glyph + Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="ai-glyph"></div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
              SAP Architect & AI Pioneer
            </h1>
          </div>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Designing enterprise S/4HANA and AI-powered CX that scale. 
            Practical blueprints, measurable outcomes, and short experiments.
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/work" className="btn-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-glow-lg hover:shadow-glow inline-flex items-center gap-2">
              Explore Blueprints
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/signals" className="btn-soft px-8 py-4 rounded-xl font-medium text-lg inline-flex items-center gap-2">
              Read the Latest Signal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        {/* Three-Funnel Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Blueprint Stories */}
          <motion.div 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 card-glow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Blueprint Stories</h3>
            </div>
            <p className="text-slate-600 mb-6">Enterprise-grade SAP implementations with measurable ROI and technical depth.</p>
            <Link to="/work" className="text-blue-600 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              View Case Studies
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Vedic Studio */}
          <motion.div 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 card-glow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Vedic Studio</h3>
            </div>
            <p className="text-slate-600 mb-6">Ancient wisdom principles applied to modern team dynamics and leadership.</p>
            <Link to="/veda" className="text-amber-600 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore Wisdom
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {/* AI Lab */}
          <motion.div 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 card-glow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">AI Lab</h3>
            </div>
            <p className="text-slate-600 mb-6">SAP Joule integration patterns, ML experiments, and enterprise AI implementations.</p>
            <Link to="/ai" className="text-purple-600 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
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