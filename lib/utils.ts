import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function readinessLabel(percent: number) {
  if (percent >= 75) return "Exam Ready";
  if (percent >= 60) return "On Track";
  if (percent >= 45) return "Building Momentum";
  return "Needs Foundational Work";
}
