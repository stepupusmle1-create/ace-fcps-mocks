import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ClipboardList, LayoutGrid, ShieldCheck, Sparkles, Timer } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/dashboard");

  return (
    <div className="relative overflow-hidden bg-mesh">
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3.5 py-1.5 text-[13px] font-semibold text-gold-700">
          <Sparkles size={13} /> FCPS Part 1 Preparation
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Practice like exam day,
          <br className="hidden sm:block" /> system by system
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          Timed system-wise mocks to build confidence subject by subject, then a full-length
          Grand Mock that mirrors the real FCPS exam experience.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 px-7 py-3.5 text-sm font-bold text-white shadow-premium transition hover:shadow-lg"
          >
            Get started free
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            I already have an account
          </Link>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] font-medium text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" /> 100% free &middot; no card required
        </p>

        <div className="mt-20 grid gap-5 text-left sm:grid-cols-3">
          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <LayoutGrid size={22} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">System-wise mocks</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Focused, timed tests per subject &mdash; Anatomy, Physiology, Pathology, and more.
            </p>
          </div>
          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
              <Timer size={22} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">Grand Mock</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              A full-length, mixed-system exam simulation with real exam-style timing.
            </p>
          </div>
          <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ClipboardList size={22} />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">Detailed review</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Score breakdowns by system, explanations for every question, and full history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
