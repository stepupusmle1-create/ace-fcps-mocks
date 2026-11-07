import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Users } from "lucide-react";
import { AccessButton, GrantByEmail } from "@/components/admin-access-controls";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage({ searchParams }: { searchParams: { q?: string; filter?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { attempts: true } },
      attempts: {
        where: { status: "SUBMITTED" },
        select: { id: true },
      },
    },
  });

  const q = (searchParams.q ?? "").trim().toLowerCase();
  const filter = searchParams.filter === "active" || searchParams.filter === "all" ? searchParams.filter : "pending";
  const students = users.filter((u) => !u.isAdmin);
  const pendingCount = students.filter((u) => !u.hasAccess).length;
  const activeCount = students.filter((u) => u.hasAccess).length;
  const shown = users.filter((u) => {
    if (q && !`${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q)) return false;
    if (filter === "pending") return !u.isAdmin && !u.hasAccess;
    if (filter === "active") return u.isAdmin || u.hasAccess;
    return true;
  });

  const totalUsers = users.length;
  const totalSubmitted = users.reduce((sum, u) => sum + u.attempts.length, 0);
  const last7Days = users.filter(
    (u) => Date.now() - new Date(u.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
          <ShieldCheck size={18} />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin</h1>
      </div>
      <p className="mt-1 text-sm text-slate-500">Everyone who has signed up, and how they're using the app.</p>

      <div className="mt-6">
        <GrantByEmail />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-orange-700">Waiting for activation</p>
          <p className="mt-1 text-3xl font-bold text-orange-800">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-700">Full access active</p>
          <p className="mt-1 text-3xl font-bold text-brand-800">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Total students</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">New this week</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{last7Days}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Attempts completed</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{totalSubmitted}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">Students</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["pending", `Waiting (${pendingCount})`],
              ["active", `Active (${activeCount + users.filter((u) => u.isAdmin).length})`],
              ["all", `All (${totalUsers})`],
            ] as const
          ).map(([key, label]) => (
            <Link
              key={key}
              href={`/admin?filter=${key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={
                filter === key
                  ? "rounded-full bg-brand-700 px-3.5 py-1.5 text-[12px] font-semibold text-white"
                  : "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
              }
            >
              {label}
            </Link>
          ))}
          <form action="/admin" className="flex items-center gap-2">
            <input type="hidden" name="filter" value={filter} />
            <input
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Search name, email or phone"
              className="w-56 rounded-full border border-slate-300 px-3.5 py-1.5 text-[13px] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </form>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-premium">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3 text-right">Attempts</th>
              <th className="px-5 py-3">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-900">
                  {u.name} {u.isAdmin && <span className="ml-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">Admin</span>}
                </td>
                <td className="px-5 py-3 text-slate-600">{u.email}</td>
                <td className="px-5 py-3 text-slate-600">{u.phone || <span className="text-slate-300">&mdash;</span>}</td>
                <td className="px-5 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right text-slate-600">{u.attempts.length}</td>
                <td className="px-5 py-3">
                  {u.isAdmin ? (
                    <span className="text-[12px] font-semibold text-slate-400">Always</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          u.hasAccess
                            ? "rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700"
                            : "rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700"
                        }
                      >
                        {u.hasAccess ? "Active" : "Waiting"}
                      </span>
                      <AccessButton userId={u.id} hasAccess={u.hasAccess} name={u.name} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  {q ? "No students match this search." : filter === "pending" ? "Nobody is waiting for activation." : "No students to show."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
