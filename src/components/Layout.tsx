import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import FloatingGlyphs from "./FloatingGlyphs";
import { BrandLogo } from "./Brand";
import AdBanner from "./AdBanner";
import MobileNav from "./MobileNav";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand text-white px-4 py-2 rounded-lg z-50">
        Skip to content
      </a>
      {pathname.startsWith("/veda") && <FloatingGlyphs />}
      
      {/* Sticky Navigation with margin from top */}
      <header className="sticky top-6 z-40 px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo - Left aligned but centered vertically */}
          <div className="flex items-center">
            <a href="/" className="hover:scale-105 transition-all duration-300">
              <BrandLogo />
            </a>
          </div>
          
          {/* Mobile Navigation */}
          <MobileNav />
          
          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-6 px-8 py-4 bg-dark-secondary backdrop-blur-md border border-dark-tertiary rounded-2xl">
            <a href="/about" className="text-sm text-white/80 hover:text-[#00ff41] transition-all duration-300 font-mono">
              About
            </a>
            <a href="/signals" className="text-sm text-white/80 hover:text-[#00ff41] transition-all duration-300 font-mono">
              Signals
            </a>
            <a href="/blueprints" className="text-sm text-white/80 hover:text-[#00ff41] transition-all duration-300 font-mono">
              Blueprints
            </a>
            <a href="/ai" className="text-sm text-white/80 hover:text-[#00ff41] transition-all duration-300 font-mono">
              AI Lab
            </a>
            <a href="/veda" className="text-sm text-white/80 hover:text-[#00ff41] transition-all duration-300 font-mono">
              Vedic Wisdom
            </a>
            <a href="/contact" className="text-sm bg-[#00ff41] text-black px-4 py-2 rounded-xl font-semibold hover:bg-[#00ff41]/90 transition-all duration-300">
              Let's Talk
            </a>
          </nav>
          
          {/* Social Icons - Right aligned but centered vertically */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-card border border-dark-tertiary text-muted hover:text-accent hover:border-accent transition-all duration-300 hover-lift">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://twitter.com/sundaragiri" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-card border border-dark-tertiary text-muted hover:text-accent hover:border-accent transition-all duration-300 hover-lift">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@sundaragiri" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-dark-card border border-dark-tertiary text-muted hover:text-accent hover:border-accent transition-all duration-300 hover-lift">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="flex-1">{children}</main>
      
      {/* Footer Ad */}
      <div className="border-t border-dark-tertiary mt-8 py-3 bg-dark-card">
        <div className="container max-w-wrap">
          <AdBanner 
            slot="1234567890" 
            style={{ display: 'block', width: '100%', height: '60px' }}
            className="mx-auto"
          />
        </div>
      </div>
      
      <footer className="border-t border-dark-tertiary bg-dark-secondary">
        <div className="container max-w-wrap py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <BrandLogo size="lg" />
              <p className="text-sm text-secondary leading-relaxed font-medium">
                SAP CX Architect • AI Pioneer • Vedic Wisdom
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Expertise</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li className="hover:text-accent transition-all duration-300 cursor-pointer hover:translate-x-1">Sales Cloud V2</li>
                <li className="hover:text-accent transition-all duration-300 cursor-pointer hover:translate-x-1">Service Cloud V2</li>
                <li className="hover:text-accent transition-all duration-300 cursor-pointer hover:translate-x-1">BTP Integration</li>
                <li className="hover:text-accent transition-all duration-300 cursor-pointer hover:translate-x-1">AI in SAP</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Content</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><a href="/signals" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">Signals</a></li>
                <li><a href="/blueprints" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">Blueprints</a></li>
                <li><a href="/ai" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">AI Lab</a></li>
                <li><a href="/veda" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">Vedic Wisdom</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">Connect</h4>
              <ul className="space-y-3 text-sm text-muted">
                <li><a href="/about" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">About</a></li>
                <li><a href="mailto:venkatagirivasan@gmail.com" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">Email</a></li>
                <li><a href="/rss.xml" className="hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block">RSS Feed</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-tertiary mt-12 pt-8 text-sm text-muted">
            © {new Date().getFullYear()} Venkata Sundaragiri. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}