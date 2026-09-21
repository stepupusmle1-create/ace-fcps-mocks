import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PASS_PERCENT, attemptTitle } from "@/lib/exam";
import { formatDuration, readinessLabel } from "@/lib/utils";
import { JoinGroupBanner } from "@/components/join-group-banner";

export default async function AttemptReviewPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const attempt = await prisma.attempt.findUnique({
    where: { id: params.id },
    include: {
      answers: {
        orderBy: { order: "asc" },
        include: { question: { include: { topic: { include: { system: true } } } } },
      },
    },
  });

  if (!attempt || attempt.userId !== user.id) notFound();
  if (attempt.status !== "SUBMITTED") redirect("/dashboard");

  const passed = attempt.percent >= PASS_PERCENT;

  const bySystem = new Map<string, { correct: number; total: number }>();
  const byTopic = new Map<string, { correct: number; total: number }>();
  for (const a of attempt.answers) {
    const systemName = a.question.topic.system.name;
    const sysEntry = bySystem.get(systemName) ?? { correct: 0, total: 0 };
    sysEntry.total += 1;
    if (a.correct) sysEntry.correct += 1;
    bySystem.set(systemName, sysEntry);

    const topicName = a.question.topic.name;
    const topicEntry = byTopic.get(topicName) ?? { correct: 0, total: 0 };
    topicEntry.total += 1;
    if (a.correct) topicEntry.correct += 1;
    byTopic.set(topicName, topicEntry);
  }
  const breakdown = Array.from(bySystem.entries()).map(([name, v]) => ({
    name,
    correct: v.correct,
    total: v.total,
    percent: v.total > 0 ? (v.correct / v.total) * 100 : 0,
  }));
  const topicBreakdown = Array.from(byTopic.entries()).map(([name, v]) => ({
    name,
    correct: v.correct,
    total: v.total,
    percent: v.total > 0 ? (v.correct / v.total) * 100 : 0,
  }));

  const title = attemptTitle(attempt);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">{title}</p>
            <h1 className="mt-1 bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              {Math.round(attempt.percent)}%
            </h1>
          </div>
          <span
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${
              passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? "Passed" : "Below passing"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 py-3">
            <p className="text-lg font-bold text-slate-900">
              {attempt.correctCount}/{attempt.totalQuestions}
            </p>
            <p className="text-[11px] text-slate-500">Correct</p>
          </div>
          <div className="rounded-xl bg-slate-50 py-3">
            <p className="text-lg font-bold text-slate-900">{formatDuration(attempt.durationSec)}</p>
            <p className="text-[11px] text-slate-500">Time taken</p>
          </div>
          <div className="rounded-xl bg-slate-50 py-3">
            <p className="text-lg font-bold text-slate-900">{readinessLabel(attempt.percent)}</p>
            <p className="text-[11px] text-slate-500">Readiness</p>
          </div>
        </div>

        {breakdown.length > 1 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">Score by system</p>
            <div className="mt-2 space-y-2">
              {breakdown
                .sort((a, b) => a.percent - b.percent)
                .map((b) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <span className="w-40 flex-none truncate text-[13px] text-slate-600">{b.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${b.percent >= PASS_PERCENT ? "bg-emerald-500" : "bg-red-400"}`}
                        style={{ width: `${b.percent}%` }}
                      />
                    </div>
                    <span className="w-16 flex-none text-right text-[12px] font-semibold text-slate-500">
                      {b.correct}/{b.total}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {topicBreakdown.length > 1 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-700">Score by topic</p>
            <div className="mt-2 space-y-2">
              {topicBreakdown
                .sort((a, b) => a.percent - b.percent)
                .map((b) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <span className="w-40 flex-none truncate text-[13px] text-slate-600">{b.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${b.percent >= PASS_PERCENT ? "bg-emerald-500" : "bg-red-400"}`}
                        style={{ width: `${b.percent}%` }}
                      />
                    </div>
                    <span className="w-16 flex-none text-right text-[12px] font-semibold text-slate-500">
                      {b.correct}/{b.total}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to dashboard
          </Link>
          <Link
            href="/history"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View history
          </Link>
        </div>
      </div>

      {attempt.mode !== "PRACTICE" && (
        <div className="mt-6">
          <JoinGroupBanner />
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Question review</h2>
      <div className="mt-3 space-y-4">
        {attempt.answers.map((a, idx) => {
          const options = JSON.parse(a.question.optionsJson) as string[];
          const optionExplanations = a.question.optionExplanationsJson
            ? (JSON.parse(a.question.optionExplanationsJson) as string[])
            : null;
          return (
            <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                  {a.question.topic.system.name}
                  <span className="text-brand-300">&middot;</span>
                  {a.question.topic.name}
                </span>
                {a.correct ? (
                  <CheckCircle2 className="flex-none text-emerald-600" size={20} />
                ) : (
                  <XCircle className="flex-none text-red-500" size={20} />
                )}
              </div>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-900">
                {idx + 1}. {a.question.stem}
              </p>
              <div className="mt-3 space-y-2">
                {options.map((opt, i) => {
                  const isCorrect = i === a.question.correctIndex;
                  const isSelected = i === a.selectedIndex;
                  const wrongExplanation = !isCorrect ? optionExplanations?.[i] : undefined;
                  return (
                    <div key={i}>
                      <div
                        className={`flex items-start gap-3 border px-4 py-2.5 text-sm ${
                          isCorrect
                            ? "rounded-xl border-emerald-300 bg-emerald-50 text-emerald-900"
                            : isSelected
                            ? "border-red-300 bg-red-50 text-red-900"
                            : "border-slate-200 text-slate-600"
                        } ${wrongExplanation ? "rounded-t-xl" : "rounded-xl"}`}
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                        {isSelected && !isCorrect && (
                          <span className="ml-auto flex-none text-[11px] font-semibold text-red-600">Your answer</span>
                        )}
                        {isCorrect && (
                          <span className="ml-auto flex-none text-[11px] font-semibold text-emerald-600">Correct</span>
                        )}
                      </div>
                      {wrongExplanation && (
                        <div className="rounded-b-xl border border-t-0 border-slate-200 bg-slate-50 px-4 py-2 text-[12px] leading-snug text-slate-500">
                          <span className="font-semibold text-slate-600">Why not: </span>
                          {wrongExplanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {a.selectedIndex == null && (
                <p className="mt-2 text-[12px] font-semibold text-amber-600">Not answered</p>
              )}
              <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-800">Explanation: </span>
                  {a.question.explanation}
                </p>
                {a.question.reference && (
                  <p className="mt-1.5 text-[12px] font-medium italic text-slate-400">
                    Reference: {a.question.reference}
                  </p>
                )}
                {a.question.explanationImagesJson && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {(JSON.parse(a.question.explanationImagesJson) as string[]).map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt="Explanation reference"
                        className="max-h-72 w-auto rounded-lg border border-slate-200 object-contain"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
