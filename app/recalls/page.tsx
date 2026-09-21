import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RecallTopicPicker } from "@/components/recall-topic-picker";

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

      {pickerData.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <GraduationCap size={22} className="mx-auto text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">
            No recall content has been added yet &mdash; check back soon.
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
          <RecallTopicPicker systems={pickerData} />
        </>
      )}
    </div>
  );
}
