import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeLimitSecFor } from "@/lib/exam";

export default async function RecallSystemTopicsPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const system = await prisma.system.findUnique({
    where: { slug: params.slug },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: { _count: { select: { questions: { where: { isRecall: true } } } } },
      },
    },
  });
  if (!system) notFound();

  const topics = system.topics.filter((t) => t._count.questions > 0);
  const totalRecalls = topics.reduce((sum, t) => sum + t._count.questions, 0);
  if (totalRecalls === 0) notFound();

  const systemMinutes = Math.round(timeLimitSecFor(totalRecalls) / 60);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/recalls" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700">
        <ArrowLeft size={14} /> All recall systems
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-2.5 py-1 text-[11px] font-semibold text-gold-700">
            <GraduationCap size={12} /> Attempt Recalls
          </span>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{system.name}</h1>
          <p className="mt-2 text-[12px] text-slate-400">
            {totalRecalls} recalled question{totalRecalls === 1 ? "" : "s"} across {topics.length} topic
            {topics.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/tutor/recall/system/${system.slug}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gold-300 bg-gold-50 px-4 py-3 text-sm font-semibold text-gold-700 hover:bg-gold-100"
          >
            Tutor: whole system
          </Link>
          <Link
            href={`/exam/recall/system/${system.slug}`}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Test: whole system ({totalRecalls}Q &middot; {systemMinutes} min) <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Or pick a single topic</h2>
      <p className="mt-1 text-sm text-slate-500">Test yourself (timed) or study with explanations (tutor), per topic.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => {
          const minutes = Math.round(timeLimitSecFor(topic._count.questions) / 60);
          return (
            <div
              key={topic.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-card"
            >
              <div>
                <h3 className="font-semibold text-slate-900">{topic.name}</h3>
                <p className="mt-3 text-[12px] text-slate-400">
                  {topic._count.questions} recalled question{topic._count.questions === 1 ? "" : "s"} &middot; {minutes} min if timed
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/exam/recall/topic/${topic.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Testing
                </Link>
                <Link
                  href={`/tutor/recall/topic/${topic.slug}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gold-300 bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700 hover:bg-gold-100"
                >
                  Tutor
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
