import { brand } from "@/lib/design/tokens";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-background px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>
          &copy; {year} {brand.name} — {brand.product}
        </p>
        <nav className="flex items-center gap-4">
          <a href="/termos" className="transition-colors hover:text-foreground">
            Termos
          </a>
          <a href="/privacidade" className="transition-colors hover:text-foreground">
            Privacidade
          </a>
        </nav>
      </div>
    </footer>
  );
}
