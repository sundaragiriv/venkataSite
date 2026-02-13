import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icons from "../components/IconLibrary";

function Tile({ to, children }: { to?: string; children: React.ReactNode }) {
  const C = (to ? Link : "div") as React.ElementType;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="h-full"
    >
      <C to={to} className="block rounded-2xl card-glow p-6 h-full flex flex-col group">
        <div className="relative overflow-hidden rounded-xl">
          {children}
        </div>
      </C>
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-medium text-muted">{children}</div>;
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs text-muted">{k}</div>
      <div className="text-xl font-semibold text-primary">{v}</div>
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
  return <span className="mt-3 inline-flex items-center gap-1 text-sm text-accent">{children} &rarr;</span>;
}

export default function HomeAboutSnapshot() {
  return (
    <section className="relative container max-w-wrap 2xl:max-w-wrapWide py-20 lg:py-28 px-6 lg:px-8">
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">
          About Venkata
        </h2>
        <p className="mt-3 text-lg text-secondary max-w-prose">
          Architecting SAP CX & AI systems with measurable outcomes and Vedic clarity.
        </p>
      </div>

      <motion.div
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
                <h3 className="text-lg font-semibold text-primary">SAP Solution & AI Architect</h3>
                <p className="mt-1 text-sm text-secondary">
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
          <Tile to="/blueprints">
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
          <Tile to="/blueprints">
            <div className="flex items-center gap-2 mb-2">
              <Icons.TrendingUp className="h-4 w-4 text-accent" />
              <Label>Recent case</Label>
            </div>
            <p className="text-sm text-secondary">
              Sales Cloud V2 + CPQ &mdash; quote time &darr;60% with governed pricing.
            </p>
            <Arrow>See story</Arrow>
          </Tile>
        </motion.div>

        {/* Vedic principle */}
        <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <Tile to="/veda">
            <div className="flex items-center gap-2 mb-2">
              <Icons.Lightbulb className="h-4 w-4 text-accent" />
              <Label>Vedic principle</Label>
            </div>
            <p className="text-sm text-secondary">&ldquo;ahiṁsā prathamā dharmaḥ&rdquo;&mdash;psychological safety &rarr; honest telemetry.</p>
            <Arrow>Explore Dharmic Wisdom</Arrow>
          </Tile>
        </motion.div>
      </motion.div>

      {/* CTA row */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/about" className="btn-gradient px-6 py-3 rounded-xl font-medium flex items-center gap-2 group">
          <Icons.Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Learn more on About
        </Link>
      </div>
    </section>
  );
}
