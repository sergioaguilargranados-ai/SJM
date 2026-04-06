"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarDays, Receipt, Settings, FileText, Menu, X,
  LogOut, ChevronDown, ChevronRight, Music, Award, Tag, Home, MapPin, Wallet,
  ClipboardList, Star, Landmark, BookOpen, UsersRound
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const currentOrg = {
  nombre: "SJM Nacional",
  lema: "Sirviendo con amor a la comunidad",
  logo_url: "",
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Servidores", href: "/servidores", icon: Users },
  { name: "Retiros y Eventos", href: "/eventos", icon: CalendarDays },
  { name: "Inscripciones", href: "/inscripciones", icon: ClipboardList },
  { name: "Equipo por Evento", href: "/equipo", icon: UsersRound },
  { name: "Finanzas", href: "/finanzas", icon: Receipt },
  { name: "Documentos", href: "/documentos", icon: FileText },
  { name: "Evaluaciones", href: "/evaluaciones", icon: Star },
];

const catalogos = [
  { name: "Sedes", href: "/catalogos/sedes", icon: Landmark },
  { name: "Ministerios", href: "/catalogos/ministerios", icon: Music },
  { name: "Cargos", href: "/catalogos/cargos", icon: Award },
  { name: "Tipos de Eventos", href: "/catalogos/tipos-eventos", icon: Tag },
  { name: "Casas de Retiro", href: "/catalogos/casas-retiro", icon: Home },
  { name: "Clasif. Gasto", href: "/catalogos/clasificaciones-gasto", icon: Wallet },
  { name: "Estados", href: "/catalogos/estados", icon: MapPin },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogosOpen, setCatalogosOpen] = useState(pathname.startsWith("/catalogos"));

  return (
    <>
      {/* Botón Móvil */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
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
        "fixed top-0 left-0 z-50 w-64 h-screen transition-transform bg-white dark:bg-[#1a1b26] border-r border-slate-200 dark:border-[#2a2b3d] flex flex-col shadow-2xl lg:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-[#2a2b3d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
              SJM
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide leading-tight truncate">{currentOrg.nombre}</h2>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="ml-auto lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Sección Principal */}
          <div className="px-4 mb-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest px-3">Operación</p>
          </div>
          <ul className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.name} className="px-3">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-blue-600 dark:bg-[#e11d48] text-white shadow-md font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 mr-3 transition-colors",
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-slate-300"
                    )} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sección Catálogos */}
          <div className="px-4 mt-5 mb-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest px-3">Catálogos</p>
          </div>
          <div className="px-3">
            <button
              onClick={() => setCatalogosOpen(!catalogosOpen)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                catalogosOpen
                  ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-[#2a2b3d]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-3 text-slate-400 dark:text-slate-500" />
                Catálogos
              </div>
              {catalogosOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {catalogosOpen && (
              <ul className="mt-1 space-y-0.5 pl-2 border-l-2 border-slate-200 dark:border-[#2a2b3d] ml-5">
                {catalogos.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                          isActive
                            ? "text-blue-600 dark:text-[#e11d48] bg-blue-50 dark:bg-[#e11d48]/10 font-bold"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#2a2b3d]"
                        )}
                      >
                        <item.icon className="w-3.5 h-3.5 mr-2" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Configuración */}
          <div className="px-4 mt-5 mb-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest px-3">Sistema</p>
          </div>
          <ul>
            <li className="px-3">
              <Link
                href="/configuracion"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                  pathname.startsWith("/configuracion")
                    ? "bg-blue-600 dark:bg-[#e11d48] text-white shadow-md font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Settings className={cn(
                  "w-4 h-4 mr-3 transition-colors",
                  pathname.startsWith("/configuracion") ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-slate-300"
                )} />
                Configuración
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom Menu / Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-[#2a2b3d]">
          <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-[#e11d48] hover:bg-red-50 dark:hover:bg-[#2a2b3d] rounded-lg transition-colors">
            <LogOut className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
