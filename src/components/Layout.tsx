import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="container max-w-wrap h-14 flex items-center justify-between">
          <a href="/" className="font-semibold tracking-tight text-slate-900">Venkata</a>
          <nav className="hidden md:flex gap-6 text-sm text-slate-600">
            <a href="/about" className="hover:text-slate-900">About</a>
            <a href="/signals" className="hover:text-slate-900">Signals</a>
            <a href="/veda" className="hover:text-slate-900">Vedic Studio</a>
            <a href="/ai" className="hover:text-slate-900">AI Lab</a>
          </nav>
          <a href="/contact" className="text-sm px-3 py-1.5 rounded-lg bg-brand text-white font-medium shadow-soft hover:brightness-110 transition">Contact</a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-black/5 mt-20">
        <div className="container max-w-wrap py-10 text-sm text-slate-500">© {new Date().getFullYear()} Venkata</div>
      </footer>
    </div>
  );
}