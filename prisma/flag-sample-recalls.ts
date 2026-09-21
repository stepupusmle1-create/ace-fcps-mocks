import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const already = await prisma.question.count({ where: { isRecall: true } });
  if (already > 0) {
    console.log(`${already} recall question(s) already flagged — skipping sample seed.`);
    return;
  }

  const cvTopic = await prisma.topic.findUnique({ where: { slug: "cardiac-anatomy-embryology" } });
  const renalTopic = await prisma.topic.findFirst({ where: { system: { slug: "renal" } } });

  let flagged = 0;
  for (const topic of [cvTopic, renalTopic].filter((t): t is NonNullable<typeof t> => Boolean(t))) {
    const qs = await prisma.question.findMany({ where: { topicId: topic.id }, take: 6 });
    for (const q of qs) {
      await prisma.question.update({ where: { id: q.id }, data: { isRecall: true } });
      flagged++;
    }
  }
  console.log(`Flagged ${flagged} sample recall question(s) so the Recalls section is visible.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
