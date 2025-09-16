export default function SoftGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,112,242,0.16),transparent_60%)] blur-2xl" />
      <div className="absolute -top-16 right-[-10%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(77,177,255,0.14),transparent_60%)] blur-2xl" />
    </div>
  );
}