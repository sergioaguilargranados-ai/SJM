"use client";

import { Moon, Sun, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export function TopbarClient({ nombre, correo, foto, rol }: { nombre: string; correo: string; foto: string; rol: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    // Server action de signOut
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white dark:bg-[#1a1b26] border-b border-slate-200 dark:border-[#2a2b3d] z-30 flex items-center justify-between px-6 transition-all duration-300">
      
      {/* Mobile branding */}
      <div className="flex items-center gap-4 text-slate-900 dark:text-white lg:hidden">
         <div className="font-extrabold text-xl tracking-tight">SJM</div>
      </div>

      <div className="hidden lg:flex items-center gap-4">
         <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#2a2b3d] text-sm text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-md border border-slate-200 dark:border-[#3b3c54]">
            <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">ROL:</span> 
            <span className="font-bold text-xs">{rol || "SIN ROL"}</span>
         </div>
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
            <span className="text-[10px] text-slate-500 dark:text-[#8e8ea0] mt-0.5">{correo}</span>
          </div>
          {foto ? (
            <Image src={foto} alt={nombre} width={32} height={32} className="rounded-full border border-slate-200 dark:border-[#3b3c54]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#2a2b3d] border border-slate-200 dark:border-[#3b3c54] flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600 dark:text-slate-300">{nombre?.charAt(0) || "U"}</span>
            </div>
          )}
          <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Cerrar Sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
