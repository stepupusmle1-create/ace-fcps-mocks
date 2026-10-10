"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap, LayoutDashboard, Menu, PlusCircle, ShieldCheck, TrendingUp, Trophy, X, History as HistoryIcon } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

// Q Bank is hidden from navigation for now — the app is mocks-only.
// The route still works if visited directly.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/dashboard" },
  {
    href: "/mocks",
    label: "Create Mock",
    icon: PlusCircle,
    match: (p: string) => p === "/mocks" || p.startsWith("/systems") || (p.startsWith("/exam") && p !== "/exam/grand"),
  },
  { href: "/exam/grand", label: "Grand Mock", icon: Trophy, match: (p: string) => p === "/exam/grand" },
  { href: "/progress", label: "Progress", icon: TrendingUp, match: (p: string) => p.startsWith("/progress") },
  { href: "/history", label: "History", icon: HistoryIcon, match: (p: string) => p.startsWith("/history") || p.startsWith("/attempt") },
];

const RECALLS_NAV_ITEM = {
  href: "/recalls",
  label: "Recalls",
  icon: GraduationCap,
  match: (p: string) => p.startsWith("/recalls"),
};

const ADMIN_NAV_ITEM = { href: "/admin", label: "Admin", icon: ShieldCheck, match: (p: string) => p.startsWith("/admin") };

export function AppSidebar({
  user,
  hasRecalls = false,
}: {
  user: { name: string; email: string; isAdmin: boolean };
  hasRecalls?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  let navItems = hasRecalls
    ? [...NAV_ITEMS.slice(0, 3), RECALLS_NAV_ITEM, ...NAV_ITEMS.slice(3)]
    : NAV_ITEMS;
  if (user.isAdmin) navItems = [ADMIN_NAV_ITEM, ...navItems];
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";
  const homeHref = user.isAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-brand-100 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href={homeHref} className="flex items-center gap-2 font-extrabold text-brand-800">
          <Image src="/logo.svg" alt="ACE FCPS by Dr Bilal" width={30} height={30} className="flex-none rounded-full ring-2 ring-gold-200" />
          <span className="text-[15px] tracking-tight">ACE FCPS</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu size={20} />
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-none flex-col bg-brand-800 text-white transition-transform duration-200 md:sticky md:top-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href={homeHref} className="flex items-center gap-2.5 font-semibold text-white">
            <Image
              src="/logo.svg"
              alt="ACE FCPS by Dr Bilal"
              width={38}
              height={38}
              className="flex-none rounded-full ring-2 ring-gold-200"
            />
            <span className="leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight">ACE FCPS</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300">by Dr Bilal</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-brand-200 hover:bg-white/10 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white text-brand-800 shadow-sm"
                    : "text-brand-100 hover:bg-white/10"
                }`}
              >
                <Icon size={17} className={active ? "text-gold-500" : "text-brand-300 group-hover:text-white"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <p className="truncate text-[12px] text-brand-300">{user.email}</p>
            </div>
          </div>
          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
