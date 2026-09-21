import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const FIRST_PASS_SUBJECTS = [
  "Cell Biology",
  "Renal",
  "Endocrine",
  "Pulmonology",
  "Cardiology",
  "GIT",
  "Haematology",
  "Immunology",
  "Pathology",
  "MSK",
  "Histology",
  "Microbiology",
  "Biochemistry",
  "Biostatistics",
  "Pharmacology (all chapters)",
  "Neuro",
  "Oncology",
];

const REFERENCE_BOOKS = [
  "BRS Physiology",
  "First Aid",
  "Pathoma",
  "Snell's Anatomy",
  "Rafi Ullah",
  "AA Gynaecology",
  "Latest SK",
];

const PROGRAM_STATS = [
  { icon: Calendar, label: "Total duration", value: "~3 months" },
  { icon: BookOpen, label: "Phase 1 — First pass", value: "60 days" },
  { icon: CheckCircle2, label: "Phase 2 — Grand review", value: "25 days" },
  { icon: Users, label: "Faculty", value: "10 teachers" },
  { icon: Clock, label: "Class timing", value: "10:00 PM – 11:30 PM" },
];

const TESTIMONIALS = [
  {
    name: "Ayesha K.",
    role: "FCPS Part 1 candidate",
    quote:
      "The 60-day first pass kept me on schedule for once. By the time we hit the Grand Review, the mocks on here felt exactly like the real thing.",
  },
  {
    name: "Bilal R.",
    role: "FCPS Part 1 candidate",
    quote:
      "Having Pathoma and First Aid lined up chapter-by-chapter with the schedule made revision so much faster than doing it alone.",
  },
  {
    name: "Sana M.",
    role: "FCPS Part 1 candidate",
    quote:
      "Free mocks with detailed per-option explanations after every wrong answer — that alone was worth joining the program for.",
  },
];

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

      {/* Program Details */}
      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-700">
              <BookOpen size={13} /> Program Details
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              The complete FCPS Part 1 prep program
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
              Almost 3 months, structured in two phases &mdash; and every mock on this platform is
              included <span className="font-semibold text-slate-700">100% free</span> with the program.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PROGRAM_STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <stat.icon size={17} />
                </span>
                <p className="mt-2.5 text-[15px] font-bold text-slate-900">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Phase 1 &mdash; First pass (60 days)</h3>
              <p className="mt-1 text-sm text-slate-500">Chapter by chapter, in order:</p>
              <ol className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {FIRST_PASS_SUBJECTS.map((subject, i) => (
                  <li
                    key={subject}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700"
                  >
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                      {i + 1}
                    </span>
                    {subject}
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50 p-5">
                <h3 className="text-[15px] font-bold text-slate-900">
                  Phase 2 &mdash; Grand review &amp; practice mocks (25 days)
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                  A full review pass across every subject, backed by the same system-wise mocks,
                  Grand Mock, and detailed explanations available free on this platform.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Books &amp; references covered</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {REFERENCE_BOOKS.map((book) => (
                  <span
                    key={book}
                    className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm"
                  >
                    {book}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-5 text-white shadow-premium">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                  <Sparkles size={12} /> Included free
                </span>
                <p className="mt-3 text-sm leading-relaxed text-white/85">
                  Every system &amp; topic mock, the full Grand Mock, and per-option explanations on
                  this platform come free with the program &mdash; no separate charge.
                </p>
                <Link
                  href="/signup"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-brand-700 shadow-sm transition hover:bg-brand-50"
                >
                  Start free mocks <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3.5 py-1.5 text-[13px] font-semibold text-gold-700">
              <Star size={13} /> Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">What students say</h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-900 text-[13px] font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
