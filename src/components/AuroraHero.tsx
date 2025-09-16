export default function AuroraHero() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,112,242,.10),rgba(77,177,255,.10))] bg-[length:200%_200%] animate-gradient" />
      <div id="spotlight" className="pointer-events-none absolute inset-0"
           style={{ 
             WebkitMaskImage: 'radial-gradient(240px 240px at var(--mx, -100px) var(--my, -100px), #000 0%, transparent 70%)',
             maskImage: 'radial-gradient(240px 240px at var(--mx, -100px) var(--my, -100px), #000 0%, transparent 70%)'
           }} />
    </div>
  );
}