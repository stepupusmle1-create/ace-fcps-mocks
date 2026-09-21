import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";
import { timeLimitSecFor } from "@/lib/exam";

export default async function RecallTopicTestingPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const topic = await prisma.topic.findUnique({ where: { slug: params.slug }, include: { system: true } });
  if (!topic) notFound();

  const questionCount = await prisma.question.count({ where: { topicId: topic.id, isRecall: true } });
  if (questionCount === 0) notFound();

  const minutes = Math.round(timeLimitSecFor(questionCount) / 60);

  return (
    <ExamLauncher
      examType="TOPIC"
      topicSlug={topic.slug}
      recallOnly
      title={`${topic.name} Recall — Testing`}
      description={`${topic.system.name} — every recalled question for this topic, timed like the real exam.`}
      questionCount={questionCount}
      minutes={minutes}
    />
  );
}
