import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type IngestQuestion = {
  systemSlug: string;
  topicSlug: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  optionExplanations?: string[];
  source?: string;
  explanationImages?: string[];
  imageAttribution?: string;
  recallSet?: string;
  recallPaper?: string;
};

function shuffleOptions(q: IngestQuestion): { options: string[]; correctIndex: number; optionExplanations?: string[] } {
  const indices = q.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    options: indices.map((i) => q.options[i]),
    correctIndex: indices.indexOf(q.correctIndex),
    optionExplanations: q.optionExplanations ? indices.map((i) => q.optionExplanations![i]) : undefined,
  };
}

async function main() {
  const dataDir = path.join(__dirname, "recall-data");
  if (!fs.existsSync(dataDir)) {
    console.log("No recall-data directory found, nothing to ingest.");
    return;
  }
  const prefix = process.env.INGEST_PREFIX;
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json") && (!prefix || f.startsWith(prefix)));
  if (files.length === 0) {
    console.log("No JSON files found in recall-data, nothing to ingest.");
    return;
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const questions: IngestQuestion[] = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(`Ingesting ${questions.length} questions from ${file}...`);

    for (const q of questions) {
      const topic = await prisma.topic.findUnique({ where: { slug: q.topicSlug } });
      if (!topic) {
        console.warn(`  Skipping question, unknown topicSlug "${q.topicSlug}": ${q.stem.slice(0, 60)}...`);
        skipped++;
        continue;
      }

      const { options, correctIndex, optionExplanations } = shuffleOptions(q);
      const explanation = q.imageAttribution ? `${q.explanation} ${q.imageAttribution}` : q.explanation;
      const data = {
        topicId: topic.id,
        stem: q.stem,
        optionsJson: JSON.stringify(options),
        correctIndex,
        explanation,
        optionExplanationsJson: optionExplanations ? JSON.stringify(optionExplanations) : null,
        reference: q.source ?? null,
        explanationImagesJson: q.explanationImages && q.explanationImages.length > 0 ? JSON.stringify(q.explanationImages) : null,
        isRecall: true,
        recallSet: q.recallSet ?? null,
        recallPaper: q.recallPaper ?? null,
      };

      const existing = await prisma.question.findFirst({
        where: { topicId: topic.id, stem: q.stem, isRecall: true, recallSet: q.recallSet ?? null },
      });
      if (existing) {
        await prisma.question.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        await prisma.question.create({ data });
        created++;
      }
    }
  }

  const totalQuestions = await prisma.question.count();
  console.log(`\nIngest complete: ${created} created, ${updated} updated, ${skipped} skipped.`);
  console.log(`Total questions in database: ${totalQuestions}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
