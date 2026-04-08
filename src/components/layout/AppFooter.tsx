"use client";

import { useTenant } from "@/components/TenantProvider";

export function AppFooter() {
  const tenant = useTenant();
  // Formato: DD-MM-YYYY HH:mm
  const buildTime = "08-04-2026 03:55 PM";
  const appVersion = "v1.070 - Master Production";

  return (
    <footer className="w-full min-h-10 py-2 border-t border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#151621] mt-auto flex flex-col md:flex-row items-center justify-between px-6 text-[11px] text-slate-500 font-medium gap-2">
      <div>
        © 2026 <span className="font-bold" style={{ color: tenant.color_primario }}>{tenant.nombre}</span>. Todos los derechos reservados.
      </div>
      <div className="flex items-center gap-2">
        <span>{appVersion}</span>
        <div className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#2a2b3d] border border-slate-200 dark:border-[#3b3c54] flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-slate-700 dark:text-slate-300">PROD</span>
        </div>
        <span className="text-slate-400">·</span>
        <span className="dark:text-slate-400 text-slate-600">Compilación: {buildTime}</span>
      </div>
    </footer>
  );
}

