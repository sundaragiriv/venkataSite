import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Tile({ to, children }: { to?: string; children: React.ReactNode }) {
  const C: any = to ? Link : "div";
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
      <C to={to} className="block rounded-2xl bg-white border border-black/10 p-6 shadow-soft hover:shadow-lift">
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
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">About Venkata (Snapshot)</h2>
      <p className="mt-2 text-slate-600 max-w-prose">
        Architecting SAP CX & AI systems with measurable outcomes and Vedic clarity.
      </p>

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
            <h3 className="text-lg font-semibold">SAP Solution & AI Architect</h3>
            <p className="mt-1 text-sm text-slate-600">
              Blueprints that ship. Telemetry-first. AI with guardrails.
            </p>
          </Tile>
        </motion.div>

        {/* Metrics */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile>
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
            <Label>Systems I build</Label>
            <ChipBar items={["Sales V2", "Service V2", "CPQ", "FSM", "CPI/BTP", "CDC/CDP"]} />
          </Tile>
        </motion.div>

        {/* AI patterns */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/ai">
            <Label>AI in SAP</Label>
            <ChipBar items={["RAG", "Policy guards", "HITL", "Eval/Drift"]} />
          </Tile>
        </motion.div>

        {/* Recent case */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/work/cpq">
            <Label>Recent case</Label>
            <p className="text-sm text-slate-700">
              Sales Cloud V2 + CPQ — quote time ↓60% with governed pricing.
            </p>
            <Arrow>See story</Arrow>
          </Tile>
        </motion.div>

        {/* Vedic principle */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/veda">
            <Label>Vedic principle</Label>
            <p className="text-sm">"ahiṁsā prathamā dharmaḥ"—psychological safety → honest telemetry.</p>
            <Arrow>Explore Vedic Studio</Arrow>
          </Tile>
        </motion.div>
      </motion.div>

      {/* CTA row */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/about" className="btn-accent px-4 py-2 rounded-lg shadow-soft">
          Learn more on About
        </Link>
        <Link to="/configure" className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5">
          Try the Configurator
        </Link>
      </div>
    </section>
  );
}