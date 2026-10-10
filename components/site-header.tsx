import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteHeader({ user }: { user: null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/92 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-brand-800">
          <Image src="/logo.svg" alt="ACE FCPS by Dr Bilal" width={38} height={38} className="flex-none rounded-full ring-2 ring-gold-200" />
          <span className="leading-tight">
            <span className="block font-extrabold tracking-tight">ACE FCPS</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">by Dr Bilal</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/exams"
            className="hidden rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-800 sm:block"
          >
            Mocks
          </Link>
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-400 transition hover:bg-brand-50 hover:text-brand-800 sm:flex"
          >
            <ShieldCheck size={14} /> Admin login
          </Link>
          <Link href="/login" className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-800">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-b from-gold-500 to-gold-600 px-4 py-1.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(201,122,43,0.7)] transition hover:-translate-y-0.5"
          >
            Sign up free
          </Link>
        </nav>
      </div>
    </header>
  );
}
