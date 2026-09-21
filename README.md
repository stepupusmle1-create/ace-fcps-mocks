# FCPS Mock Exam

System-wise mocks and a full-length Grand Mock for FCPS Part 1 preparation, with per-user
accounts, timed exams, scoring, and attempt history.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Prisma + SQLite (`prisma/dev.db`)
- Custom email/password auth (bcrypt + signed JWT cookie via `jose`)

## Getting started

```bash
npm install
npm run db:push    # create/sync the SQLite schema
npm run db:seed    # load 8 sample FCPS Part 1 systems (~80 questions)
npm run dev         # http://localhost:3100
```

## How it's organized

- `prisma/schema.prisma` — `User`, `System`, `Question`, `Attempt`, `AttemptAnswer`.
- `prisma/seed.ts` — sample question bank, grouped by system. **Replace this with your real
  question bank** — each question needs a stem, 4 options, `correctIndex`, and an explanation.
- `lib/exam.ts` — exam engine constants: questions per system mock (`SYSTEM_MOCK_QUESTION_COUNT`),
  questions per Grand Mock (`GRAND_MOCK_QUESTION_COUNT`), seconds per question, and pass threshold.
- `app/exam/system/[slug]` and `app/exam/grand` — start screens that hand off to the shared
  `ExamRunner` (timer, question navigator, flag-for-review, auto-submit on time-up).
- `app/api/exam/start` and `app/api/exam/[attemptId]/submit` — server-side question selection and
  scoring (correct answers are never sent to the client until after submit).
- `app/attempt/[id]` — score breakdown (by system, for Grand Mock) plus full per-question review
  with explanations.
- `app/history` — every submitted attempt for the logged-in user.

## Adding real questions

Edit the `systems` array in `prisma/seed.ts` (add/replace systems and questions), then run
`npm run db:seed` again — it upserts by system slug and skips questions with a stem that already
exists, so re-running is safe.
