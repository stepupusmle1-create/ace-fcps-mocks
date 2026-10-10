import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { RECALL_SETS } from "@/lib/recalls";

export const getQuestionTotals = unstable_cache(
  async () => {
    const [regular, recall, systems, publicTotal] = await Promise.all([
      prisma.question.count({ where: { isRecall: false } }),
      prisma.question.count({ where: { isRecall: true } }),
      prisma.system.count(),
      prisma.question.count({ where: { OR: [{ recallSet: null }, { recallSet: { not: "october-2026-retired" } }] } }),
    ]);
    return { regular, recall, systems, publicTotal };
  },
  ["question-totals"],
  { revalidate: 300 },
);

export const getRegularSystems = unstable_cache(
  async () =>
    prisma.system.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: { _count: { select: { questions: { where: { isRecall: false } } } } },
        },
      },
    }),
  ["regular-systems"],
  { revalidate: 300 },
);

export const getRecallOverview = unstable_cache(
  async (setSlug: string, paper: string | null) => {
    const set = RECALL_SETS.find((s) => s.slug === setSlug) ?? RECALL_SETS[0];
    const [paperRows, setCounts] = await Promise.all([
      prisma.question.groupBy({
        by: ["recallPaper"],
        where: { isRecall: true, recallSet: set.value, recallPaper: { not: null } },
        _count: { _all: true },
        orderBy: { recallPaper: "asc" },
      }),
      Promise.all(RECALL_SETS.map((s) => prisma.question.count({ where: { isRecall: true, recallSet: s.value } }))),
    ]);
    const activePaper = paperRows.find((r) => r.recallPaper === paper)?.recallPaper ?? null;
    const systems = await prisma.system.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: {
                questions: { where: { isRecall: true, recallSet: set.value, ...(activePaper ? { recallPaper: activePaper } : {}) } },
              },
            },
          },
        },
      },
    });
    return { paperRows, setCounts, activePaper, systems };
  },
  ["recall-overview"],
  { revalidate: 300 },
);
