import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";
import { SYSTEM_MOCK_QUESTION_COUNT, timeLimitSecFor } from "@/lib/exam";

export default async function SystemExamPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const system = await prisma.system.findUnique({
    where: { slug: params.slug },
    include: { topics: { include: { _count: { select: { questions: true } } } } },
  });
  if (!system) notFound();

  const totalQuestions = system.topics.reduce((sum, t) => sum + t._count.questions, 0);
  const questionCount = Math.min(SYSTEM_MOCK_QUESTION_COUNT, totalQuestions);
  const minutes = Math.round(timeLimitSecFor(questionCount) / 60);

  return (
    <ExamLauncher
      examType="SYSTEM"
      systemSlug={system.slug}
      title={`${system.name} Mock`}
      description={system.description}
      questionCount={questionCount}
      minutes={minutes}
    />
  );
}
