Drop resource images for question explanations here (diagrams, labeled illustrations, tables, etc).

Then reference them in `prisma/seed.ts` on the matching question:

```ts
{
  stem: "The brachial plexus is formed by the ventral rami of which spinal nerves?",
  options: [...],
  correctIndex: 2,
  explanation: "...",
  explanationImages: ["/explanations/brachial-plexus.png"],
}
```

A question can have more than one image — just add more entries to the array. After editing
`prisma/seed.ts`, run `npm run db:seed` again to apply it (safe to re-run; it updates existing
questions by matching their stem instead of duplicating them).
