import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Admin-only: confirm a student's email and switch full access on or off.
// Body: { userId?: string; email?: string; grant: boolean }
export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const grant = body?.grant === true;
  const userId = typeof body?.userId === "string" ? body.userId : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!userId && !email) {
    return NextResponse.json({ error: "Enter the student's email." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: userId ? { id: userId } : { email } });
  if (!target) {
    return NextResponse.json({ error: `No student found with email ${email}. Ask them to sign up with that exact email first.` }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: target.id },
    data: { hasAccess: grant, accessGrantedAt: grant ? new Date() : null },
    select: { id: true, name: true, email: true, hasAccess: true },
  });
  return NextResponse.json({ ok: true, user: updated });
}
