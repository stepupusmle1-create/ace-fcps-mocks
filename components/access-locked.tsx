import Link from "next/link";
import { Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { REGISTER_PHONE_DISPLAY } from "@/lib/site";

// Shown instead of the mocks, Q Bank and Recalls until an admin activates the account.
export function AccessLocked({ name, email, compact = false }: { name: string; email: string; compact?: boolean }) {
  const message = `Assalam o Alaikum, I have paid the fee. Kindly activate my ACE FCPS account. Email: ${email}`;
  const waUrl = `https://wa.me/923063336230?text=${encodeURIComponent(message)}`;
  return (
    <div className={compact ? "" : "mx-auto max-w-2xl px-4 py-12 sm:px-6"}>
      <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-premium">
        <div className="flex items-center gap-3 bg-brand-800 px-6 py-5 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Lock size={18} />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Your account is waiting for activation</h1>
            <p className="text-[13px] text-white/75">Mocks, Q Bank and Recalls unlock after your email and payment are confirmed.</p>
          </div>
        </div>
        <div className="space-y-5 px-6 py-6">
          <p className="text-sm text-slate-600">
            Hi {name.split(" ")[0]}, your account <b className="text-slate-900">{email}</b> is registered. Full access is switched on by our team
            once your enrolment is confirmed.
          </p>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100 text-[12px] font-bold text-orange-700">1</span>
              <span>
                Enrol and pay <b>Rs 15,000</b> (3 months) to <b>United Bank Limited</b>, IBAN{" "}
                <span className="whitespace-nowrap rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] font-semibold text-slate-900">PK72 UNIL 0109 0002 7171 8318</span>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100 text-[12px] font-bold text-orange-700">2</span>
              <span>Send the payment screenshot on WhatsApp to <b>{REGISTER_PHONE_DISPLAY}</b> together with the email you signed up with (<b>{email}</b>).</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-orange-100 text-[12px] font-bold text-orange-700">3</span>
              <span>We confirm your email and activate your account. Refresh this page and everything opens.</span>
            </li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
            >
              <MessageCircle size={16} /> Send payment screenshot on WhatsApp
            </a>
            <Link href="/study-plan" className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50">
              <ShieldCheck size={16} /> View the study plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
