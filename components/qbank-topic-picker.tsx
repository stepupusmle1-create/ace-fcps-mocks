"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { ExamRunner } from "@/components/exam-runner";
import type { QuestionForExam } from "@/lib/exam";

type Topic = { id: string; name: string; questionCount: number };
type System = { id: string; name: string; topics: Topic[] };

export function QBankTopicPicker({ systems }: { systems: System[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set(systems.slice(0, 1).map((s) => s.id)));
  const [state, setState] = useState<
    | { view: "picking" }
    | { view: "loading" }
    | { view: "quiz"; attemptId: string; questions: QuestionForExam[] }
    | { view: "error"; message: string }
  >({ view: "picking" });

  const selectedCount = useMemo(
    () =>
      systems
        .flatMap((s) => s.topics)
        .filter((t) => selected.has(t.id))
        .reduce((sum, t) => sum + t.questionCount, 0),
    [systems, selected]
  );

  const allExpanded = systems.length > 0 && systems.every((s) => expanded.has(s.id));

  function toggleExpandAll() {
    setExpanded(allExpanded ? new Set() : new Set(systems.map((s) => s.id)));
  }

  function toggleTopic(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSystem(system: System) {
    const allSelected = system.topics.every((t) => selected.has(t.id));
    setSelected((prev) => {
      const next = new Set(prev);
      for (const t of system.topics) {
        if (allSelected) next.delete(t.id);
        else next.add(t.id);
      }
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleStart() {
    setState({ view: "loading" });
    const res = await fetch("/api/exam/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examType: "CUSTOM", topicIds: Array.from(selected) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState({ view: "error", message: data.error ?? "Could not start practice. Please try again." });
      return;
    }
    setState({ view: "quiz", attemptId: data.attemptId, questions: data.questions });
  }

  if (state.view === "quiz") {
    return <ExamRunner attemptId={state.attemptId} questions={state.questions} timeLimitSec={0} mode="PRACTICE" />;
  }

  return (
    <div className="mt-6 pb-28">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500">Systems</h2>
        <button
          type="button"
          onClick={toggleExpandAll}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {allExpanded ? "− Collapse all" : "+ Expand all"}
        </button>
      </div>

      <div className="space-y-3">
        {systems.map((system) => {
          const systemTotalCount = system.topics.reduce((sum, t) => sum + t.questionCount, 0);
          const systemSelectedCount = system.topics.filter((t) => selected.has(t.id)).length;
          const allSelected = systemSelectedCount === system.topics.length && system.topics.length > 0;
          const someSelected = systemSelectedCount > 0 && !allSelected;
          const isOpen = expanded.has(system.id);
          return (
            <div key={system.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={() => toggleSystem(system)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => toggleExpanded(system.id)}
                  className="flex flex-1 items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{system.name}</span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[12px] font-semibold text-slate-500">
                      {systemTotalCount}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-[12px] text-slate-400">
                    {systemSelectedCount > 0 && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                        {systemSelectedCount} selected
                      </span>
                    )}
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </span>
                </button>
              </div>

              {isOpen && (
                <div className="space-y-1.5 border-t border-slate-100 px-4 py-3">
                  {system.topics.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(topic.id)}
                        onChange={() => toggleTopic(topic.id)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="flex-1 text-sm text-slate-700">{topic.name}</span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[12px] font-semibold text-slate-500">
                        {topic.questionCount}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {state.view === "error" && <p className="mt-4 text-sm font-medium text-red-600">{state.message}</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:pl-64">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-700">
            {selected.size === 0
              ? "Select at least one topic"
              : `${selected.size} topic${selected.size === 1 ? "" : "s"} selected · ${selectedCount} questions`}
          </p>
          <button
            type="button"
            disabled={selected.size === 0 || state.view === "loading"}
            onClick={handleStart}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.view === "loading" && <Loader2 size={16} className="animate-spin" />}
            Start practice
          </button>
        </div>
      </div>
    </div>
  );
}
