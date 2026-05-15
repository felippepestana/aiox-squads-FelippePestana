import { Bell, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export async function Header({ title, subtitle }: HeaderProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <header className="page-header flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-brand-dark">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-semibold">
          {initials}
        </div>
      </div>
    </header>
  );
}
