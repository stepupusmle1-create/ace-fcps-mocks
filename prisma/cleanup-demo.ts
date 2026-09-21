import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUsers = await prisma.user.findMany({
    where: { email: { contains: "marketing-demo-" } },
  });
  const demoUsers2 = await prisma.user.findMany({
    where: { email: { contains: "marketing-mobile-" } },
  });
  const ids = [...demoUsers, ...demoUsers2].map((u) => u.id);
  if (ids.length === 0) {
    console.log("No demo marketing accounts to clean up.");
    return;
  }
  const attempts = await prisma.attempt.findMany({ where: { userId: { in: ids } }, select: { id: true } });
  const attemptIds = attempts.map((a) => a.id);
  await prisma.attemptAnswer.deleteMany({ where: { attemptId: { in: attemptIds } } });
  await prisma.attempt.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  console.log(`Cleaned up ${ids.length} demo marketing account(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
