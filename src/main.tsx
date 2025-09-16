import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Signals from "./pages/Signals";
import SignalPost from "./pages/SignalPost";
import WorkSlug from "./pages/WorkSlug";
import Veda from "./pages/Veda";
import VedaSlug from "./pages/VedaSlug";
import AI from "./pages/AI";
import AISlug from "./pages/AISlug";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/">
    <Layout>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/signals" element={<Signals/>} />
        <Route path="/signals/:slug" element={<SignalPost/>} />
        <Route path="/work/:slug" element={<WorkSlug/>} />
        <Route path="/veda" element={<Veda/>} />
        <Route path="/veda/:slug" element={<VedaSlug/>} />
        <Route path="/ai" element={<AI/>} />
        <Route path="/ai/:slug" element={<AISlug/>} />
        <Route path="*" element={<Home/>} />
      </Routes>
    </Layout>
  </BrowserRouter>
);