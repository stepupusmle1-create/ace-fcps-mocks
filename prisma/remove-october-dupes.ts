import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const { remove } = JSON.parse(fs.readFileSync(path.join(__dirname, "october-dupes.json"), "utf8")) as { remove: { stem: string }[] };
  let deleted = 0;
  let kept = 0;
  for (const { stem } of remove) {
    const rows = await prisma.question.findMany({
      where: { stem, isRecall: true, recallSet: "october-2026" },
      select: { id: true, _count: { select: { attemptAnswers: true } } },
    });
    for (const row of rows) {
      if (row._count.attemptAnswers > 0) {
        kept++;
        continue;
      }
      await prisma.question.delete({ where: { id: row.id } });
      deleted++;
    }
  }
  console.log(`Removed ${deleted} duplicate October recall(s); left ${kept} that already have attempt history.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
