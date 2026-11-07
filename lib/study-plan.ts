import data from "@/lib/study-plan-data.json";

export type PlanSubject = { name: string; color: string };
export type PlanDay = {
  day: number;
  subject: string;
  title: string;
  focus: string;
  kind: "study" | "test" | "revision";
  fa: { from: number; to: number; topics: string[] }[];
  also: { resource: string; detail: string }[];
  notes: string;
  rafi: string;
  ace: string;
};

export const PLAN_SUBJECTS = data.subjects as Record<string, PlanSubject>;
export const PLAN_DAYS = data.days as PlanDay[];

export function faPageCount(d: PlanDay) {
  return d.fa.reduce((sum, r) => sum + (r.to - r.from + 1), 0);
}

export function faRangeLabel(r: { from: number; to: number }) {
  return r.from === r.to ? `p. ${r.from}` : `pp. ${r.from}–${r.to}`;
}

export const PLAN_RESOURCES = [
  { name: "First Aid for the USMLE Step 1 (2025)", use: "Main text for every system. Page numbers in this plan are the printed page numbers of the 35th edition." },
  { name: "BRS Physiology", use: "Physiology chapters: cell, neuro, cardiovascular, respiratory, renal, GI and endocrine." },
  { name: "Pathoma", use: "General and systemic pathology, watched or read after the First Aid pages." },
  { name: "Snell — Clinical Anatomy by Regions", use: "Gross anatomy, with Dr Bilal's notes." },
  { name: "Ten Teachers", use: "Reproductive system: obstetrics and gynaecology." },
  { name: "Rafiullah practice MCQs", use: "Daily paper-style MCQs for the subject you just read." },
  { name: "Dr Bilal's notes", use: "Shared by Dr Bilal for each subject; read them last, then revise." },
];
