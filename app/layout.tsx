import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser } from "@/lib/auth";
import { getQuestionTotals } from "@/lib/cached";

const plusJakarta = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACE FCPS by Dr Bilal",
  description: "System-wise mocks and full-length grand mocks for FCPS Part 1 preparation.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const recallCount = user ? (await getQuestionTotals()).recall : 0;

  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen bg-mint-grey font-sans antialiased text-ink">
        {user ? (
          <div className="flex min-h-screen flex-col md:flex-row">
            <AppSidebar
              user={{ name: user.name, email: user.email, isAdmin: user.isAdmin }}
              hasRecalls={recallCount > 0}
            />
            <div className="min-w-0 flex-1">
              <main>{children}</main>
            </div>
          </div>
        ) : (
          <>
            <SiteHeader user={null} />
            <main>{children}</main>
          </>
        )}
      </body>
    </html>
  );
}
