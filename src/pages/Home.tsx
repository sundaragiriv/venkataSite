import { motion } from "framer-motion";

export default function Home() {
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
    </div>
  );
}