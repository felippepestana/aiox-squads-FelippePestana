'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface DocumentBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function DocumentBreadcrumb({ items }: DocumentBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="h-auto p-0 font-normal text-primary hover:underline"
            >
              {item.label}
            </Button>
          ) : (
            <span className={item.active ? 'font-semibold' : 'text-muted-foreground'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
