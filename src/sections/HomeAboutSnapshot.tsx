import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icons from "../components/IconLibrary";

function Tile({ to, children }: { to?: string; children: React.ReactNode }) {
  const C: any = to ? Link : "div";
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="h-full">
      <C to={to} className="block rounded-2xl bg-white border border-black/10 p-6 shadow-soft hover:shadow-lift h-full flex flex-col">
        {children}
      </C>
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-medium text-slate-500">{children}</div>;
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{k}</div>
      <div className="text-xl font-semibold text-slate-900">{v}</div>
    </div>
  );
}

function ChipBar({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i} className="px-2 py-0.5 rounded-md text-xs bg-brand/10 text-brand">
          {i}
        </span>
      ))}
    </div>
  );
}

function Arrow({ children }: { children: React.ReactNode }) {
  return <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand">{children} →</span>;
}

export default function HomeAboutSnapshot() {
  return (
    <section className="relative container max-w-wrap 2xl:max-w-wrapWide py-16">
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          About Venkata (Snapshot)
        </h2>
        <p className="mt-3 text-lg text-slate-600 max-w-prose">
          Architecting SAP CX & AI systems with measurable outcomes and Vedic clarity.
        </p>
      </div>

      <motion.div
        className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {/* Role & Focus */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/about">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand/10">
                <Icons.Target className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">SAP Solution & AI Architect</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Blueprints that ship. Telemetry-first. AI with guardrails.
                </p>
              </div>
            </div>
          </Tile>
        </motion.div>

        {/* Metrics */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile>
            <div className="flex items-center gap-2 mb-3">
              <Icons.Award className="h-4 w-4 text-brand" />
              <Label>Impact metrics</Label>
            </div>
            <ul className="grid grid-cols-3 gap-3 text-center">
              <Stat k="Programs" v="40+" />
              <Stat k="Cycle time ↓" v="60%" />
              <Stat k="Integrations" v="100+" />
            </ul>
          </Tile>
        </motion.div>

        {/* Systems */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/work">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Layers className="h-4 w-4 text-brand" />
              <Label>Systems I build</Label>
            </div>
            <ChipBar items={["Sales V2", "Service V2", "CPQ", "FSM", "CPI/BTP", "CDC/CDP"]} />
          </Tile>
        </motion.div>

        {/* AI patterns */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/ai">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Brain className="h-4 w-4 text-brand" />
              <Label>AI in SAP</Label>
            </div>
            <ChipBar items={["RAG", "Policy guards", "HITL", "Eval/Drift"]} />
          </Tile>
        </motion.div>

        {/* Recent case */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/work/cpq">
            <div className="flex items-center gap-2 mb-2">
              <Icons.TrendingUp className="h-4 w-4 text-green-600" />
              <Label>Recent case</Label>
            </div>
            <p className="text-sm text-slate-700">
              Sales Cloud V2 + CPQ — quote time ↓60% with governed pricing.
            </p>
            <Arrow>See story</Arrow>
          </Tile>
        </motion.div>

        {/* Vedic principle */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/veda">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Lightbulb className="h-4 w-4 text-amber-600" />
              <Label>Vedic principle</Label>
            </div>
            <p className="text-sm">"ahiṁsā prathamā dharmaḥ"—psychological safety → honest telemetry.</p>
            <Arrow>Explore Vedic Studio</Arrow>
          </Tile>
        </motion.div>
      </motion.div>

      {/* CTA row */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/about" className="btn-accent px-4 py-2 rounded-lg shadow-soft hover:brightness-110 transition flex items-center gap-2">
          <Icons.Users className="h-4 w-4" />
          Learn more on About
        </Link>
        <Link to="/configure" className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5 transition flex items-center gap-2">
          <Icons.Zap className="h-4 w-4" />
          Try the Configurator
        </Link>
      </div>
    </section>
  );
}