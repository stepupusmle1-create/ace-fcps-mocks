import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { attemptId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const attempt = await prisma.attempt.findUnique({ where: { id: params.attemptId } });
  if (!attempt || attempt.userId !== user.id) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }
  if (attempt.status === "SUBMITTED") {
    return NextResponse.json({ attemptId: attempt.id });
  }

  const body = await req.json().catch(() => null);
  const answers: { questionId: string; selectedIndex: number | null }[] = Array.isArray(body?.answers)
    ? body.answers
    : [];
  const elapsedSec = Number.isFinite(body?.elapsedSec) ? Math.max(0, Math.round(body.elapsedSec)) : 0;

  const questionOrder: string[] = JSON.parse(attempt.questionOrderJson);
  const questions = await prisma.question.findMany({ where: { id: { in: questionOrder } } });
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const answerByQuestion = new Map(answers.map((a) => [a.questionId, a.selectedIndex]));

  let correctCount = 0;
  const answerRows = questionOrder.map((questionId, index) => {
    const question = questionById.get(questionId);
    const selectedIndex = answerByQuestion.get(questionId) ?? null;
    const correct = question != null && selectedIndex != null && selectedIndex === question.correctIndex;
    if (correct) correctCount += 1;
    return {
      attemptId: attempt.id,
      questionId,
      order: index,
      selectedIndex,
      correct,
    };
  });

  const percent = questionOrder.length > 0 ? (correctCount / questionOrder.length) * 100 : 0;

  await prisma.$transaction([
    prisma.attemptAnswer.createMany({ data: answerRows }),
    prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: "SUBMITTED",
        correctCount,
        percent,
        durationSec: Math.min(elapsedSec || attempt.timeLimitSec, attempt.timeLimitSec + 60),
        submittedAt: new Date(),
      },
    }),
  ]);

  return NextResponse.json({ attemptId: attempt.id });
}
