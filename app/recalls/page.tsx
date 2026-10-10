import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getRecallOverview } from "@/lib/cached";
import { RecallTopicPicker } from "@/components/recall-topic-picker";
import { RECALL_SETS, resolveRecallSet } from "@/lib/recalls";

export default async function RecallsPage({ searchParams }: { searchParams: { set?: string; paper?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const activeSet = resolveRecallSet(searchParams.set) ?? RECALL_SETS[0];
  const { paperRows, setCounts, activePaper, systems } = await getRecallOverview(activeSet.slug, searchParams.paper ?? null);

  const pickerData = systems
    .map((system) => ({
      id: system.id,
      name: system.name,
      topics: system.topics
        .filter((topic) => topic._count.questions > 0)
        .map((topic) => ({ id: topic.id, name: topic.name, questionCount: topic._count.questions })),
    }))
    .filter((system) => system.topics.length > 0);

  const totalRecalls = pickerData.reduce((sum, s) => sum + s.topics.reduce((tSum, t) => tSum + t.questionCount, 0), 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
          <GraduationCap size={18} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Recalls</h1>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Real questions recalled by candidates from a recent FCPS attempt. Check off any combination of
        systems or topics below, choose Testing (timed, like a mock) or Tutor (untimed, with
        explanations), then start.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {RECALL_SETS.map((s, i) => {
          const active = s.slug === activeSet.slug;
          return (
            <Link
              key={s.slug}
              href={`/recalls?set=${s.slug}`}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s.label}
              <span className={`ml-2 text-[11px] ${active ? "text-white/80" : "text-slate-400"}`}>{setCounts[i]}</span>
            </Link>
          );
        })}
      </div>

      {paperRows.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Paper</span>
          {[{ recallPaper: null as string | null, _count: { _all: setCounts[RECALL_SETS.indexOf(activeSet)] } }, ...paperRows].map((r) => {
            const active = r.recallPaper === activePaper;
            const href = r.recallPaper
              ? `/recalls?set=${activeSet.slug}&paper=${encodeURIComponent(r.recallPaper)}`
              : `/recalls?set=${activeSet.slug}`;
            return (
              <Link
                key={r.recallPaper ?? "all"}
                href={href}
                className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition ${
                  active ? "border-gold-500 bg-gold-50 text-gold-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {r.recallPaper ?? "All papers"}
                <span className="ml-1.5 text-[11px] text-slate-400">{r._count._all}</span>
              </Link>
            );
          })}
        </div>
      )}

      {pickerData.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <GraduationCap size={22} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">
            No questions have been added to {activeSet.label} yet &mdash; check back soon.
          </p>
          <Link
            href="/mocks"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Back to Create Mock
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-4 text-[12px] font-semibold text-slate-400">{totalRecalls} recalled questions available</p>
          <RecallTopicPicker systems={pickerData} recallSet={activeSet.slug} recallPaper={activePaper} />
        </>
      )}
    </div>
  );
}
