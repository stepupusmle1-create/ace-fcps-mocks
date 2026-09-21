import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";

export default async function RecallSystemTutorPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const system = await prisma.system.findUnique({ where: { slug: params.slug } });
  if (!system) notFound();

  const questionCount = await prisma.question.count({
    where: { topic: { systemId: system.id }, isRecall: true },
  });
  if (questionCount === 0) notFound();

  return (
    <ExamLauncher
      examType="SYSTEM"
      systemSlug={system.slug}
      recallOnly
      mode="PRACTICE"
      title={`${system.name} Recall — Tutor`}
      description={`Study every recalled question for ${system.name}, with explanations shown right after each answer.`}
      questionCount={questionCount}
      minutes={0}
    />
  );
}
