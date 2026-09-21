import { ArrowUpRight, GraduationCap, MessageCircle, Sparkles } from "lucide-react";
import { WHATSAPP_GROUP_URL } from "@/lib/site";

export function JoinGroupBanner({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <MessageCircle size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-emerald-900">
            Join our free WhatsApp group
          </span>
          <span className="block truncate text-[12px] text-emerald-700">
            Free mocks, updates &amp; FCPS demo classes
          </span>
        </span>
        <ArrowUpRight size={16} className="flex-none text-emerald-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6 text-white shadow-premium sm:p-8">
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold backdrop-blur">
            <Sparkles size={13} /> Free, forever
          </span>
          <h3 className="mt-3 text-xl font-bold sm:text-2xl">Join our WhatsApp community</h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/85">
            Get free further mocks, new question drops, and invites to Dr Bilal&apos;s live FCPS
            demo classes &mdash; straight to your phone.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] font-medium text-white/80">
            <span className="flex items-center gap-1.5">
              <GraduationCap size={14} /> Live demo classes
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={14} /> New mocks every week
            </span>
          </div>
        </div>
        <a
          href={WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-none items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
        >
          <MessageCircle size={17} /> Join free group
        </a>
      </div>
    </div>
  );
}
