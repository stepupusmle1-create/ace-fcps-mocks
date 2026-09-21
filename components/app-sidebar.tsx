"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, ShieldCheck, TrendingUp, Trophy, History as HistoryIcon } from "lucide-react";
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

const ADMIN_NAV_ITEM = { href: "/admin", label: "Admin", icon: ShieldCheck, match: (p: string) => p.startsWith("/admin") };

export function AppSidebar({ user }: { user: { name: string; email: string; isAdmin: boolean } }) {
  const pathname = usePathname();
  const navItems = user.isAdmin ? [ADMIN_NAV_ITEM, ...NAV_ITEMS] : NAV_ITEMS;
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";
  const homeHref = user.isAdmin ? "/admin" : "/dashboard";

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-none flex-col border-r border-slate-200/80 bg-white">
      <Link href={homeHref} className="flex items-center gap-2.5 px-5 py-5 font-semibold text-slate-900">
        <Image
          src="/logo.svg"
          alt="ACE FCPS by Dr Bilal"
          width={38}
          height={38}
          className="flex-none rounded-full ring-2 ring-gold-200"
        />
        <span className="leading-tight">
          <span className="block text-[15px] tracking-tight">ACE FCPS</span>
          <span className="block text-[11px] font-medium text-slate-400">by Dr Bilal</span>
        </span>
      </Link>

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
                  ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={17} className={active ? "text-white" : "text-slate-400 group-hover:text-slate-600"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-900 text-sm font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="truncate text-[12px] text-slate-400">{user.email}</p>
          </div>
        </div>
        <div className="mt-3">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
