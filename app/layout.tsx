import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { getCurrentUser } from "@/lib/auth";

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

  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        {user ? (
          <div className="flex min-h-screen">
            <AppSidebar user={{ name: user.name, email: user.email, isAdmin: user.isAdmin }} />
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
