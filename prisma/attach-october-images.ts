import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const map = JSON.parse(fs.readFileSync(path.join(__dirname, "october-images.json"), "utf8")) as Record<string, string[]>;
  let updated = 0;
  for (const [stem, images] of Object.entries(map)) {
    const res = await prisma.question.updateMany({
      where: { stem, isRecall: true, recallSet: "october-2026" },
      data: { explanationImagesJson: JSON.stringify(images) },
    });
    updated += res.count;
  }
  console.log(`Attached pictures to ${updated} October recall question(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
