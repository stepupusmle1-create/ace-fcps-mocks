import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { RegisterSlotBanner } from "@/components/register-slot-banner";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/dashboard");

  return (
    <div>
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

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <RegisterSlotBanner />
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
          <Link
            href="/exams"
            className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-500 via-gold-600 to-amber-700 p-7 text-white shadow-premium transition hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                <Trophy size={13} /> Every mock format
              </span>
              <h2 className="mt-3 text-xl font-bold">Explore the mock exams</h2>
              <p className="mt-1 max-w-md text-sm text-white/85">
                System mocks, the Grand Mock, Tutor mode, and Attempt Recalls &mdash; see exactly what
                you get, free.
              </p>
            </div>
            <span className="relative flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-gold-700 shadow-sm transition group-hover:bg-gold-50">
              View mocks <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>

          <Link
            href="/program"
            className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-7 text-white shadow-premium transition hover:shadow-lg"
          >
            <div
              className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-gold-400/10 blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                <BookOpen size={13} /> Full 3-month program
              </span>
              <h2 className="mt-3 text-xl font-bold">See the complete Program Details</h2>
              <p className="mt-1 max-w-md text-sm text-white/80">
                60-day first pass through every subject, then a 25-day grand review &mdash; with all
                mocks on this platform included free.
              </p>
            </div>
            <span className="relative flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 shadow-sm transition group-hover:bg-brand-50">
              View program <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
