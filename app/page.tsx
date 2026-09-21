import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bone,
  BookOpen,
  Brain,
  Bug,
  Calendar,
  CheckCircle2,
  Clock,
  Dna,
  Droplets,
  Filter,
  FlaskConical,
  Heart,
  Layers,
  Microscope,
  Pill,
  Radiation,
  Shield,
  Sparkles,
  Star,
  Trophy,
  UtensilsCrossed,
  Users,
  Wind,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { RegisterSlotBanner } from "@/components/register-slot-banner";
import { REGISTER_WHATSAPP_URL } from "@/lib/site";

const FIRST_PASS_SUBJECTS = [
  { name: "Cell Biology", icon: Dna, bg: "bg-violet-50", text: "text-violet-600" },
  { name: "Renal", icon: Filter, bg: "bg-cyan-50", text: "text-cyan-600" },
  { name: "Endocrine", icon: Activity, bg: "bg-amber-50", text: "text-amber-600" },
  { name: "Pulmonology", icon: Wind, bg: "bg-sky-50", text: "text-sky-600" },
  { name: "Cardiology", icon: Heart, bg: "bg-red-50", text: "text-red-600" },
  { name: "GIT", icon: UtensilsCrossed, bg: "bg-orange-50", text: "text-orange-600" },
  { name: "Haematology", icon: Droplets, bg: "bg-rose-50", text: "text-rose-600" },
  { name: "Immunology", icon: Shield, bg: "bg-emerald-50", text: "text-emerald-600" },
  { name: "Pathology", icon: Microscope, bg: "bg-indigo-50", text: "text-indigo-600" },
  { name: "MSK", icon: Bone, bg: "bg-yellow-50", text: "text-yellow-600" },
  { name: "Histology", icon: Layers, bg: "bg-teal-50", text: "text-teal-600" },
  { name: "Microbiology", icon: Bug, bg: "bg-green-50", text: "text-green-600" },
  { name: "Biochemistry", icon: FlaskConical, bg: "bg-fuchsia-50", text: "text-fuchsia-600" },
  { name: "Biostatistics", icon: BarChart3, bg: "bg-blue-50", text: "text-blue-600" },
  { name: "Pharmacology (all chapters)", icon: Pill, bg: "bg-purple-50", text: "text-purple-600" },
  { name: "Neuro", icon: Brain, bg: "bg-pink-50", text: "text-pink-600" },
  { name: "Oncology", icon: Radiation, bg: "bg-lime-50", text: "text-lime-600" },
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
      "Free mocks with detailed per-option explanations after every wrong answer — that alone made the program worth it.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/dashboard");

  return (
    <div>
      <div className="relative overflow-hidden bg-mesh border-b border-slate-200">
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-[13px] font-semibold text-brand-700">
            <BookOpen size={13} /> FCPS Part 1 Coaching Program
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            The complete FCPS Part 1 prep program
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-lg">
            Almost 3 months, live classes with 10 teachers, structured in two phases. Seats are
            limited &mdash; register on WhatsApp to enroll.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={REGISTER_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-3 text-sm font-bold text-white shadow-premium transition hover:shadow-lg"
            >
              Register your slot
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/exams"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Try the mocks free
            </Link>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] font-medium text-slate-400">
            <Sparkles size={14} className="text-emerald-500" /> Mock exams on this platform are always
            free &mdash; no payment needed to practice.
          </p>
        </div>
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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

          <div className="mt-8">
            <RegisterSlotBanner />
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Phase 1 &mdash; First pass (60 days)</h2>
              <p className="mt-1 text-sm text-slate-500">Chapter by chapter, in order:</p>
              <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {FIRST_PASS_SUBJECTS.map((subject, i) => (
                  <li
                    key={subject.name}
                    className="animate-float-item group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-3.5 py-2.5 text-[13px] font-medium text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                    style={
                      {
                        "--float-in-delay": `${i * 55}ms`,
                        "--float-bob-delay": `${700 + (i % 5) * 260}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${subject.bg} ${subject.text} shadow-sm transition group-hover:scale-110`}
                    >
                      <subject.icon size={16} />
                    </span>
                    {subject.name}
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-5">
                <h3 className="text-[15px] font-bold text-slate-900">
                  Phase 2 &mdash; Grand review &amp; practice mocks (25 days)
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                  A full review pass across every subject, backed by the same system-wise mocks,
                  Grand Mock, and detailed explanations &mdash; free to use on this platform.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Books &amp; references covered</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {REFERENCE_BOOKS.map((book, i) => (
                  <span
                    key={book}
                    className="animate-float-item rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-card"
                    style={
                      {
                        "--float-in-delay": `${300 + i * 70}ms`,
                        "--float-bob-delay": `${1000 + (i % 4) * 300}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {book}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-5 text-white shadow-premium">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                  <Sparkles size={12} /> Free, always
                </span>
                <p className="mt-3 text-sm leading-relaxed text-white/85">
                  Every system &amp; topic mock, the full Grand Mock, and per-option explanations on
                  ACE FCPS are 100% free to use &mdash; whether or not you join the coaching program.
                </p>
                <Link
                  href="/exams"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-brand-700 shadow-sm transition hover:bg-brand-50"
                >
                  Try mocks free <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/exams"
            className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-500 via-gold-600 to-amber-700 p-7 text-white shadow-premium transition hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
          >
            <div
              className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
                <Trophy size={13} /> Free, no card required
              </span>
              <h2 className="mt-3 text-xl font-bold">Explore the mock exams</h2>
              <p className="mt-1 max-w-md text-sm text-white/85">
                System mocks, the Grand Mock, Tutor mode, and Attempt Recalls &mdash; try every
                format free, program or not.
              </p>
            </div>
            <span className="relative flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-gold-700 shadow-sm transition group-hover:bg-gold-50">
              View mocks <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
