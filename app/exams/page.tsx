import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutGrid,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RegisterSlotBanner } from "@/components/register-slot-banner";
import { GRAND_MOCK_QUESTION_COUNT, SYSTEM_MOCK_QUESTION_COUNT, timeLimitSecFor } from "@/lib/exam";

const FEATURES = [
  {
    icon: LayoutGrid,
    bg: "bg-brand-50",
    text: "text-brand-600",
    title: "System & topic mocks",
    description: "Timed tests scoped to one system or a single topic — build confidence subject by subject before facing the whole bank.",
  },
  {
    icon: Trophy,
    bg: "bg-gold-50",
    text: "text-gold-600",
    title: "Grand Mock",
    description: "A full-length, mixed-system simulation that mirrors real exam-day timing and pacing.",
  },
  {
    icon: BookOpen,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    title: "Tutor / Q Bank mode",
    description: "Untimed practice with the correct answer and explanation shown right after you answer — built for learning, not just testing.",
  },
  {
    icon: GraduationCap,
    bg: "bg-purple-50",
    text: "text-purple-600",
    title: "Attempt Recalls",
    description: "Real questions recalled by candidates from recent attempts, organised system-wise and topic-wise.",
  },
  {
    icon: ClipboardList,
    bg: "bg-sky-50",
    text: "text-sky-600",
    title: "Per-option explanations",
    description: "Every wrong option gets its own “why not” explanation, not just the single correct answer.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-rose-50",
    text: "text-rose-600",
    title: "100% free",
    description: "Every mock, every mode, every explanation — always free, whether or not you join the coaching program.",
  },
];

export default async function ExamsPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/dashboard");

  const [totalQuestions, systemCount] = await Promise.all([
    prisma.question.count(),
    prisma.system.count(),
  ]);

  const grandMinutes = Math.round(timeLimitSecFor(Math.min(GRAND_MOCK_QUESTION_COUNT, totalQuestions)) / 60);
  const systemMinutes = Math.round(timeLimitSecFor(SYSTEM_MOCK_QUESTION_COUNT) / 60);

  return (
    <div>
      <div className="relative overflow-hidden bg-mesh border-b border-slate-200">
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3.5 py-1.5 text-[13px] font-semibold text-gold-700">
            <Sparkles size={13} /> Mock Exams
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Every mock you need to pass FCPS Part 1
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-lg">
            {totalQuestions} questions across {systemCount} systems, timed like the real exam, with a
            detailed explanation behind every single option.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 px-6 py-3 text-sm font-bold text-white shadow-premium transition hover:shadow-lg"
            >
              Start mocking free
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              &larr; View Program Details
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <ListChecks size={17} />
              </span>
              <p className="mt-2.5 text-[15px] font-bold text-slate-900">{totalQuestions}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Questions</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <LayoutGrid size={17} />
              </span>
              <p className="mt-2.5 text-[15px] font-bold text-slate-900">{systemCount}</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Systems</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                <Trophy size={17} />
              </span>
              <p className="mt-2.5 text-[15px] font-bold text-slate-900">{grandMinutes} min</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Grand Mock</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <Timer size={17} />
              </span>
              <p className="mt-2.5 text-[15px] font-bold text-slate-900">{systemMinutes} min</p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">System mock</p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.bg} ${f.text}`}>
                  <f.icon size={22} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <RegisterSlotBanner />
          </div>
        </div>
      </section>
    </div>
  );
}
