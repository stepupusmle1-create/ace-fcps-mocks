import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteHeader({ user }: { user: null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-900">
          <Image src="/logo.svg" alt="ACE FCPS by Dr Bilal" width={38} height={38} className="flex-none rounded-full ring-2 ring-gold-200" />
          <span className="leading-tight">
            <span className="block tracking-tight">ACE FCPS</span>
            <span className="block text-[11px] font-medium text-slate-400">by Dr Bilal</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/exams"
            className="hidden rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:block"
          >
            Mocks
          </Link>
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:flex"
          >
            <ShieldCheck size={14} /> Admin login
          </Link>
          <Link href="/login" className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            Sign up free
          </Link>
        </nav>
      </div>
    </header>
  );
}
