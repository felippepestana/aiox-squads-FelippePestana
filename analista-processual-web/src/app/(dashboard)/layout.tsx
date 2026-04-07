import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <DashboardLayout
        title="Dashboard"
        description="Visão geral das suas análises processuais"
      >
        {children}
      </DashboardLayout>
    </TooltipProvider>
  );
}
