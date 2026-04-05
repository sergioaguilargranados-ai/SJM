"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Receipt, Settings, FileText, Menu, X, User, LogOut } from "lucide-react";
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
        <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar ERPCubox Style */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 w-64 h-screen transition-transform bg-[#1a1b26] border-r border-[#2a2b3d] flex flex-col shadow-2xl lg:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#2a2b3d]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                SJM
             </div>
             <h2 className="font-bold text-white text-sm tracking-wide leading-tight truncate">{currentOrg.nombre}</h2>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setMobileMenuOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name} className="px-3">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-[#e11d48] text-white shadow-md" // El rojo vibrante estilo ERPCubox
                        : "text-slate-400 hover:bg-[#2a2b3d] hover:text-white"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 mr-3 transition-colors", 
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Menu / Logout */}
        <div className="p-4 border-t border-[#2a2b3d]">
           <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-[#e11d48] hover:bg-[#2a2b3d] rounded-lg transition-colors">
              <LogOut className="w-4 h-4 mr-3" />
              Cerrar Sesión
           </button>
        </div>
      </aside>
    </>
  );
}
