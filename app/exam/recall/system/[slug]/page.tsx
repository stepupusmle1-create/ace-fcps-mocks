import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";
import { timeLimitSecFor } from "@/lib/exam";

export default async function RecallSystemTestingPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const system = await prisma.system.findUnique({ where: { slug: params.slug } });
  if (!system) notFound();

  const questionCount = await prisma.question.count({
    where: { topic: { systemId: system.id }, isRecall: true },
  });
  if (questionCount === 0) notFound();

  const minutes = Math.round(timeLimitSecFor(questionCount) / 60);

  return (
    <ExamLauncher
      examType="SYSTEM"
      systemSlug={system.slug}
      recallOnly
      title={`${system.name} Recall — Testing`}
      description={`Every recalled question for ${system.name}, timed like the real exam.`}
      questionCount={questionCount}
      minutes={minutes}
    />
  );
}
