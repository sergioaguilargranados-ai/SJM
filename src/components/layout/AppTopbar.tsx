"use client";

import { Moon, Sun, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";

export function AppTopbar() {
  const [theme, setTheme] = useState("dark"); // placeholder for theme logic

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#1a1b26] border-b border-[#2a2b3d] z-30 flex items-center justify-between px-6 transition-all duration-300">
      
      {/* Logos and Branch Info (Mobile only logo if sidebar hidden, but let's emulate ERPCubox) */}
      <div className="flex items-center gap-4 text-white lg:hidden">
         <div className="font-extrabold text-xl tracking-tight">SJM</div>
      </div>

      <div className="hidden lg:flex items-center gap-4">
         {/* Branch Selector Pill imitating ERPCubox */}
         <button className="flex items-center gap-2 bg-[#2a2b3d] hover:bg-[#323348] text-sm text-slate-200 px-4 py-1.5 rounded-md border border-[#3b3c54] transition-colors">
            <span className="font-semibold text-xs text-slate-400">SEDE:</span> 
            Sede Nacional
            <ChevronDown className="w-4 h-4 text-slate-400 ml-2" />
         </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Sun className="w-5 h-5" />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#1a1b26]"></span>
        </button>
        
        <div className="h-6 w-px bg-[#2a2b3d] mx-2"></div>
        
        <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
          <span className="text-sm font-medium hidden md:block">Sergio Aguilar</span>
          <div className="w-8 h-8 rounded-full bg-[#2a2b3d] border border-[#3b3c54] flex items-center justify-center">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <LogOut className="w-4 h-4 text-slate-500 ml-1" />
        </button>
      </div>

    </header>
  );
}
