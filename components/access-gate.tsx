import { getCurrentUser } from "@/lib/auth";
import { hasFullAccess } from "@/lib/access";
import { AccessLocked } from "@/components/access-locked";

// Used by the layouts of the mocks, Q Bank and Recalls routes. Signed-out visitors fall through
// so each page can keep redirecting them to /login.
export async function AccessGate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user && !hasFullAccess(user)) {
    return <AccessLocked name={user.name} email={user.email} />;
  }
  return <>{children}</>;
}
