"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

async function setAccess(payload: { userId?: string; email?: string; grant: boolean }) {
  const res = await fetch("/api/admin/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

// Per-row button in the students table.
export function AccessButton({ userId, hasAccess, name }: { userId: string; hasAccess: boolean; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (hasAccess && !window.confirm(`Remove full access for ${name}?`)) return;
    setBusy(true);
    await setAccess({ userId, grant: !hasAccess });
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={
        hasAccess
          ? "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          : "inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
      }
    >
      {busy && <Loader2 size={12} className="animate-spin" />}
      {hasAccess ? "Remove access" : "Confirm & give access"}
    </button>
  );
}

// "Type the confirmed email, press the button" box at the top of the admin page.
export function GrantByEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    const { ok, data } = await setAccess({ email, grant: true });
    setBusy(false);
    if (ok) {
      setResult({ ok: true, text: `Full access is now ON for ${data.user.name} (${data.user.email}).` });
      setEmail("");
      router.refresh();
    } else {
      setResult({ ok: false, text: data.error ?? "Something went wrong." });
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Confirm an email and give full access</h2>
      <p className="mt-0.5 text-[13px] text-slate-500">
        After a student pays and sends the screenshot, type the email they signed up with. Mocks, Q Bank and Recalls open for them straight away.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@example.com"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
        >
          {busy && <Loader2 size={14} className="animate-spin" />} Confirm &amp; give full access
        </button>
      </div>
      {result && (
        <p className={`mt-3 flex items-start gap-2 text-sm ${result.ok ? "text-emerald-700" : "text-red-600"}`}>
          {result.ok ? <CheckCircle2 size={16} className="mt-0.5 flex-none" /> : <XCircle size={16} className="mt-0.5 flex-none" />}
          {result.text}
        </p>
      )}
    </form>
  );
}
