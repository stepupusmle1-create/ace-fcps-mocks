"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Flag, Loader2, XCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { QuestionForExam } from "@/lib/exam";

export function ExamRunner({
  attemptId,
  questions,
  timeLimitSec,
  mode = "MOCK",
}: {
  attemptId: string;
  questions: QuestionForExam[];
  timeLimitSec: number;
  mode?: "MOCK" | "PRACTICE";
}) {
  const router = useRouter();
  const practiceMode = mode === "PRACTICE";
  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null]))
  );
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSec);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const startedAtRef = useRef(Date.now());
  const submittedRef = useRef(false);

  const answeredCount = useMemo(
    () => Object.values(selections).filter((v) => v != null).length,
    [selections]
  );
  const correctSoFar = useMemo(
    () => questions.filter((q) => revealed[q.id] && selections[q.id] === q.correctIndex).length,
    [questions, revealed, selections]
  );

  async function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    const elapsedSec = Math.round((Date.now() - startedAtRef.current) / 1000);
    const answers = questions.map((q) => ({ questionId: q.id, selectedIndex: selections[q.id] ?? null }));

    const res = await fetch(`/api/exam/${attemptId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, elapsedSec }),
    });

    if (res.ok) {
      router.push(`/attempt/${attemptId}`);
    } else {
      submittedRef.current = false;
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (practiceMode || timeLimitSec <= 0) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, practiceMode]);

  const q = questions[current];
  const lowTime = !practiceMode && secondsLeft <= 60;
  const isRevealed = practiceMode && revealed[q.id];
  const progressPercent = ((current + 1) / questions.length) * 100;

  function selectOption(i: number) {
    if (isRevealed) return; // locked once revealed in practice mode
    setSelections((s) => ({ ...s, [q.id]: i }));
    if (practiceMode) {
      setRevealed((r) => ({ ...r, [q.id]: true }));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-gold-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm font-semibold text-slate-700">
            Question {current + 1} of {questions.length}
            <span className="ml-2 font-normal text-slate-400">
              &middot; {answeredCount} answered
              {practiceMode && <> &middot; {correctSoFar}/{Object.keys(revealed).length} correct so far</>}
            </span>
          </div>
          {practiceMode ? (
            <div className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">Untimed practice</div>
          ) : (
            <div className={`rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums ${lowTime ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-700"}`}>
              {formatDuration(Math.max(0, secondsLeft))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_180px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
              {q.systemName}
              <span className="text-brand-300">&middot;</span>
              {q.topicName}
            </span>
            <button
              type="button"
              onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold transition ${
                flagged[q.id] ? "bg-amber-100 text-amber-700" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <Flag size={13} /> {flagged[q.id] ? "Flagged" : "Flag for review"}
            </button>
          </div>

          <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-900">{q.stem}</p>

          <div className="mt-5 space-y-2.5">
            {q.options.map((opt, i) => {
              const selected = selections[q.id] === i;
              const isCorrectOpt = isRevealed && q.correctIndex === i;
              const isWrongSelected = isRevealed && selected && q.correctIndex !== i;
              const wrongExplanation =
                isRevealed && q.correctIndex !== i ? q.optionExplanations?.[i] : undefined;
              return (
                <div key={i}>
                  <button
                    type="button"
                    disabled={isRevealed}
                    onClick={() => selectOption(i)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      isCorrectOpt
                        ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                        : isWrongSelected
                        ? "border-red-400 bg-red-50 text-red-900"
                        : selected
                        ? "border-brand-500 bg-brand-50 text-brand-900 shadow-sm"
                        : "border-slate-200 hover:border-brand-200 hover:bg-slate-50 disabled:hover:border-slate-200 disabled:hover:bg-white"
                    } ${wrongExplanation ? "rounded-b-none" : ""}`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] font-bold ${
                        isCorrectOpt
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isWrongSelected
                          ? "border-red-600 bg-red-600 text-white"
                          : selected
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                    {isCorrectOpt && <CheckCircle2 size={16} className="ml-auto mt-0.5 flex-none text-emerald-600" />}
                    {isWrongSelected && <XCircle size={16} className="ml-auto mt-0.5 flex-none text-red-500" />}
                  </button>
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

          {isRevealed && q.explanation && (
            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[13px] leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Explanation: </span>
                {q.explanation}
              </p>
              {q.reference && (
                <p className="mt-1.5 text-[12px] font-medium italic text-slate-400">Reference: {q.reference}</p>
              )}
              {q.explanationImages && q.explanationImages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {q.explanationImages.map((src) => (
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
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition disabled:opacity-40"
            >
              Previous
            </button>
            {current < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {practiceMode ? "Finish session" : "Review & submit"}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm lg:sticky lg:top-4 lg:h-fit">
          <p className="px-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Questions</p>
          <div className="mt-2.5 max-h-[55vh] space-y-0.5 overflow-y-auto pr-0.5 lg:max-h-[65vh]">
            {questions.map((qq, i) => {
              const answered = selections[qq.id] != null;
              const isFlagged = flagged[qq.id];
              const isCurrent = i === current;
              const showResult = practiceMode && revealed[qq.id];
              const wasCorrect = showResult && selections[qq.id] === qq.correctIndex;
              return (
                <button
                  key={qq.id}
                  onClick={() => setCurrent(i)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] font-medium transition ${
                    isCurrent
                      ? "bg-slate-900 text-white"
                      : showResult
                      ? wasCorrect
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                      : answered
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10.5px] font-bold ${
                      isCurrent
                        ? "bg-white/20 text-white"
                        : showResult
                        ? wasCorrect
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-red-200 text-red-800"
                        : answered
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate">Question {i + 1}</span>
                  {isFlagged && <span className="ml-auto h-1.5 w-1.5 flex-none rounded-full bg-amber-500" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-3 w-full rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            {practiceMode ? "Finish session" : "Submit exam"}
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-premium">
            <h3 className="text-lg font-bold text-slate-900">{practiceMode ? "Finish this session?" : "Submit this mock?"}</h3>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ve answered {answeredCount} of {questions.length} questions.
              {!practiceMode && answeredCount < questions.length && " Unanswered questions will be marked incorrect."}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep going
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {practiceMode ? "Finish" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
