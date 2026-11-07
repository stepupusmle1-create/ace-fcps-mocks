import { AccessGate } from "@/components/access-gate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccessGate>{children}</AccessGate>;
}
