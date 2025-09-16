import { useState } from "react";
import clsx from "clsx";

export function Tabs({ tabs }: { tabs: { key: string; label: string; node: React.ReactNode; }[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  return (
    <div>
      <div className="flex gap-2 border-b border-black/10">
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => setActive(t.key)}
            className={clsx("px-3 py-2 text-sm rounded-t-md", active===t.key ? "bg-white border border-black/10 border-b-white text-slate-900" : "text-slate-600 hover:text-slate-900")}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="rounded-b-md border border-black/10 border-t-0 p-4 bg-white">
        {tabs.find(t => t.key===active)?.node}
      </div>
    </div>
  );
}