import { AuthFooter } from "@/components/layout/auth-footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col"><div className="flex-1">{children}</div><AuthFooter /></div>;
}
