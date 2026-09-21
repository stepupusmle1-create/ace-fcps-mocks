import { MessageCircle, Zap } from "lucide-react";
import { REGISTER_PHONE_DISPLAY, REGISTER_WHATSAPP_URL } from "@/lib/site";

export function RegisterSlotBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-white shadow-premium sm:p-7">
      <div
        className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-white/15 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold uppercase tracking-wide">
            <Zap size={13} /> Limited seats
          </span>
          <h3 className="mt-3 text-xl font-bold">Register your slot now</h3>
          <p className="mt-1 text-sm text-white/90">Message us on WhatsApp &mdash; {REGISTER_PHONE_DISPLAY}</p>
        </div>
        <a
          href={REGISTER_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-orange-700 shadow-sm transition hover:bg-orange-50"
        >
          <MessageCircle size={17} /> Message to register
        </a>
      </div>
    </div>
  );
}
