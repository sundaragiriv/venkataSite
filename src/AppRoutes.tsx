import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signals from "./pages/Signals";
import SignalPost from "./pages/SignalPost";
import WorkSlug from "./pages/WorkSlug";
import Veda from "./pages/Veda";
import VedaSlug from "./pages/VedaSlug";
import AI from "./pages/AI";
import AISlug from "./pages/AISlug";
import Blueprints from "./pages/Blueprints";
import BlueprintSlug from "./pages/BlueprintSlug";

export default function AppRoutes() {
  const location = useLocation();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
        transition={{ duration: reducedMotion ? 0 : 0.25 }}
      >
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/signals/:slug" element={<SignalPost />} />
          <Route path="/blueprints" element={<Blueprints />} />
          <Route path="/blueprints/:slug" element={<BlueprintSlug />} />
          <Route path="/work/:slug" element={<WorkSlug />} />
          <Route path="/veda" element={<Veda />} />
          <Route path="/veda/:slug" element={<VedaSlug />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/ai/:slug" element={<AISlug />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}