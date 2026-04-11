"use client";

import { Moon, Sun, Bell, LogOut, Users2, Calendar, Flame, Heart, MessageCircle, ShoppingBag, Music, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTenant } from "@/components/TenantProvider";

const paginasNav = [
  { nombre: "Nosotros", href: "/nosotros", icono: <Users2 className="w-4 h-4" /> },
  { nombre: "Retiros", href: "/retiros-eventos", icono: <Calendar className="w-4 h-4" /> },
  { nombre: "Jóvenes", href: "/jovenes", icono: <Flame className="w-4 h-4" /> },
  { nombre: "Matrimonios", href: "/matrimonios", icono: <Heart className="w-4 h-4" /> },
  { nombre: "Testimonios", href: "/testimonios", icono: <MessageCircle className="w-4 h-4" /> },
  { nombre: "Tienda", href: "/tienda", icono: <ShoppingBag className="w-4 h-4" /> },
  { nombre: "Media", href: "/media", icono: <Music className="w-4 h-4" /> },
  { nombre: "Ayuda", href: "/ayuda", icono: <HelpCircle className="w-4 h-4" /> },
];

export function TopbarClient({ nombre, correo, foto, rol }: { nombre: string; correo: string; foto: string; rol: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const tenant = useTenant();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#1a1b26] border-b border-slate-200 dark:border-[#2a2b3d] z-[60] flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
      
      {/* Logos & Branding */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105" title="Regresar a Inicio Público (Toda la Pantalla)">
           {tenant.logo_url ? (
            <Image src={tenant.logo_url} alt={tenant.nombre} width={36} height={36} className="rounded-md object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-md flex items-center justify-center text-white font-extrabold text-sm shadow-sm" style={{ backgroundColor: tenant.color_primario || "#00B4AA" }}>
              SJM
            </div>
          )}
          <div className="hidden lg:flex flex-col">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wide leading-none truncate max-w-[140px]">{tenant.nombre || "SJM"}</h2>
            <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: tenant.color_primario || "#00B4AA" }}>Intranet</span>
          </div>
        </Link>
      </div>

      {/* Center Horizontal Menu (Cenefa) */}
      <div className="hidden xl:flex items-center justify-center gap-1.5 flex-1 mx-4">
        {paginasNav.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.nombre}
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5",
                isActive 
                  ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {link.icono}
              <span className="hidden xl:inline">{link.nombre}</span>
            </Link>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#1a1b26]"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-[#2a2b3d] mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 dark:text-white leading-none">{nombre}</span>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] text-slate-500 dark:text-[#8e8ea0]">{correo}</span>
               <span className="font-bold text-[8px] px-1.5 py-[1px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider tooltip" title="Rol actual asignado">{rol || "Invitado"}</span>
            </div>
          </div>
          {foto ? (
            <Image 
              src={foto} 
              alt={nombre} 
              width={32} height={32} 
              className="rounded-full border-2 border-slate-200 dark:border-[#3b3c54] object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#2a2b3d] border-2 border-slate-200 dark:border-[#3b3c54] flex items-center justify-center"
            style={{ display: foto ? 'none' : 'flex' }}
          >
            <span className="text-sm font-bold text-blue-600 dark:text-slate-300">{nombre?.charAt(0) || "U"}</span>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1" title="Cerrar Sesión">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
