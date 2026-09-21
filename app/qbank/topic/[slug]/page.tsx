import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";

export default async function QBankTopicPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const topic = await prisma.topic.findUnique({
    where: { slug: params.slug },
    include: { system: true, _count: { select: { questions: true } } },
  });
  if (!topic) notFound();

  return (
    <ExamLauncher
      examType="TOPIC"
      topicSlug={topic.slug}
      mode="PRACTICE"
      title={`${topic.name} Q Bank`}
      description={`${topic.system.name} — ${topic.description}`}
      questionCount={topic._count.questions}
      minutes={0}
    />
  );
}
