"use client";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className }: ProgressProps) {
  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary/20 ${className}`}
    >
      <div
        className="h-full bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
