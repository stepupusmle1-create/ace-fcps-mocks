import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamLauncher } from "@/components/exam-launcher";

export default async function QBankGrandPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const totalQuestions = await prisma.question.count();

  return (
    <ExamLauncher
      examType="GRAND"
      mode="PRACTICE"
      title="Full Q Bank"
      description="Every question in the bank, across every system, in random order — untimed with instant feedback."
      questionCount={totalQuestions}
      minutes={0}
    />
  );
}
