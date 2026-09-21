import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ListChecks, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GRAND_MOCK_QUESTION_COUNT, PASS_PERCENT, SYSTEM_MOCK_QUESTION_COUNT, timeLimitSecFor } from "@/lib/exam";

export default async function MocksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [systems, submittedAttempts, totalQuestions] = await Promise.all([
    prisma.system.findMany({
      orderBy: { order: "asc" },
      include: { topics: { include: { _count: { select: { questions: true } } } } },
    }),
    prisma.attempt.findMany({
      where: { userId: user.id, status: "SUBMITTED" },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.question.count(),
  ]);

  const bestBySystem = new Map<string, number>();
  let grandBest: number | null = null;
  for (const a of submittedAttempts) {
    if (a.examType === "SYSTEM" && a.systemId) {
      const prev = bestBySystem.get(a.systemId) ?? -1;
      if (a.percent > prev) bestBySystem.set(a.systemId, a.percent);
    } else if (a.examType === "GRAND") {
      if (grandBest === null || a.percent > grandBest) grandBest = a.percent;
    }
  }

  const grandMockCount = Math.min(GRAND_MOCK_QUESTION_COUNT, totalQuestions);
  const grandMinutes = Math.round(timeLimitSecFor(grandMockCount) / 60);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2">
        <ListChecks size={20} className="text-brand-600" />
        <h1 className="text-2xl font-bold text-slate-900">Create Mock</h1>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Timed, exam-style tests with results and explanations shown only at the end &mdash; the closest thing
        to sitting the real exam.
      </p>

      <div className="relative mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-6 text-white shadow-premium sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-400/15 px-3 py-1 text-[12px] font-semibold text-gold-200">
              <Trophy size={13} /> Full-length simulation
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Grand Mock</h2>
            <p className="mt-1 max-w-md text-sm text-white/80">
              {grandMockCount} mixed questions across every system, timed at {grandMinutes} minutes &mdash;
              the closest thing to exam day.
            </p>
            {grandBest !== null && (
              <p className="mt-2 text-sm font-semibold text-white/90">Best score: {Math.round(grandBest)}%</p>
            )}
          </div>
          <Link
            href="/exam/grand"
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 shadow-sm transition hover:bg-gold-50"
          >
            Start Grand Mock <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mt-10 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-900">System &amp; topic mocks</h2>
        <p className="text-[12px] text-slate-400">Pick a system to take it whole, or drill into a single topic</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {systems.map((system) => {
          const totalSystemQuestions = system.topics.reduce((sum, t) => sum + t._count.questions, 0);
          const systemQuestionCount = Math.min(SYSTEM_MOCK_QUESTION_COUNT, totalSystemQuestions);
          const systemMinutes = Math.round(timeLimitSecFor(systemQuestionCount) / 60);
          const best = bestBySystem.get(system.id);
          return (
            <div
              key={system.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{system.name}</h3>
                  {best != null && (
                    <span className="flex-none rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Best {Math.round(best)}%
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-slate-500">{system.description}</p>
                <p className="mt-3 text-[12px] text-slate-400">
                  {system.topics.length} subsystems &middot; {totalSystemQuestions} questions
                </p>
                {best != null && (
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${best >= PASS_PERCENT ? "bg-emerald-500" : "bg-red-400"}`}
                      style={{ width: `${Math.min(100, Math.max(0, best))}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/exam/system/${system.slug}`}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Start system mock ({systemQuestionCount}Q &middot; {systemMinutes} min)
                </Link>
                <Link
                  href={`/systems/${system.slug}`}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Choose a topic instead <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
