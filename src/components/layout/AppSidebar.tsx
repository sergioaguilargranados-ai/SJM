"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Receipt, Settings, FileText, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock de la "organización actual". En prod se toma del Server Action / Context
const currentOrg = {
  nombre: "SJM Nacional",
  lema: "Sirviendo con amor a la comunidad",
  logo_url: "", // Añadir el de SJM
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Servidores", href: "/servidores", icon: Users },
  { name: "Retiros y Eventos", href: "/eventos", icon: CalendarDays },
  { name: "Finanzas", href: "/finanzas", icon: Receipt },
  { name: "Documentos", href: "/documentos", icon: FileText },
  { name: "Configuración", href: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Botón Móvil */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">SJM</div>
          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{currentOrg.nombre}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay Movil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 w-72 h-screen transition-transform bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 hidden lg:block">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                SJM
             </div>
             <div>
                <h2 className="font-bold text-slate-900 dark:text-white leading-tight">{currentOrg.nombre}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{currentOrg.lema}</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Sergio Aguilar</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Súper Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
