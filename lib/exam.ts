export const SECONDS_PER_QUESTION = 72;
export const TOPIC_MOCK_QUESTION_COUNT = 20;
export const SYSTEM_MOCK_QUESTION_COUNT = 20;
export const GRAND_MOCK_QUESTION_COUNT = 200;
export const PASS_PERCENT = 60;

export function timeLimitSecFor(questionCount: number) {
  return questionCount * SECONDS_PER_QUESTION;
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type QuestionForExam = {
  id: string;
  stem: string;
  options: string[];
  systemName: string;
  topicName: string;
  correctIndex?: number;
  explanation?: string;
  optionExplanations?: string[];
  reference?: string | null;
  explanationImages?: string[];
};

export type SubmittedAnswer = {
  questionId: string;
  selectedIndex: number | null;
};

export type ReviewItem = {
  questionId: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  selectedIndex: number | null;
  correct: boolean;
  systemName: string | null;
};

export type SystemBreakdown = {
  systemName: string;
  correct: number;
  total: number;
  percent: number;
};

export function attemptTitle(attempt: {
  examType: string;
  mode: string;
  systemName: string | null;
  topicName: string | null;
}): string {
  const isPractice = attempt.mode === "PRACTICE";
  switch (attempt.examType) {
    case "GRAND":
      return isPractice ? "Full Q Bank Practice" : "Grand Mock";
    case "TOPIC":
      return isPractice ? `${attempt.topicName} Q Bank` : `${attempt.topicName} Mock`;
    case "CUSTOM":
      return "Custom Q Bank Practice";
    case "RECALL_TOPIC":
      return isPractice ? `${attempt.topicName} Recall (Tutor)` : `${attempt.topicName} Recall (Testing)`;
    case "RECALL_SYSTEM":
      return isPractice ? `${attempt.systemName} Recall (Tutor)` : `${attempt.systemName} Recall (Testing)`;
    case "SYSTEM":
    default:
      return isPractice ? `${attempt.systemName} Q Bank` : `${attempt.systemName} Mock`;
  }
}
