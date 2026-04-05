import { AppSidebar } from "@/components/layout/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppSidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
