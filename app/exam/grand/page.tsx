import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";
import { GRAND_MOCK_QUESTION_COUNT, timeLimitSecFor } from "@/lib/exam";

export default async function GrandExamPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const totalQuestions = await prisma.question.count();
  const questionCount = Math.min(GRAND_MOCK_QUESTION_COUNT, totalQuestions);
  const minutes = Math.round(timeLimitSecFor(questionCount) / 60);

  return (
    <ExamLauncher
      examType="GRAND"
      title="Grand Mock"
      description="A full-length, mixed-system exam simulation drawing questions from every subject — the closest thing to exam day."
      questionCount={questionCount}
      minutes={minutes}
    />
  );
}
