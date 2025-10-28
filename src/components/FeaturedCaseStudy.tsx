import { Link } from "react-router-dom";
import { FadeIn } from "./FadeIn";

export default function FeaturedCaseStudy() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Blueprint</h2>
          <p className="text-lg text-slate-600">Enterprise implementation with measurable ROI</p>
        </FadeIn>
        
        <FadeIn className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="lg:grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Live Case Study</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Sales Cloud V2 + CPQ Integration
              </h3>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                Fortune 500 manufacturer achieved 60% faster quote generation and 
                90% reduction in pricing errors through governed SAP CPQ automation 
                with real-time S/4HANA integration.
              </p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-2xl font-bold text-blue-600">60%</div>
                  <div className="text-sm text-slate-500">Faster Quotes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">90%</div>
                  <div className="text-sm text-slate-500">Error Reduction</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link 
                  to="/work/cpq-automation" 
                  className="btn-gradient text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
                >
                  View Full Case Study
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a 
                  href="/assets/cpq-blueprint.pdf" 
                  download 
                  className="btn-soft px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2"
                >
                  Download PDF
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Visual */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <div className="relative text-center text-white">
                <div className="text-4xl font-bold mb-2">SAP CPQ</div>
                <div className="text-lg opacity-90 mb-6">Architecture Blueprint</div>
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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