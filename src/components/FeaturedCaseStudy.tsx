import { Link } from "react-router-dom";
import { FadeIn } from "./FadeIn";

export default function FeaturedCaseStudy() {
  return (
    <section className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Spiral Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <defs>
            <pattern id="spiral-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M100,100 m-80,0 a80,80 0 1,1 160,0 a70,70 0 1,1 -140,0 a60,60 0 1,1 120,0 a50,50 0 1,1 -100,0 a40,40 0 1,1 80,0 a30,30 0 1,1 -60,0 a20,20 0 1,1 40,0 a10,10 0 1,1 -20,0" 
                    stroke="#00ff41" strokeWidth="1" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spiral-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Featured Blueprint</h2>
          <p className="text-lg text-secondary">Enterprise implementation with measurable ROI</p>
        </FadeIn>
        
        <FadeIn className="card-glow overflow-hidden max-w-4xl mx-auto hover-lift">
          <div className="lg:grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
                <span className="text-sm font-semibold text-accent uppercase tracking-wide">Live Case Study</span>
              </div>
              
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sales Cloud V2 + CPQ Integration
              </h3>
              
              <p className="text-secondary mb-6 leading-relaxed font-medium">
                Fortune 500 manufacturer achieved 60% faster quote generation and 
                90% reduction in pricing errors through governed SAP CPQ automation 
                with real-time S/4HANA integration.
              </p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-2xl font-bold text-accent">60%</div>
                  <div className="text-sm text-muted">Faster Quotes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">90%</div>
                  <div className="text-sm text-muted">Error Reduction</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/blueprints"
                  className="btn-gradient inline-flex items-center gap-2"
                >
                  Explore Blueprints
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="btn-soft inline-flex items-center gap-2"
                >
                  Request Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Visual with Spiral */}
            <div className="bg-dark-tertiary p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <circle cx="200" cy="150" r="120" stroke="#00ff41" strokeWidth="2" fill="none" opacity="0.3"/>
                  <circle cx="200" cy="150" r="90" stroke="#00ff41" strokeWidth="2" fill="none" opacity="0.5"/>
                  <circle cx="200" cy="150" r="60" stroke="#00ff41" strokeWidth="2" fill="none" opacity="0.7"/>
                  <circle cx="200" cy="150" r="30" stroke="#00ff41" strokeWidth="3" fill="none"/>
                </svg>
              </div>
              <div className="relative text-center text-primary">
                <div className="text-4xl font-bold mb-2">SAP CPQ</div>
                <div className="text-lg text-secondary mb-6">Architecture Blueprint</div>
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}