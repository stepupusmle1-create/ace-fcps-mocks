"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageCircle,
  NotebookPen,
  Stethoscope,
  Trophy,
} from "lucide-react";
import { PLAN_DAYS, PLAN_RESOURCES, PLAN_SUBJECTS, faPageCount, faRangeLabel, type PlanDay } from "@/lib/study-plan";

const STORAGE_KEY = "ace-fcps-study-plan-v1";

type Saved = { done: number[]; start: string };

function readSaved(): Saved {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { done: Array.isArray(parsed.done) ? parsed.done : [], start: typeof parsed.start === "string" ? parsed.start : "" };
    }
  } catch {}
  return { done: [], start: "" };
}

function dateFor(start: string, day: number) {
  if (!start) return null;
  const d = new Date(`${start}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + day - 1);
  return d;
}

const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

export function StudyPlan() {
  const [tab, setTab] = useState<"medical" | "dentistry">("medical");
  const [done, setDone] = useState<number[]>([]);
  const [start, setStart] = useState("");
  const [subject, setSubject] = useState<string>("all");
  const [open, setOpen] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readSaved();
    setDone(saved.done);
    setStart(saved.start);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ done, start }));
    } catch {}
  }, [done, start, ready]);

  const subjectOrder = useMemo(() => {
    const order: { key: string; days: PlanDay[] }[] = [];
    for (const d of PLAN_DAYS) {
      const last = order[order.length - 1];
      if (last && last.key === d.subject) last.days.push(d);
      else order.push({ key: d.subject, days: [d] });
    }
    return order;
  }, []);

  const todayDay = useMemo(() => {
    if (!start) return null;
    const first = dateFor(start, 1);
    if (!first) return null;
    const diff = Math.floor((Date.now() - first.getTime()) / 86400000) + 1;
    return diff >= 1 && diff <= PLAN_DAYS.length ? diff : null;
  }, [start]);

  const toggleDone = (n: number) => setDone((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  const toggleOpen = (n: number) => setOpen((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  const percent = Math.round((done.length / PLAN_DAYS.length) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="inline-flex rounded-full border border-brand-100 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("medical")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "medical" ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <Stethoscope size={15} /> FCPS Part 1 — Medical
        </button>
        <button
          type="button"
          onClick={() => setTab("dentistry")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === "dentistry" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <GraduationCap size={15} /> Dentistry
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tab === "dentistry" ? "bg-white/25" : "bg-orange-100 text-orange-700"}`}>Soon</span>
        </button>
      </div>

      {tab === "dentistry" ? (
        <DentistryComingSoon />
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Your progress</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {done.length} <span className="text-base font-semibold text-slate-400">of {PLAN_DAYS.length} days done</span>
                  </p>
                </div>
                <label className="text-[12px] font-semibold text-slate-500">
                  Start date
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="mt-1 block rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-normal text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </label>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-[12px] text-slate-500">
                {start
                  ? todayDay
                    ? `Today is Day ${todayDay}: ${PLAN_DAYS[todayDay - 1].title}.`
                    : "Dates are shown on every day card."
                  : "Pick your start date to see a calendar date on every day. Ticks are saved on this device."}
              </p>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-orange-700">Daily rhythm</p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-orange-900">
                <li><b>Morning:</b> First Aid pages of the day</li>
                <li><b>Afternoon:</b> BRS / Pathoma / Snell / Ten Teachers</li>
                <li><b>Evening:</b> live class, then MCQs</li>
                <li><b>Last 20 min:</b> Dr Bilal&apos;s notes and yesterday&apos;s recap</li>
              </ul>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <CalendarDays size={18} className="text-brand-600" /> {PLAN_DAYS.length} days, subject by subject
            </h2>
            <div className="mt-3 flex h-9 w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              {subjectOrder.map(({ key, days }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSubject(key);
                    document.getElementById(`subject-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  title={`${PLAN_SUBJECTS[key].name}: ${days.length} day${days.length > 1 ? "s" : ""}`}
                  className="h-full border-r border-white/60 transition hover:brightness-110"
                  style={{ width: `${(days.length / PLAN_DAYS.length) * 100}%`, background: PLAN_SUBJECTS[key].color }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSubject("all")}
                className={`rounded-full border px-3 py-1 text-[12px] font-semibold transition ${subject === "all" ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                All subjects
              </button>
              {subjectOrder.map(({ key, days }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSubject(key)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold transition ${subject === key ? "text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                  style={subject === key ? { background: PLAN_SUBJECTS[key].color, borderColor: PLAN_SUBJECTS[key].color } : undefined}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: PLAN_SUBJECTS[key].color }} />
                  {PLAN_SUBJECTS[key].name} · {days.length}d
                </button>
              ))}
            </div>
          </section>

          <details className="group mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-lg font-bold text-slate-900">
              <span className="flex items-center gap-2">
                <BookOpen size={18} className="text-brand-600" /> Your resources
              </span>
              <ChevronDown size={18} className="text-slate-400 transition group-open:rotate-180" />
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PLAN_RESOURCES.map((r) => (
                <div key={r.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">{r.name}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">{r.use}</p>
                </div>
              ))}
            </div>
          </details>

          <div className="mt-8 space-y-8">
            {subjectOrder
              .filter(({ key }) => subject === "all" || subject === key)
              .map(({ key, days }) => (
                <section key={key} id={`subject-${key}`} className="scroll-mt-20">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-1.5 rounded-full" style={{ background: PLAN_SUBJECTS[key].color }} />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{PLAN_SUBJECTS[key].name}</h3>
                      <p className="text-[12px] text-slate-500">
                        Day {days[0].day}
                        {days.length > 1 ? `–${days[days.length - 1].day}` : ""} · {days.length} day{days.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    {days.map((d) => (
                      <DayCard
                        key={d.day}
                        d={d}
                        color={PLAN_SUBJECTS[key].color}
                        done={done.includes(d.day)}
                        isToday={todayDay === d.day}
                        date={dateFor(start, d.day)}
                        expanded={open.includes(d.day)}
                        onToggleDone={() => toggleDone(d.day)}
                        onToggleOpen={() => toggleOpen(d.day)}
                      />
                    ))}
                  </div>
                </section>
              ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 text-[13px] leading-relaxed text-slate-600">
            <p className="font-semibold text-slate-900">Good to know</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>First Aid page numbers are the printed page numbers of the 2025 (35th) edition.</li>
              <li>BRS, Pathoma, Snell and Ten Teachers are given by chapter and section name, because chapter numbers differ between editions.</li>
              <li>Rafiullah page numbers are listed only for the Cardiovascular chapter (pp. 21–41), the part of the book we have. For the other subjects the plan gives a daily MCQ target.</li>
              <li>Oncology and Microbiology are not part of this schedule, and general pharmacology is used as filler on the last revision days. Pathology, biochemistry, anatomy and histology have no Q Bank system yet.</li>
              <li>Dr Bilal can change the order or the number of days for any subject; the plan will be updated here.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function DayCard({
  d,
  color,
  done,
  isToday,
  date,
  expanded,
  onToggleDone,
  onToggleOpen,
}: {
  d: PlanDay;
  color: string;
  done: boolean;
  isToday: boolean;
  date: Date | null;
  expanded: boolean;
  onToggleDone: () => void;
  onToggleOpen: () => void;
}) {
  const pages = faPageCount(d);
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${isToday ? "border-orange-400 ring-2 ring-orange-200" : done ? "border-brand-200 bg-brand-50/40" : "border-slate-200"}`}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          onClick={onToggleDone}
          aria-label={done ? `Mark day ${d.day} as not done` : `Mark day ${d.day} as done`}
          className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border-2 transition ${done ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-transparent hover:border-brand-500"}`}
        >
          <CheckCircle2 size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white" style={{ background: color }}>
              Day {d.day}
            </span>
            {date && <span className="text-[12px] font-medium text-slate-500">{fmt(date)}</span>}
            {isToday && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">TODAY</span>}
            {d.kind === "test" && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                <ClipboardCheck size={11} /> SUBJECT TEST
              </span>
            )}
            {d.kind === "revision" && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                <Trophy size={11} /> GRAND MOCK
              </span>
            )}
          </div>
          <h4 className="mt-1.5 text-[15px] font-bold leading-snug text-slate-900">{d.title}</h4>
          <p className="mt-0.5 text-[13px] text-slate-500">{d.focus}</p>

          <div className="mt-3 space-y-2 text-[13px]">
            {d.fa.length > 0 && (
              <div className="flex gap-2">
                <FileText size={15} className="mt-0.5 flex-none text-brand-600" />
                <p className="text-slate-700">
                  <b>First Aid 2025:</b> {d.fa.map(faRangeLabel).join(", ")}
                  <span className="text-slate-400"> · {pages} page{pages > 1 ? "s" : ""}</span>
                </p>
              </div>
            )}
            {d.also.map((a) => (
              <div key={a.resource + a.detail} className="flex gap-2">
                <BookOpen size={15} className="mt-0.5 flex-none text-brand-600" />
                <p className="text-slate-700">
                  <b>{a.resource}:</b> {a.detail}
                </p>
              </div>
            ))}
            <div className="flex gap-2">
              <NotebookPen size={15} className="mt-0.5 flex-none text-brand-600" />
              <p className="text-slate-700">{d.notes}</p>
            </div>
            <div className="flex gap-2">
              <ClipboardCheck size={15} className="mt-0.5 flex-none text-orange-600" />
              <p className="text-slate-700">
                <b>Rafiullah:</b> {d.rafi}
                <br />
                <b>ACE FCPS:</b> {d.ace}
              </p>
            </div>
          </div>

          {d.fa.some((r) => r.topics.length > 0) && (
            <>
              <button
                type="button"
                onClick={onToggleOpen}
                className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-brand-700 hover:underline"
              >
                {expanded ? "Hide" : "Show"} First Aid topics page by page
                <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
              </button>
              {expanded && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {d.fa.flatMap((r) => r.topics).map((t, i) => (
                    <span key={`${t}-${i}`} className="rounded-md bg-slate-100 px-2 py-1 text-[11.5px] text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function DentistryComingSoon() {
  const waUrl = `https://wa.me/923063336230?text=${encodeURIComponent("I want to know when the FCPS Dentistry session starts")}`;
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-brand-50 p-8 text-center shadow-premium sm:p-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-[12px] font-bold tracking-wide text-white">
        <GraduationCap size={14} /> COMING SOON
      </span>
      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">FCPS Dentistry</h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
        We are happy to announce our <b>dentistry FCPS session</b>. The study plan, resources and live classes will be published here.
      </p>
      <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-brand-100 bg-white px-5 py-3 text-left shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white">
          <Stethoscope size={18} />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mentor and teacher</p>
          <p className="text-base font-bold text-slate-900">Dr Imran</p>
        </div>
      </div>
      <div className="mt-8">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25d366] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
        >
          <MessageCircle size={17} /> Tell me when it starts
        </a>
      </div>
    </div>
  );
}
