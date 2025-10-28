import { Link } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";

export default function AboutSnapshot() {
  const skills = [
    "SAP S/4HANA", "Sales Cloud V2", "Service Cloud V2", "BTP Integration", 
    "SAP AI Toolkit", "Joule Assistant", "Machine Learning", "CX Analytics", 
    "Vedic Leadership", "Enterprise Architecture"
  ];

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="container mx-auto px-6 max-w-6xl">
        <FadeIn className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">About Venkata</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              22+ years architecting SAP solutions and AI-powered customer experiences. 
              I design clear blueprints, lead measurable programs, and translate Vedic 
              wisdom into modern team practices for Fortune 500 transformations.
            </p>
            <Link 
              to="/about" 
              className="text-blue-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all"
            >
              Read full bio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Skills Grid */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Core Expertise</h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200 text-sm font-medium text-slate-700 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}