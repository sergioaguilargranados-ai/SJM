"use client";

import { Moon, Sun, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AppTopbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white dark:bg-[#1a1b26] border-b border-slate-200 dark:border-[#2a2b3d] z-30 flex items-center justify-between px-6 transition-all duration-300">
      
      {/* Logos and Branch Info (Mobile only) */}
      <div className="flex items-center gap-4 text-slate-900 dark:text-white lg:hidden">
         <div className="font-extrabold text-xl tracking-tight">SJM</div>
      </div>

      <div className="hidden lg:flex items-center gap-4">
         <button className="flex items-center gap-2 bg-slate-50 dark:bg-[#2a2b3d] hover:bg-slate-100 dark:hover:bg-[#323348] text-sm text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-md border border-slate-200 dark:border-[#3b3c54] transition-colors">
            <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">SEDE:</span> 
            Sede Nacional
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 ml-2" />
         </button>
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
        
        <button className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
          <span className="text-sm font-medium hidden md:block">Sergio Aguilar</span>
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2a2b3d] border border-slate-200 dark:border-[#3b3c54] flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <LogOut className="w-4 h-4 text-slate-500 ml-1" />
        </button>
      </div>
    </header>
  );
}
