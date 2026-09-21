import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, GraduationCap, ListChecks, Timer } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeLimitSecFor } from "@/lib/exam";

export default async function RecallsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const systems = await prisma.system.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: { _count: { select: { questions: { where: { isRecall: true } } } } },
      },
    },
  });

  const systemsWithRecalls = systems
    .map((system) => ({
      ...system,
      recallCount: system.topics.reduce((sum, t) => sum + t._count.questions, 0),
      topics: system.topics.filter((t) => t._count.questions > 0),
    }))
    .filter((s) => s.recallCount > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/mocks" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700">
        &larr; Create Mock
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
          <GraduationCap size={18} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attempt Recalls</h1>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Real questions recalled by candidates from a recent FCPS attempt. Pick a system, then choose{" "}
        <span className="font-semibold text-slate-700">Testing mode</span> (timed, results at the end &mdash;
        just like a mock) or <span className="font-semibold text-slate-700">Tutor mode</span> (untimed, with
        explanations shown right after each answer).
      </p>

      {systemsWithRecalls.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <GraduationCap size={22} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">
            No recall content has been added yet &mdash; check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemsWithRecalls.map((system) => {
            const minutes = Math.round(timeLimitSecFor(system.recallCount) / 60);
            return (
              <div
                key={system.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-card"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{system.name}</h3>
                  <p className="mt-3 flex items-center gap-1.5 text-[12px] text-slate-400">
                    <ListChecks size={12} /> {system.recallCount} recalled questions
                    <span className="text-slate-300">&middot;</span>
                    <Timer size={12} /> {minutes} min if timed
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={`/exam/recall/system/${system.slug}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Testing mode
                  </Link>
                  <Link
                    href={`/tutor/recall/system/${system.slug}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-gold-300 bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700 hover:bg-gold-100"
                  >
                    Tutor mode
                  </Link>
                  {system.topics.length > 0 && (
                    <Link
                      href={`/recalls/${system.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Choose a topic instead <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
