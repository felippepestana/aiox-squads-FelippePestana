"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const NAV_PRIMARY: NavItem[] = [
  { href: "/",        icon: "📡", label: "Operador"  },
  { href: "/metrics", icon: "📊", label: "Métricas"  },
  { href: "/events",  icon: "🎬", label: "Eventos"   },
];

const NAV_SETTINGS: NavItem[] = [
  { href: "/settings/obs",          icon: "⚙️",  label: "OBS WebSocket"  },
  { href: "/settings/meet",         icon: "📹", label: "Google Meet"     },
  { href: "/settings/cameras",      icon: "🎥", label: "Câmeras"         },
  { href: "/settings/audio",        icon: "🎙️",  label: "Áudio / Mics"   },
  { href: "/settings/integrations", icon: "🔌", label: "Integrações"     },
];

function NavLink({ href, icon, label }: NavItem) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link href={href} className={`sidebar-link${active ? " active" : ""}`}>
      <span className="sidebar-link-icon">{icon}</span>
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">📡</div>
        <div>
          <div className="sidebar-brand-text">Multicam</div>
          <div className="sidebar-brand-sub">Operator Panel</div>
        </div>
      </div>

      <div className="sidebar-nav">
        {NAV_PRIMARY.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        <div className="sidebar-section-label">Configurações</div>

        {NAV_SETTINGS.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>

      <div className="sidebar-footer">
        <span>Squad transmissao-multicam</span>
      </div>
    </nav>
  );
}
