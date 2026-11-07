// Mocks, Q Bank and Recalls are available only to admins and to students an admin has activated
// (after confirming their email and payment).
export function hasFullAccess(user: { isAdmin: boolean; hasAccess: boolean }) {
  return user.isAdmin || user.hasAccess;
}
