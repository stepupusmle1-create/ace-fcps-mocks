import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookMarked, History as HistoryIcon, ListChecks, Trophy } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { attemptTitle, PASS_PERCENT } from "@/lib/exam";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [submittedAttempts, totalQuestions, systemCount] = await Promise.all([
    prisma.attempt.findMany({
      where: { userId: user.id, status: "SUBMITTED" },
      orderBy: { submittedAt: "desc" },
    }),
    prisma.question.count(),
    prisma.system.count(),
  ]);

  let grandBest: number | null = null;
  let mockCount = 0;
  for (const a of submittedAttempts) {
    if (a.mode === "PRACTICE") continue;
    mockCount++;
    if (a.examType === "GRAND") {
      if (grandBest === null || a.percent > grandBest) grandBest = a.percent;
    }
  }

  const recentAttempts = submittedAttempts.slice(0, 5);
  const overallBest =
    submittedAttempts.length > 0 ? Math.round(Math.max(...submittedAttempts.map((a) => a.percent))) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome, {user.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {submittedAttempts.length === 0
          ? "Start a timed mock to begin building your FCPS prep."
          : "Here's where things stand. Jump into your next mock."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <ListChecks size={17} />
          </span>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Mocks taken</p>
          <p className="mt-0.5 text-3xl font-bold text-slate-900">{mockCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
            <Trophy size={17} />
          </span>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Best mock score</p>
          <p className="mt-0.5 text-3xl font-bold text-slate-900">{overallBest != null ? `${overallBest}%` : "—"}</p>
          {grandBest != null && (
            <p className="mt-1 text-[12px] text-slate-400">Grand Mock best: {Math.round(grandBest)}%</p>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <BookMarked size={17} />
          </span>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Question bank</p>
          <p className="mt-0.5 text-3xl font-bold text-slate-900">{totalQuestions}</p>
          <p className="mt-1 text-[12px] text-slate-400">across {systemCount} systems</p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/mocks"
          className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-6 text-white shadow-premium transition hover:shadow-lg"
        >
          <div
            className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-gold-400/10 blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold">
              <Trophy size={13} /> Timed &amp; scored
            </span>
            <h2 className="mt-3 text-xl font-bold">Create Mock</h2>
            <p className="mt-1 text-sm text-white/80">Grand Mock, or pick a system/topic &mdash; exam conditions, results at the end.</p>
          </div>
          <ArrowRight size={20} className="relative flex-none text-white/80 transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-2">
        <HistoryIcon size={18} className="text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
      </div>

      {recentAttempts.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <ListChecks size={22} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">No attempts yet &mdash; your completed mocks will show up here.</p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {recentAttempts.map((a) => (
            <Link
              key={a.id}
              href={`/attempt/${a.id}`}
              className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">{attemptTitle(a)}</p>
                <p className="text-[12px] text-slate-400">
                  {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : ""}
                </p>
              </div>
              {a.mode !== "PRACTICE" && (
                <span
                  className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    a.percent >= PASS_PERCENT ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}
                >
                  {Math.round(a.percent)}%
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
      {submittedAttempts.length > 5 && (
        <Link href="/history" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline">
          View full history <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}
