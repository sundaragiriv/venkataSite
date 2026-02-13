import { Link } from "react-router-dom";
import { FadeIn } from "./FadeIn";
import { motion } from "framer-motion";

export default function MinimalHero() {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden bg-black">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 sm:mb-8 font-sans leading-[1.1]">
            SAP Architect &<br className="hidden sm:block" /> AI Pioneer
          </h1>

          <p className="text-lg sm:text-xl text-white/60 mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
            Designing enterprise S/4HANA and AI-powered CX that scale.
            Practical blueprints, measurable outcomes, and short experiments.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 lg:mb-28">
            <Link to="/blueprints" className="btn-gradient inline-flex items-center justify-center gap-2">
              Explore Blueprints
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/signals" className="btn-soft inline-flex items-center justify-center gap-2">
              Read Latest Signal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </FadeIn>

        {/* Three-Funnel Cards */}
        <motion.div
          className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            {
              title: "Blueprint Stories",
              desc: "Enterprise-grade SAP implementations with measurable ROI and technical depth.",
              link: "/blueprints",
              linkText: "View Blueprints",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            },
            {
              title: "Dharmic Wisdom",
              desc: "Ancient wisdom principles applied to modern team dynamics and leadership.",
              link: "/veda",
              linkText: "Explore Wisdom",
              icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
            },
            {
              title: "AI Lab",
              desc: "SAP Joule integration patterns, ML experiments, and enterprise AI implementations.",
              link: "/ai",
              linkText: "Enter Lab",
              icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              className="group card-glow p-8"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00ff41]/10 border border-[#00ff41]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white font-sans">{card.title}</h3>
              </div>
              <p className="text-white/50 mb-6 text-sm leading-relaxed">{card.desc}</p>
              <Link to={card.link} className="text-[#00ff41] text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                {card.linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
