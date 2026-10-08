export const RECALL_SETS = [
  { slug: "october-2026", label: "October 2026 Recalls", value: "october-2026" as string | null },
  { slug: "past", label: "Past Papers", value: null as string | null },
];

export function resolveRecallSet(slug: unknown) {
  return RECALL_SETS.find((s) => s.slug === slug) ?? null;
}
