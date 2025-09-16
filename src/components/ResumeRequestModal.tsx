import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  resumeHref: string;
  emailTo: string;
};

export default function ResumeRequestModal({ open, onClose, resumeHref, emailTo }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  
  useEffect(() => {
    if (open && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input');
      firstInput?.focus();
    }
  }, [open]);

  if (!open) return null;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = (data.get("email") as string)?.trim();
    const ok = data.get("consent") === "on";
    if (!email || !ok) return;

    const subject = encodeURIComponent("Requesting your résumé");
    const body = encodeURIComponent(
      `Hi Venkata,\n\nPlease share your résumé.\n\nFrom: ${email}\n\n(Generated from venkataSite About page)`
    );
    window.open(`mailto:${emailTo}?subject=${subject}&body=${body}`, "_blank");

    // Store approval and reveal download button
    localStorage.setItem('resume-ok', '1');
    const dl = document.getElementById("resume-direct-link");
    if (dl) dl.removeAttribute("aria-disabled");
    
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true"
         className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
         onClick={onClose}>
      <div ref={modalRef} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
           onClick={(e)=>e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-slate-900">Request résumé</h3>
        <p className="mt-1 text-sm text-slate-600">
          Enter your email and confirm; your mail client opens a prefilled message.
          Then the direct download button will enable.
        </p>
        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <label className="text-sm">
            Email
            <input name="email" type="email" required
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand" />
          </label>
          <label className="inline-flex items-start gap-2 text-sm">
            <input name="consent" type="checkbox" className="mt-0.5" />
            <span>I'm requesting your résumé and consent to be contacted about relevant work.</span>
          </label>
          <div className="mt-2 flex gap-2">
            <button type="submit" className="btn-accent px-4 py-2 rounded-lg shadow-soft hover:brightness-110">
              Send email & enable download
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5">Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}