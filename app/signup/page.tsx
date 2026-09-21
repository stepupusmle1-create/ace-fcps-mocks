import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { JoinGroupBanner } from "@/components/join-group-banner";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/dashboard");

  return (
    <div className="bg-mesh">
      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track system-wise mocks and grand mocks with a full attempt history.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
          <AuthForm mode="signup" />
        </div>
        <div className="mt-4">
          <JoinGroupBanner variant="compact" />
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
