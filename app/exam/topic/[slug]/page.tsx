import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";
import { TOPIC_MOCK_QUESTION_COUNT, timeLimitSecFor } from "@/lib/exam";

export default async function TopicExamPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const topic = await prisma.topic.findUnique({
    where: { slug: params.slug },
    include: { system: true, _count: { select: { questions: true } } },
  });
  if (!topic) notFound();

  const questionCount = Math.min(TOPIC_MOCK_QUESTION_COUNT, topic._count.questions);
  const minutes = Math.round(timeLimitSecFor(questionCount) / 60);

  return (
    <ExamLauncher
      examType="TOPIC"
      topicSlug={topic.slug}
      title={`${topic.name} Mock`}
      description={`${topic.system.name} — ${topic.description}`}
      questionCount={questionCount}
      minutes={minutes}
    />
  );
}
