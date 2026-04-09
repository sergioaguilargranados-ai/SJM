"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarDays, Receipt, Settings, FileText, Menu, X,
  LogOut, ChevronDown, ChevronRight, Music, Award, Tag, Home, MapPin, Wallet,
  ClipboardList, Star, Landmark, BookOpen, UsersRound, ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTenant } from "@/components/TenantProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, planes: ["landing", "admin", "premium"], clave: "dashboard" },
  { name: "Servidores", href: "/servidores", icon: Users, planes: ["admin", "premium"], clave: "servidores" },
  { name: "Retiros y Eventos", href: "/eventos", icon: CalendarDays, planes: ["admin", "premium"], clave: "eventos" },
  { name: "Inscripciones", href: "/inscripciones", icon: ClipboardList, planes: ["admin", "premium"], clave: "inscripciones" },
  { name: "Equipo por Evento", href: "/equipo", icon: UsersRound, planes: ["admin", "premium"], clave: "equipo" },
  { name: "Finanzas", href: "/finanzas", icon: Receipt, planes: ["premium"], clave: "finanzas" },
  { name: "Documentos", href: "/documentos", icon: FileText, planes: ["premium"], clave: "documentos" },
  { name: "Evaluaciones", href: "/evaluaciones", icon: Star, planes: ["premium"], clave: "evaluaciones" },
];

const catalogos = [
  { name: "Sedes", href: "/catalogos/sedes", icon: Landmark, planes: ["admin", "premium"], clave: "sedes" },
  { name: "Ministerios", href: "/catalogos/ministerios", icon: Music, planes: ["admin", "premium"], clave: "ministerios" },
  { name: "Cargos", href: "/catalogos/cargos", icon: Award, planes: ["admin", "premium"], clave: "cargos" },
  { name: "Tipos de Eventos", href: "/catalogos/tipos-eventos", icon: Tag, planes: ["admin", "premium"], clave: "tipos-eventos" },
  { name: "Casas de Retiro", href: "/catalogos/casas-retiro", icon: Home, planes: ["admin", "premium"], clave: "casas-retiro" },
  { name: "Clasif. Gasto", href: "/catalogos/clasificaciones-gasto", icon: Wallet, planes: ["premium"], clave: "clasificaciones-gasto" },
  { name: "Estados", href: "/catalogos/estados", icon: MapPin, planes: ["admin", "premium"], clave: "estados" },
];

interface AppSidebarProps {
  permisos: string[];
}

export function AppSidebar({ permisos = [] }: AppSidebarProps) {
  const pathname = usePathname();
  const tenant = useTenant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogosOpen, setCatalogosOpen] = useState(pathname.startsWith("/catalogos"));

  const planClave = tenant.plan?.clave || "landing";

  // Función para validar si tiene permiso (view)
  const tienePermiso = (clave: string) => {
    if (permisos.includes("*")) return true;
    return permisos.includes(`${clave}.view`) || permisos.includes(clave);
  };

  const navFiltrada = navigation.filter(item => 
    (item as any).planes.includes(planClave) && tienePermiso(item.clave)
  );
  
  const catFiltrados = catalogos.filter(item => 
    (item as any).planes.includes(planClave) && tienePermiso(item.clave)
  );


  return (
    <>
      {/* Botón Móvil */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {tenant.logo_url ? (
            <Image src={tenant.logo_url} alt={tenant.nombre} width={32} height={32} className="rounded-sm" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: tenant.color_primario }}>SJM</div>
          )}
          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{tenant.nombre}</span>
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
        {/* Brand Header — Marca dinámica del tenant */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-[#2a2b3d]">
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <Image src={tenant.logo_url} alt={tenant.nombre} width={32} height={32} className="rounded-sm" />
            ) : (
              <div className="w-8 h-8 rounded-sm flex items-center justify-center text-white font-extrabold text-xs shadow-sm" style={{ backgroundColor: tenant.color_primario }}>
                SJM
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide leading-tight truncate max-w-[140px]">{tenant.nombre}</h2>
              <span className="text-[9px] font-black text-[#00B4AA] uppercase tracking-tighter">Plan {tenant.plan?.nombre || "Básico"}</span>
            </div>
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
            {navFiltrada.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.name} className="px-3">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                      isActive
                        ? "text-white shadow-md font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white"
                    )}
                    style={isActive ? { backgroundColor: tenant.color_primario } : undefined}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 mr-3 transition-colors",
                      isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                    )} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sección Catálogos */}
          {catFiltrados.length > 0 && (
            <>
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
                    {catFiltrados.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                              isActive
                                ? "font-bold"
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
            </>
          )}


          {/* Configuración */}
          <div className="px-4 mt-5 mb-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#5e5e72] uppercase tracking-widest px-3">Sistema</p>
          </div>
          <ul className="space-y-0.5">
            <li className="px-3">
              <Link
                href="/configuracion"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                  pathname === "/configuracion"
                    ? "text-white shadow-md font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white"
                )}
                style={pathname === "/configuracion" ? { backgroundColor: tenant.color_primario } : undefined}
              >
                <Settings className={cn(
                  "w-4 h-4 mr-3 transition-colors",
                  pathname === "/configuracion" ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                )} />
                Configuración
              </Link>
            </li>
            {planClave === "premium" && (
              <li className="px-3">
                <Link
                  href="/configuracion/permisos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                    pathname === "/configuracion/permisos"
                      ? "text-white shadow-md font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d] hover:text-slate-900 dark:hover:text-white"
                  )}
                  style={pathname === "/configuracion/permisos" ? { backgroundColor: tenant.color_primario } : undefined}
                >
                  <ShieldCheck className={cn(
                    "w-4 h-4 mr-3 transition-colors",
                    pathname === "/configuracion/permisos" ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  )} />
                  Roles y Permisos
                </Link>
              </li>
            )}
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
