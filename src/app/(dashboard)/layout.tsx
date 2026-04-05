import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { AppFooter } from "@/components/layout/AppFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] transition-colors">
      <AppSidebar />
      <AppTopbar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-24 lg:pt-24 w-full mx-auto">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
