import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import FloatingGlyphs from "./FloatingGlyphs";
import { BrandLogo } from "./Brand";
import AdBanner from "./AdBanner";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand text-white px-4 py-2 rounded-lg z-50">
        Skip to content
      </a>
      {pathname.startsWith("/veda") && <FloatingGlyphs />}
      
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="container max-w-wrap h-14 flex items-center">
          <a href="/" className="hover:opacity-80 transition">
            <BrandLogo />
          </a>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden ml-auto p-2 rounded-lg hover:bg-slate-100" aria-label="Open navigation menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 text-sm text-slate-600 ml-auto items-center">
            <a href="/about" className="hover:text-slate-900">About</a>
            <a href="/signals" className="hover:text-slate-900">Signals</a>
            <a href="/blueprints" className="hover:text-slate-900">Blueprints</a>
            <a href="/ai" className="hover:text-slate-900">AI Lab</a>
            <a href="/veda" className="hover:text-slate-900">Vedic Wisdom</a>
            <a href="/contact" className="text-sm px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
              Let's Talk
            </a>
            <div className="flex gap-3 ml-2">
              <a href="https://www.linkedin.com/in/sundaragiri" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://twitter.com/sundaragiri" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@sundaragiri" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </header>
      
      <main id="main-content" className="flex-1">{children}</main>
      
      {/* Footer Ad */}
      <div className="border-t border-black/5 mt-12 py-4 bg-slate-50">
        <div className="container max-w-wrap">
          <AdBanner 
            slot="1234567890" 
            style={{ display: 'block', width: '100%', height: '90px' }}
            className="mx-auto"
          />
        </div>
      </div>
      
      <footer className="border-t border-black/5 bg-slate-50">
        <div className="container max-w-wrap py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <BrandLogo size="lg" />
              <p className="mt-3 text-sm text-slate-600">
                SAP CX Architect • AI Pioneer • Vedic Wisdom
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Expertise</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Sales Cloud V2</li>
                <li>Service Cloud V2</li>
                <li>BTP Integration</li>
                <li>AI in SAP</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Content</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/signals" className="hover:text-brand">Signals</a></li>
                <li><a href="/blueprints" className="hover:text-brand">Blueprints</a></li>
                <li><a href="/ai" className="hover:text-brand">AI Lab</a></li>
                <li><a href="/veda" className="hover:text-brand">Vedic Wisdom</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/about" className="hover:text-brand">About</a></li>
                <li><a href="mailto:venkatagirivasan@gmail.com" className="hover:text-brand">Email</a></li>
                <li><a href="/rss.xml" className="hover:text-brand">RSS Feed</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-black/10 mt-8 pt-8 text-sm text-slate-500">
            © {new Date().getFullYear()} Venkata Sundaragiri. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}