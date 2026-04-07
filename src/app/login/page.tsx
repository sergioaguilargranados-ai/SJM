"use client";

import Image from "next/image";
import { loginWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] flex items-center justify-center p-6 selection:bg-blue-100 dark:selection:bg-blue-900/40">
      
      {/* Container Principal con Efecto Glass */}
      <div className="max-w-md w-full bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative group">
        
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-[#e11d48] dark:to-rose-400" />

        <div className="p-8 md:p-12 flex flex-col items-center text-center space-y-10">
          
          {/* Logo y Branding */}
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-[#0f1015] p-6 rounded-3xl inline-block shadow-inner">
               <Image
                 src="/icon.png"
                 alt="SJM Logo"
                 width={100}
                 height={100}
                 className="drop-shadow-lg"
               />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Acceso SJM Nacional</h1>
               <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1 font-medium">Panel de administración de la obra</p>
            </div>
          </div>

          {/* Información de Seguridad */}
          <div className="w-full bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 p-5 rounded-2xl flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
             <div className="text-left">
                <p className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-tighter">Seguridad Habilitada</p>
                <p className="text-[11px] text-blue-700/70 dark:text-blue-300/60 leading-tight mt-1">Este sistema es de uso privado. Solo correos autorizados por SJM Nacional pueden iniciar sesión.</p>
             </div>
          </div>

          {/* Acciones de Login */}
          <div className="w-full space-y-4">
             <form action={loginWithGoogle}>
               <button 
                 type="submit"
                 className="w-full h-14 bg-white dark:bg-[#0f1015] border-2 border-slate-200 dark:border-[#2a2b3d] hover:border-blue-500 dark:hover:border-[#e11d48] rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm active:scale-[0.98]"
               >
                 <Image 
                   src="https://www.google.com/favicon.ico" 
                   alt="Google" 
                   width={20} 
                   height={20} 
                 />
                 <span className="text-slate-800 dark:text-slate-100 font-extrabold text-sm tracking-wide">CONTINUAR CON GOOGLE</span>
                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
               </button>
             </form>
          </div>

          {/* Footer del Formulario */}
          <div className="pt-4 flex flex-col items-center gap-2">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Lock className="w-3 h-3" />
                Cifrado Fin a Fin
             </div>
             <p className="text-[10px] text-slate-400">© 2026 Admin SJM Nacional v1.060</p>
          </div>

        </div>
      </div>

    </div>
  );
}
