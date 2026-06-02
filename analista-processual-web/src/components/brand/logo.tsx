import { cn } from "@/lib/utils";

interface LogoProps {
  /** Render only the monogram (no wordmark). */
  iconOnly?: boolean;
  /** Hide the tagline below the wordmark. */
  showTagline?: boolean;
  className?: string;
}

/**
 * Felippe Pestana — Legal Performance brand mark.
 * Inline SVG monogram (FP) so the identity ships without external assets.
 */
export function Logo({ iconOnly = false, showTagline = false, className }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark className="h-9 w-9 flex-shrink-0" />
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-base font-bold tracking-wide text-foreground">
            FELIPPE <span className="text-brand-gold">∞</span> PESTANA
          </span>
          {showTagline && (
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Legal Performance
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Felippe Pestana — Legal Performance"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="10"
        fill="hsl(var(--brand-navy-deep))"
        stroke="hsl(var(--brand-gold))"
        strokeWidth="1.5"
      />
      <path
        d="M12 12h13v4.5h-8.5v5H24v4.5h-7.5V36H12z"
        fill="hsl(var(--brand-silver))"
      />
      <path
        d="M26.5 12h7.5c4.4 0 7.5 2.9 7.5 7.2s-3.1 7.3-7.5 7.3h-3v9.5h-4.5zm4.5 4.3v6h2.6c1.9 0 3.1-1.2 3.1-3s-1.2-3-3.1-3z"
        fill="hsl(var(--brand-navy))"
        stroke="hsl(var(--brand-silver))"
        strokeWidth="0.75"
      />
    </svg>
  );
}
