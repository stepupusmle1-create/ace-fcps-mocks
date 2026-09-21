import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { JoinGroupBanner } from "@/components/join-group-banner";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/dashboard");

  return (
    <div className="bg-mesh">
      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to continue your FCPS mock exam prep.</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
          <AuthForm mode="login" />
        </div>
        <div className="mt-4">
          <JoinGroupBanner variant="compact" />
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
