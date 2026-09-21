import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";

export default async function QBankSystemPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const system = await prisma.system.findUnique({
    where: { slug: params.slug },
    include: { topics: { include: { _count: { select: { questions: true } } } } },
  });
  if (!system) notFound();

  const questionCount = system.topics.reduce((sum, t) => sum + t._count.questions, 0);

  return (
    <ExamLauncher
      examType="SYSTEM"
      systemSlug={system.slug}
      mode="PRACTICE"
      title={`${system.name} Q Bank`}
      description={system.description}
      questionCount={questionCount}
      minutes={0}
    />
  );
}
