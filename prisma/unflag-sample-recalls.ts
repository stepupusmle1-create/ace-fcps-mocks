import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REAL_RECALL_SOURCE_PREFIXES = ["Internal Medicine —", "Surgery —", "Gynecology & Obstetrics —"];

async function main() {
  const recallQuestions = await prisma.question.findMany({
    where: { isRecall: true },
    select: { id: true, reference: true },
  });

  const legacyIds = recallQuestions
    .filter((q) => !REAL_RECALL_SOURCE_PREFIXES.some((p) => q.reference?.startsWith(p)))
    .map((q) => q.id);

  if (legacyIds.length === 0) {
    console.log("No legacy sample-flagged recall questions found.");
    return;
  }

  await prisma.question.updateMany({
    where: { id: { in: legacyIds } },
    data: { isRecall: false },
  });
  console.log(`Unflagged ${legacyIds.length} legacy sample recall question(s), restored to regular Q Bank.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
