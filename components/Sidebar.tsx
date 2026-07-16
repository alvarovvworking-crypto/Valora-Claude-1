"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Calculator,
  History,
  Settings,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/calculadora", label: "Calculadora", icon: Calculator },
  { href: "/dashboard/historial", label: "Historial de ventas", icon: History },
  { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-line bg-surface/90 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-mag flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-display tracking-wide">VALORA</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-ink-300">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 shrink-0 border-r border-line bg-surface/60 backdrop-blur px-4 py-6 md:min-h-screen md:sticky md:top-0`}
      >
        <div className="hidden md:flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-mag flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-xl tracking-wide">VALORA</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-violet-600/15 text-violet-200 border border-violet-500/30 shadow-glow-sm"
                    : "text-ink-300 hover:bg-white/5 hover:text-ink-100 border border-transparent"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-line">
          <p className="text-xs text-ink-500 px-3 mb-3 truncate">{email}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-300 hover:bg-white/5 hover:text-mag transition-colors"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
