import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const plusJakarta = Plus_Jakarta_Sans({
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
  const recallCount = user ? await prisma.question.count({ where: { isRecall: true } }) : 0;

  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
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
