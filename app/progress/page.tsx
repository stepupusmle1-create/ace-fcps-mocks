import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, ListChecks, Target, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PASS_PERCENT } from "@/lib/exam";

function average(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function TrendChart({ percents }: { percents: number[] }) {
  const width = 640;
  const height = 160;
  const padX = 12;
  const padY = 16;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const passY = padY + plotH * (1 - PASS_PERCENT / 100);

  if (percents.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        Complete at least two mocks to see your trend.
      </div>
    );
  }

  const stepX = plotW / (percents.length - 1);
  const points = percents.map((p, i) => {
    const x = padX + i * stepX;
    const y = padY + plotH * (1 - Math.min(100, Math.max(0, p)) / 100);
    return { x, y, p };
  });
  const linePath = points.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(padY + plotH).toFixed(1)} L${points[0].x.toFixed(1)},${(padY + plotH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
      <line x1={padX} y1={passY} x2={width - padX} y2={passY} stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth={1} />
      <text x={width - padX} y={passY - 5} textAnchor="end" className="fill-slate-400 text-[10px]">
        Pass ({PASS_PERCENT}%)
      </text>
      <path d={areaPath} fill="url(#trendFill)" stroke="none" />
      <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth={2} />
      {points.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={3.5}
          fill={pt.p >= PASS_PERCENT ? "#10b981" : "#ef4444"}
          stroke="white"
          strokeWidth={1.5}
        />
      ))}
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id, status: "SUBMITTED" },
    orderBy: { submittedAt: "asc" },
  });

  if (attempts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Progress</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            No statistics yet &mdash; complete a mock to start tracking your progress.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const totalCorrect = attempts.reduce((sum, a) => sum + a.correctCount, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const avgScore = average(attempts.map((a) => a.percent));
  const bestScore = Math.max(...attempts.map((a) => a.percent));
  const percents = attempts.map((a) => a.percent);

  const bySystem = new Map<string, { name: string; attempts: number; totalPercent: number; best: number }>();
  const byTopic = new Map<string, { name: string; systemName: string; attempts: number; totalPercent: number; best: number }>();
  for (const a of attempts) {
    if ((a.examType === "SYSTEM" || a.examType === "TOPIC") && a.systemId && a.systemName) {
      const entry = bySystem.get(a.systemId) ?? { name: a.systemName, attempts: 0, totalPercent: 0, best: 0 };
      entry.attempts += 1;
      entry.totalPercent += a.percent;
      entry.best = Math.max(entry.best, a.percent);
      bySystem.set(a.systemId, entry);
    }
    if (a.examType === "TOPIC" && a.topicId && a.topicName && a.systemName) {
      const entry = byTopic.get(a.topicId) ?? { name: a.topicName, systemName: a.systemName, attempts: 0, totalPercent: 0, best: 0 };
      entry.attempts += 1;
      entry.totalPercent += a.percent;
      entry.best = Math.max(entry.best, a.percent);
      byTopic.set(a.topicId, entry);
    }
  }
  const systemStats = Array.from(bySystem.values())
    .map((s) => ({ ...s, avg: s.totalPercent / s.attempts }))
    .sort((a, b) => a.avg - b.avg);
  const topicStats = Array.from(byTopic.values())
    .map((t) => ({ ...t, avg: t.totalPercent / t.attempts }))
    .sort((a, b) => a.avg - b.avg);

  const grandAttempts = attempts.filter((a) => a.examType === "GRAND");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Your progress</h1>
      <p className="mt-1 text-sm text-slate-500">Statistics across every mock you&apos;ve completed.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ListChecks className="text-brand-600" size={18} />
          <p className="mt-2 text-2xl font-bold text-slate-900">{attempts.length}</p>
          <p className="text-[12px] text-slate-500">Mocks completed</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Target className="text-brand-600" size={18} />
          <p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(overallAccuracy)}%</p>
          <p className="text-[12px] text-slate-500">
            Overall accuracy ({totalCorrect}/{totalQuestions})
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <TrendingUp className="text-brand-600" size={18} />
          <p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(avgScore)}%</p>
          <p className="text-[12px] text-slate-500">Average score per mock</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Award className="text-brand-600" size={18} />
          <p className="mt-2 text-2xl font-bold text-slate-900">{Math.round(bestScore)}%</p>
          <p className="text-[12px] text-slate-500">Best score</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold text-slate-700">Score trend</p>
        <p className="text-[12px] text-slate-400">Every submitted mock, in order, most recent on the right.</p>
        <div className="mt-3">
          <TrendChart percents={percents} />
        </div>
      </div>

      {grandAttempts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold text-slate-700">Grand Mock</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-50 py-3">
              <p className="text-lg font-bold text-slate-900">{grandAttempts.length}</p>
              <p className="text-[11px] text-slate-500">Attempts</p>
            </div>
            <div className="rounded-xl bg-slate-50 py-3">
              <p className="text-lg font-bold text-slate-900">
                {Math.round(average(grandAttempts.map((a) => a.percent)))}%
              </p>
              <p className="text-[11px] text-slate-500">Average</p>
            </div>
            <div className="rounded-xl bg-slate-50 py-3">
              <p className="text-lg font-bold text-slate-900">
                {Math.round(Math.max(...grandAttempts.map((a) => a.percent)))}%
              </p>
              <p className="text-[11px] text-slate-500">Best</p>
            </div>
          </div>
        </div>
      )}

      {systemStats.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold text-slate-700">Progress by system</p>
          <p className="text-[12px] text-slate-400">Weakest systems listed first &mdash; focus your next mocks here.</p>
          <div className="mt-4 space-y-4">
            {systemStats.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="text-slate-500">
                    avg {Math.round(s.avg)}% &middot; best {Math.round(s.best)}% &middot; {s.attempts}{" "}
                    attempt{s.attempts === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${s.avg >= PASS_PERCENT ? "bg-emerald-500" : "bg-red-400"}`}
                    style={{ width: `${Math.min(100, Math.max(0, s.avg))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topicStats.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold text-slate-700">Progress by topic</p>
          <p className="text-[12px] text-slate-400">Only topics you&apos;ve taken a topic mock for, weakest first.</p>
          <div className="mt-4 space-y-4">
            {topicStats.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-slate-700">
                    {t.name} <span className="font-normal text-slate-400">&middot; {t.systemName}</span>
                  </span>
                  <span className="text-slate-500">
                    avg {Math.round(t.avg)}% &middot; best {Math.round(t.best)}% &middot; {t.attempts}{" "}
                    attempt{t.attempts === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${t.avg >= PASS_PERCENT ? "bg-emerald-500" : "bg-red-400"}`}
                    style={{ width: `${Math.min(100, Math.max(0, t.avg))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
