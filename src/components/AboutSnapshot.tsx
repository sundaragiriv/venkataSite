import { Link } from "react-router-dom";
import { FadeIn } from "../components/FadeIn";

export default function AboutSnapshot() {
  const skills = [
    "SAP S/4HANA", "Sales Cloud V2", "Service Cloud V2", "BTP Integration", 
    "SAP AI Toolkit", "Joule Assistant", "Machine Learning", "CX Analytics", 
    "Vedic Leadership", "Enterprise Architecture"
  ];

  return (
    <section className="py-20 lg:py-28 bg-dark-secondary">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <FadeIn className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Text */}
          <div className="animate-slideInLeft">
            <h2 className="text-3xl font-bold text-primary mb-4">About Venkata</h2>
            <p className="text-lg text-secondary leading-relaxed mb-6 font-medium">
              22+ years architecting SAP solutions and AI-powered customer experiences. 
              I design clear blueprints, lead measurable programs, and translate Vedic 
              wisdom into modern team practices for Fortune 500 transformations.
            </p>
            <Link 
              to="/about" 
              className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all hover:text-primary"
            >
              Read full bio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Skills Grid with Spiral Pattern */}
          <div className="animate-slideInRight stagger-1 relative">
            {/* Spiral Background */}
            <div className="absolute -top-10 -right-10 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M50,50 m-40,0 a40,40 0 1,1 80,0 a35,35 0 1,1 -70,0 a30,30 0 1,1 60,0 a25,25 0 1,1 -50,0 a20,20 0 1,1 40,0 a15,15 0 1,1 -30,0 a10,10 0 1,1 20,0 a5,5 0 1,1 -10,0" 
                      stroke="#00ff41" strokeWidth="1" fill="none"/>
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-primary mb-4">Core Expertise</h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className={`card-glow px-4 py-3 text-sm font-medium text-secondary hover:text-accent transition-all hover-lift animate-fadeInUp stagger-${index % 3 + 1}`}
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