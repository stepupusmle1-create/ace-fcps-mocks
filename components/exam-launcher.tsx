"use client";

import { useState } from "react";
import { AlertCircle, BookOpen, Loader2, Timer } from "lucide-react";
import { ExamRunner } from "@/components/exam-runner";
import type { QuestionForExam } from "@/lib/exam";

export function ExamLauncher({
  examType,
  systemSlug,
  topicSlug,
  title,
  description,
  questionCount,
  minutes,
  mode = "MOCK",
}: {
  examType: "SYSTEM" | "TOPIC" | "GRAND";
  systemSlug?: string;
  topicSlug?: string;
  title: string;
  description: string;
  questionCount: number;
  minutes: number;
  mode?: "MOCK" | "PRACTICE";
}) {
  const practiceMode = mode === "PRACTICE";
  const [state, setState] = useState<
    | { view: "intro" }
    | { view: "loading" }
    | { view: "quiz"; attemptId: string; questions: QuestionForExam[]; timeLimitSec: number }
    | { view: "error"; message: string }
  >({ view: "intro" });

  async function handleBegin() {
    setState({ view: "loading" });
    const res = await fetch("/api/exam/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examType, systemSlug, topicSlug, mode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState({ view: "error", message: data.error ?? "Could not start the exam. Please try again." });
      return;
    }
    setState({
      view: "quiz",
      attemptId: data.attemptId,
      questions: data.questions,
      timeLimitSec: data.timeLimitSec,
    });
  }

  if (state.view === "quiz") {
    return (
      <ExamRunner
        attemptId={state.attemptId}
        questions={state.questions}
        timeLimitSec={state.timeLimitSec}
        mode={mode}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-premium">
        {practiceMode && (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold text-brand-700">
            <BookOpen size={13} /> Q Bank practice
          </span>
        )}
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-600">
          <span className="font-semibold">{questionCount} questions</span>
          <span className="flex items-center gap-1.5 font-semibold">
            <Timer size={15} /> {practiceMode ? "Untimed" : `${minutes} minutes`}
          </span>
        </div>

        {practiceMode ? (
          <div className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-left text-[13px] text-brand-800">
            <p className="flex gap-2">
              <BookOpen size={16} className="mt-0.5 flex-none" />
              Q Bank practice covers every question in this scope with no time limit. You&apos;ll see whether
              each answer is correct, plus its explanation, right after you pick it.
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-left text-[13px] text-amber-800">
            <p className="flex gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-none" />
              Once you begin, the timer starts immediately and cannot be paused. Make sure you&apos;re ready
              before continuing.
            </p>
          </div>
        )}

        {state.view === "error" && (
          <p className="mt-4 text-sm font-medium text-red-600">{state.message}</p>
        )}

        <button
          onClick={handleBegin}
          disabled={state.view === "loading"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
        >
          {state.view === "loading" && <Loader2 size={16} className="animate-spin" />}
          {practiceMode ? "Begin practice" : "Begin mock"}
        </button>
      </div>
    </div>
  );
}
