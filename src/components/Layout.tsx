import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import FloatingGlyphs from "./FloatingGlyphs";
import { BrandLogo } from "./Brand";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand text-white px-4 py-2 rounded-lg z-50">
        Skip to content
      </a>
      {pathname.startsWith("/veda") && <FloatingGlyphs />}
      
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="container max-w-wrap h-14 flex items-center justify-between">
          <a href="/" className="hover:opacity-80 transition">
            <BrandLogo />
          </a>
          <nav className="hidden md:flex gap-6 text-sm text-slate-600">
            <a href="/about" className="hover:text-slate-900">About</a>
            <a href="/signals" className="hover:text-slate-900">Signals</a>
            <a href="/ai" className="hover:text-slate-900">AI Lab</a>
            <a href="/veda" className="hover:text-slate-900">Dharmic Wisdom</a>
          </nav>
          <a href="/contact" className="text-sm px-4 py-2 rounded-xl btn-gradient text-white font-medium">Contact</a>
        </div>
      </header>
      
      <main id="main-content" className="flex-1">{children}</main>
      
      <footer className="border-t border-black/5 mt-20 bg-slate-50">
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
                <li><a href="/ai" className="hover:text-brand">AI Lab</a></li>
                <li><a href="/veda" className="hover:text-brand">Dharmic Wisdom</a></li>
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