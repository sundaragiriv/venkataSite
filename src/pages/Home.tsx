import { Link } from "react-router-dom";
import useSpotlight from "../hooks/useSpotlight";
import { FadeIn } from "../components/FadeIn";
import SEO from "../components/SEO";
import MinimalHero from "../components/MinimalHero";
import AboutSnapshot from "../components/AboutSnapshot";
import FeaturedCaseStudy from "../components/FeaturedCaseStudy";

export default function Home() {
  // Enable spotlight on desktop with fine pointer and no reduced motion
  const canUseSpotlight =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer:fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useSpotlight(canUseSpotlight);

  return (
    <>
      <SEO />
      <div className="min-h-screen relative overflow-hidden">
        <MinimalHero />

        {/* In Development Status */}
        <section className="py-6 relative">
          <div className="container max-w-wrap px-6 lg:px-8">
            <FadeIn>
              <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-sm text-secondary">
                <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent mr-3">
                  NOW BUILDING
                </span>
                Architect Zero, the YouTube series, and the CCA Study App are all in progress. Early frameworks are available now, with full rollout in phases.
              </div>
            </FadeIn>
          </div>
        </section>

        <AboutSnapshot />
        <FeaturedCaseStudy />

        {/* Early Access */}
        <section className="py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-dark-card/30"></div>
          <div className="container max-w-wrap px-6 lg:px-8 relative">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8 mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white font-sans">Early Access Tracks</h2>
                <Link to="/contact" className="text-sm text-[#00ff41] hover:text-white inline-flex items-center gap-2 transition-colors duration-300 group font-medium">
                  <span>Join updates</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </Link>
              </div>
            </FadeIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FadeIn>
                <article className="p-6 card-glow h-full flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white font-sans">Architect Zero</h3>
                    <span className="text-[11px] uppercase tracking-wide rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent font-semibold">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">
                    Enterprise architecture playbooks, SAP execution patterns, and operator-ready frameworks are rolling out in phases.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Link to="/blueprints" className="text-sm text-[#00ff41] hover:text-white transition-colors">Explore blueprints</Link>
                    <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Request early access</Link>
                  </div>
                </article>
              </FadeIn>

              <FadeIn>
                <article className="p-6 card-glow h-full flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white font-sans">YouTube Channel</h3>
                    <span className="text-[11px] uppercase tracking-wide rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent font-semibold">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">
                    Architect Zero episode releases and implementation walkthroughs are in progress, with early-access learning drops.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <a href="https://youtube.com/@TheQuantumLearn" target="_blank" rel="noopener noreferrer" className="text-sm text-[#00ff41] hover:text-white transition-colors">Channel updates</a>
                    <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Get notified</Link>
                  </div>
                </article>
              </FadeIn>

              <FadeIn>
                <article className="p-6 card-glow h-full flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white font-sans">Consulting Engagements</h3>
                    <span className="text-[11px] uppercase tracking-wide rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent font-semibold">
                      Selective Intake
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">
                    Selected outcomes and delivery snapshots are shown publicly. Detailed resume and project history are shared in qualified conversations.
                  </p>
                  <div className="mt-5 space-y-3 rounded-lg border border-dark-tertiary bg-dark-card/50 p-4">
                    <div className="text-[11px] uppercase tracking-wide text-white/50">Best fit projects</div>
                    <ul className="space-y-2 text-sm text-white/75">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00ff41]" />
                        SAP CX modernization and Service/Sales V2 transformations
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00ff41]" />
                        CPQ, FSM, and S/4HANA integration architecture
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00ff41]" />
                        AI enablement with governance, telemetry, and rollout plans
                      </li>
                    </ul>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">Advisory</span>
                      <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">Architecture Review</span>
                      <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-accent">Execution Coaching</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <Link to="/about" className="text-sm text-[#00ff41] hover:text-white transition-colors">View profile</Link>
                    <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Start a conversation</Link>
                  </div>
                </article>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}