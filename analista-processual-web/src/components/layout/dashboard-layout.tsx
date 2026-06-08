import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  user?: { name: string | null; email: string };
  authEnabled?: boolean;
}

export function DashboardLayout({
  children,
  title,
  description,
  user,
  authEnabled,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={title}
          description={description}
          user={user}
          authEnabled={authEnabled}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
