import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PASS_PERCENT, SYSTEM_MOCK_QUESTION_COUNT, TOPIC_MOCK_QUESTION_COUNT, timeLimitSecFor } from "@/lib/exam";

export default async function SystemTopicsPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const system = await prisma.system.findUnique({
    where: { slug: params.slug },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: { _count: { select: { questions: true } } },
      },
    },
  });
  if (!system) notFound();

  const totalQuestions = system.topics.reduce((sum, t) => sum + t._count.questions, 0);

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id, status: "SUBMITTED", systemId: system.id },
  });

  let systemBest: number | null = null;
  const bestByTopic = new Map<string, number>();
  for (const a of attempts) {
    if (a.examType === "SYSTEM") {
      if (systemBest === null || a.percent > systemBest) systemBest = a.percent;
    } else if (a.examType === "TOPIC" && a.topicId) {
      const prev = bestByTopic.get(a.topicId) ?? -1;
      if (a.percent > prev) bestByTopic.set(a.topicId, a.percent);
    }
  }

  const systemQuestionCount = Math.min(SYSTEM_MOCK_QUESTION_COUNT, totalQuestions);
  const systemMinutes = Math.round(timeLimitSecFor(systemQuestionCount) / 60);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/mocks" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700">
        <ArrowLeft size={14} /> All systems
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{system.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{system.description}</p>
          <p className="mt-2 text-[12px] text-slate-400">
            {system.topics.length} subsystem{system.topics.length === 1 ? "" : "s"} &middot; {totalQuestions} questions
          </p>
          {systemBest != null && (
            <p className="mt-1 text-[12px] font-semibold text-emerald-600">Best full-system score: {Math.round(systemBest)}%</p>
          )}
        </div>
        <Link
          href={`/exam/system/${system.slug}`}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Start full system mock ({systemQuestionCount}Q &middot; {systemMinutes} min) <ArrowRight size={15} />
        </Link>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Or mock a single subsystem</h2>
      <p className="mt-1 text-sm text-slate-500">Each topic mock is timed and scored just like the full system mock, only shorter.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {system.topics.map((topic) => {
          const qCount = Math.min(TOPIC_MOCK_QUESTION_COUNT, topic._count.questions);
          const minutes = Math.round(timeLimitSecFor(qCount) / 60);
          const best = bestByTopic.get(topic.id);
          return (
            <div
              key={topic.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-card"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900">{topic.name}</h3>
                  {best != null && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Best {Math.round(best)}%
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-slate-500">{topic.description}</p>
                <p className="mt-3 flex items-center gap-1.5 text-[12px] text-slate-400">
                  <Zap size={12} /> {qCount} questions &middot; {minutes} min
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
              <Link
                href={`/exam/topic/${topic.slug}`}
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Start topic mock <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
