type Opt = { key: string; label: string };

export default function ToggleGroup({
  label, value, options, onChange
}: { label: string; value: string; options: Opt[]; onChange: (k: string) => void }) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o.key}
            onClick={() => onChange(o.key)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${value === o.key ? "bg-brand text-white border-brand" : "border-black/10 text-slate-700 hover:bg-black/5"}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}