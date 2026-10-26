import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type Data = {
  topics: { slug: string; name: string; order: number }[];
  questions: {
    topicSlug: string;
    stem: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    optionExplanations: string[];
    images: string[];
    attribution: string;
  }[];
};

const SOURCE = "Immunology Practice MCQs — Set 1";

// Creates the Immunology system and its questions once; existing questions are left untouched
// so that option order (and therefore past attempt reviews) never changes between deploys.
async function main() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "immunology-data.json"), "utf8")) as Data;
  const system = await prisma.system.upsert({
    where: { slug: "immunology" },
    update: { name: "Immunology", description: "Innate and adaptive immunity, hypersensitivity, immunodeficiency, transplantation, and immunopharmacology.", order: 14 },
    create: { slug: "immunology", name: "Immunology", description: "Innate and adaptive immunity, hypersensitivity, immunodeficiency, transplantation, and immunopharmacology.", order: 14 },
  });
  for (const t of data.topics) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { name: t.name, order: t.order, systemId: system.id },
      create: { slug: t.slug, name: t.name, description: t.name, order: t.order, systemId: system.id },
    });
  }

  let created = 0;
  for (const q of data.questions) {
    const topic = await prisma.topic.findUnique({ where: { slug: q.topicSlug } });
    if (!topic) continue;
    const existing = await prisma.question.findFirst({ where: { topicId: topic.id, stem: q.stem, isRecall: false } });
    if (existing) continue;
    const idx = q.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    await prisma.question.create({
      data: {
        topicId: topic.id,
        stem: q.stem,
        optionsJson: JSON.stringify(idx.map((i) => q.options[i])),
        correctIndex: idx.indexOf(q.correctIndex),
        explanation: `${q.explanation} ${q.attribution}`,
        optionExplanationsJson: JSON.stringify(idx.map((i) => q.optionExplanations[i])),
        reference: SOURCE,
        explanationImagesJson: JSON.stringify(q.images),
        isRecall: false,
      },
    });
    created++;
  }
  console.log(`Immunology: ${created} new question(s) added (${data.questions.length} in the set).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
