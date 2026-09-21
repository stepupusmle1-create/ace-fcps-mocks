import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  GRAND_MOCK_QUESTION_COUNT,
  SYSTEM_MOCK_QUESTION_COUNT,
  TOPIC_MOCK_QUESTION_COUNT,
  shuffle,
  timeLimitSecFor,
} from "@/lib/exam";

type PoolQuestion = {
  id: string;
  stem: string;
  optionsJson: string;
  correctIndex: number;
  explanation: string;
  optionExplanationsJson: string | null;
  reference: string | null;
  explanationImagesJson: string | null;
  topic: { name: string; system: { name: string } };
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const examType =
    body?.examType === "GRAND"
      ? "GRAND"
      : body?.examType === "TOPIC"
      ? "TOPIC"
      : body?.examType === "SYSTEM"
      ? "SYSTEM"
      : body?.examType === "CUSTOM"
      ? "CUSTOM"
      : null;
  if (!examType) {
    return NextResponse.json({ error: "Invalid exam type." }, { status: 400 });
  }
  // Recall sets (e.g. "July attempt recalls") are a fixed pool per system/topic — testing
  // mode draws the whole set instead of a random sample, same as tutor mode.
  const recallOnly = body?.recallOnly === true;
  // Custom multi-topic Q Bank selections are always untimed practice; custom recall
  // selections can be either Testing (timed) or Tutor (untimed), same as everywhere else.
  const mode =
    examType === "CUSTOM" && !recallOnly ? "PRACTICE" : body?.mode === "PRACTICE" ? "PRACTICE" : "MOCK";

  let systemId: string | null = null;
  let systemName: string | null = null;
  let topicId: string | null = null;
  let topicName: string | null = null;
  let where: { topicId?: { in: string[] } | string; topic?: { systemId: string }; isRecall?: boolean } = {};
  let targetCount = GRAND_MOCK_QUESTION_COUNT;
  let storedExamType: string = examType;

  if (examType === "CUSTOM") {
    const topicIds = Array.isArray(body?.topicIds) ? body.topicIds.filter((id: unknown) => typeof id === "string") : [];
    if (topicIds.length === 0) {
      return NextResponse.json({ error: "Select at least one topic." }, { status: 400 });
    }
    where = { topicId: { in: topicIds } };
    if (recallOnly) storedExamType = "RECALL_CUSTOM";
  } else if (examType === "TOPIC") {
    const slug = typeof body?.topicSlug === "string" ? body.topicSlug : "";
    const topic = await prisma.topic.findUnique({ where: { slug }, include: { system: true } });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }
    topicId = topic.id;
    topicName = topic.name;
    systemId = topic.systemId;
    systemName = topic.system.name;
    targetCount = TOPIC_MOCK_QUESTION_COUNT;
    where = { topicId: topic.id };
    storedExamType = recallOnly ? "RECALL_TOPIC" : "TOPIC";
  } else if (examType === "SYSTEM") {
    const slug = typeof body?.systemSlug === "string" ? body.systemSlug : "";
    const system = await prisma.system.findUnique({ where: { slug } });
    if (!system) {
      return NextResponse.json({ error: "System not found." }, { status: 404 });
    }
    systemId = system.id;
    systemName = system.name;
    targetCount = SYSTEM_MOCK_QUESTION_COUNT;
    where = { topic: { systemId: system.id } };
    storedExamType = recallOnly ? "RECALL_SYSTEM" : "SYSTEM";
  } else {
    targetCount = GRAND_MOCK_QUESTION_COUNT;
  }

  if (recallOnly) {
    where = { ...where, isRecall: true };
  }

  // Only pull ids over the wire to pick the sample — the full rows (stem, options,
  // explanations) are fetched afterward for just the questions we're actually using.
  const idRows = await prisma.question.findMany({ where, select: { id: true } });
  if (idRows.length === 0) {
    return NextResponse.json({ error: "No questions are available yet." }, { status: 400 });
  }

  const shuffledIds = shuffle(idRows.map((r) => r.id));
  const selectedIds =
    mode === "PRACTICE" || recallOnly ? shuffledIds : shuffledIds.slice(0, Math.min(targetCount, shuffledIds.length));

  const rows = await prisma.question.findMany({
    where: { id: { in: selectedIds } },
    include: { topic: { include: { system: true } } },
  });
  const rowById = new Map(rows.map((r) => [r.id, r as PoolQuestion]));
  const selected = selectedIds.map((id) => rowById.get(id)!).filter(Boolean);
  const timeLimitSec = mode === "PRACTICE" ? 0 : timeLimitSecFor(selected.length);

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.id,
      examType: storedExamType,
      mode,
      systemId,
      systemName,
      topicId,
      topicName,
      questionOrderJson: JSON.stringify(selected.map((q) => q.id)),
      totalQuestions: selected.length,
      timeLimitSec,
      status: "IN_PROGRESS",
    },
  });

  const questions = selected.map((q) => ({
    id: q.id,
    stem: q.stem,
    options: JSON.parse(q.optionsJson) as string[],
    systemName: q.topic.system.name,
    topicName: q.topic.name,
    ...(mode === "PRACTICE"
      ? {
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          optionExplanations: q.optionExplanationsJson
            ? (JSON.parse(q.optionExplanationsJson) as string[])
            : undefined,
          reference: q.reference,
          explanationImages: q.explanationImagesJson ? (JSON.parse(q.explanationImagesJson) as string[]) : [],
        }
      : {}),
  }));

  return NextResponse.json({
    attemptId: attempt.id,
    timeLimitSec,
    mode,
    questions,
  });
}
