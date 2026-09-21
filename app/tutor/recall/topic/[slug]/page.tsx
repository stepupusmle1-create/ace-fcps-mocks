import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";

export default async function RecallTopicTutorPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const topic = await prisma.topic.findUnique({ where: { slug: params.slug }, include: { system: true } });
  if (!topic) notFound();

  const questionCount = await prisma.question.count({ where: { topicId: topic.id, isRecall: true } });
  if (questionCount === 0) notFound();

  return (
    <ExamLauncher
      examType="TOPIC"
      topicSlug={topic.slug}
      recallOnly
      mode="PRACTICE"
      title={`${topic.name} Recall — Tutor`}
      description={`${topic.system.name} — study every recalled question for this topic, with explanations shown right after each answer.`}
      questionCount={questionCount}
      minutes={0}
    />
  );
}
