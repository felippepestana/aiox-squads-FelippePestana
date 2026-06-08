import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { authRequired, getDisplayUser } from "@/lib/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDisplayUser();

  return (
    <TooltipProvider>
      <DashboardLayout
        title="Dashboard"
        description="Visão geral das suas análises processuais"
        user={{ name: user.name, email: user.email }}
        authEnabled={authRequired()}
      >
        {children}
      </DashboardLayout>
    </TooltipProvider>
  );
}
