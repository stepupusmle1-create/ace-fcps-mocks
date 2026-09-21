import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QBankTopicPicker } from "@/components/qbank-topic-picker";

export default async function QBankPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [systems, totalQuestions] = await Promise.all([
    prisma.system.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: { _count: { select: { questions: true } } },
        },
      },
    }),
    prisma.question.count(),
  ]);

  const pickerData = systems.map((system) => ({
    id: system.id,
    name: system.name,
    topics: system.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      questionCount: topic._count.questions,
    })),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2">
        <BookOpen size={20} className="text-brand-600" />
        <h1 className="text-2xl font-bold text-slate-900">Q Bank</h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Untimed practice through every question in a system or topic, with the correct answer and
        explanation shown right after you answer &mdash; unlike mocks, which only show results at the end.
        Check off any combination of subsystems below, or start with the full bank.
      </p>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 to-brand-950 p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold">Practice all systems</h2>
            <p className="mt-1 max-w-md text-sm text-white/80">
              Every one of the {totalQuestions} questions in the bank, untimed, in random order.
            </p>
          </div>
          <Link
            href="/qbank/grand"
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50"
          >
            Start practice <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <QBankTopicPicker systems={pickerData} />
    </div>
  );
}
