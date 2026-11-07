import type { Metadata } from "next";
import { StudyPlan } from "@/components/study-plan";

export const metadata: Metadata = {
  title: "Study Plan — ACE FCPS by Dr Bilal",
  description: "A 58-day, day-by-day FCPS Part 1 study plan with First Aid pages, BRS, Pathoma, Snell, Ten Teachers and daily MCQs. FCPS Dentistry coming soon.",
};

export default function StudyPlanPage() {
  return (
    <div>
      <div className="border-b border-brand-100 bg-gradient-to-br from-brand-800 to-brand-950 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-300">ACE FCPS by Dr Bilal</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">FCPS Part 1 Study Plan</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
            58 days, subject by subject, with the exact First Aid pages, the chapter from your second book, and the MCQs to do each day.
          </p>
        </div>
      </div>
      <StudyPlan />
    </div>
  );
}
