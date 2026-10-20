import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const SYSTEM = {
  slug: "cell-physiology",
  name: "Cell Physiology",
  description: "Membrane transport, osmosis, resting potential, and the action potential.",
  order: 13,
};

const TOPICS = [
  { slug: "cell-membrane-transport", name: "Membrane Transport & Diffusion", description: "Passive and active transport, carriers, pumps, and diffusion.", order: 1 },
  { slug: "cell-osmosis-tonicity", name: "Osmosis & Tonicity", description: "Water movement, osmolarity, and tonicity of solutions.", order: 2 },
  { slug: "cell-membrane-potential", name: "Resting Membrane Potential", description: "Ion gradients, Nernst and GHK equations, and the resting potential.", order: 3 },
  { slug: "cell-action-potential", name: "Action Potential & Excitability", description: "Phases of the action potential, channels, and refractory periods.", order: 4 },
];

type Meta = Record<string, { topicSlug: string; images: string[]; attribution: string }>;

async function main() {
  const system = await prisma.system.upsert({
    where: { slug: SYSTEM.slug },
    update: { name: SYSTEM.name, description: SYSTEM.description, order: SYSTEM.order },
    create: SYSTEM,
  });
  for (const t of TOPICS) {
    await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, order: t.order, systemId: system.id },
      create: { ...t, systemId: system.id },
    });
  }

  const meta = JSON.parse(fs.readFileSync(path.join(__dirname, "physiology-meta.json"), "utf8")) as Meta;
  let updated = 0;
  for (const [stem, m] of Object.entries(meta)) {
    const topic = await prisma.topic.findUnique({ where: { slug: m.topicSlug } });
    if (!topic) continue;
    const q = await prisma.question.findFirst({ where: { stem, isRecall: false, reference: { startsWith: "Physiology Practice" } } });
    if (!q) continue;
    let explanation = m.topicSlug.startsWith("cell-")
      ? q.explanation.replace(/\(First Aid — [^)]*\)/, "(First Aid — Biochemistry: Cell Biology & Membrane Physiology)")
      : q.explanation;
    if (!explanation.includes("Picture:")) explanation = `${explanation} ${m.attribution}`;
    await prisma.question.update({
      where: { id: q.id },
      data: { topicId: topic.id, explanation, explanationImagesJson: JSON.stringify(m.images) },
    });
    updated++;
  }
  console.log(`Physiology: ${updated} question(s) assigned and illustrated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
