"use client";

export function AppFooter() {
  const buildTime = "06-04-2026 02:30 AM";
  const appVersion = "v1.055 - Master Production";

  return (
    <footer className="w-full h-10 border-t border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#151621] mt-auto flex items-center justify-between px-6 text-[11px] text-slate-500 font-medium">
      <div>
        © 2026 <span className="font-bold text-blue-600 dark:text-[#e11d48]">SJM Platform</span>. Todos los derechos reservados.
      </div>
      <div className="flex items-center gap-2">
        <span>{appVersion}</span>
        <div className="px-1.5 py-0.5 roundedbg-slate-100 dark:bg-[#2a2b3d] border border-slate-200 dark:border-[#3b3c54] flex items-center gap-1.5">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-slate-700 dark:text-slate-300">PROD</span>
        </div>
        <span className="text-slate-400">·</span>
        <span className="dark:text-slate-400 text-slate-600">Compilación: {buildTime}</span>
      </div>
    </footer>
  );
}
