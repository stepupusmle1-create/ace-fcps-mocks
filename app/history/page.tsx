import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PASS_PERCENT, attemptTitle } from "@/lib/exam";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id, status: "SUBMITTED" },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Attempt history</h1>
      <p className="mt-1 text-sm text-slate-500">Every mock you&apos;ve completed, most recent first.</p>

      {attempts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">You haven&apos;t completed any mocks yet.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Go to dashboard <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-2.5">
          {attempts.map((a) => {
            const passed = a.percent >= PASS_PERCENT;
            const title = attemptTitle(a);
            return (
              <Link
                key={a.id}
                href={`/attempt/${a.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-card"
              >
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-[12px] text-slate-400">
                    {a.submittedAt?.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    &middot; {a.correctCount}/{a.totalQuestions} correct
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    passed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {Math.round(a.percent)}%
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
