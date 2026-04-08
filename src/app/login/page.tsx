"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { ShieldCheck, ArrowRight, Lock, Mail, Phone } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] flex items-center justify-center p-6 selection:bg-blue-100 dark:selection:bg-blue-900/40 font-sans">
      
      {/* Container Principal con Efecto Glass */}
      <div className="max-w-md w-full bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative group">
        
        {/* Decoración Superior SJM Turquesa */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />

        <div className="p-8 md:p-12 flex flex-col items-center text-center space-y-8">
          
          {/* Logo y Branding */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0f1015] p-5 rounded-3xl inline-block shadow-sm border border-slate-100 dark:border-slate-800">
               <Image
                 src="/logo-sjm-oficial.png"
                 alt="SJM Logo"
                 width={90}
                 height={90}
                 className="drop-shadow-sm"
               />
            </div>
            <div>
               <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Acceso SJM Nacional</h1>
               <p className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-1 font-medium italic">"Para mayor gloria de Dios"</p>
            </div>
          </div>

          {/* Información de Seguridad Premium */}
          <div className="w-full bg-[#00B4AA]/5 dark:bg-[#00B4AA]/10 border border-[#00B4AA]/20 p-4 rounded-2xl flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-[#00B4AA] shrink-0 mt-0.5" />
             <div className="text-left">
                <p className="text-[10px] font-bold text-[#00B4AA] uppercase tracking-widest">Seguridad Habilitada</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">Sistema privado. Solo personal autorizado por SJM Nacional puede acceder.</p>
             </div>
          </div>

          {/* Acciones de Login */}
          <div className="w-full space-y-3">
             {/* Google Auth - SVG Interno */}
             <button 
               onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
               className="w-full h-12 bg-white dark:bg-[#0f1015] border border-slate-200 dark:border-[#2a2b3d] hover:border-[#00B4AA] rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm active:scale-[0.98] group"
             >
               <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.2-4.53z" fill="#EA4335"/>
               </svg>
               <span className="text-slate-700 dark:text-slate-100 font-bold text-xs tracking-wide">CONTINUAR CON GOOGLE</span>
               <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
             </button>

             {/* Separador */}
             <div className="relative py-2 px-6 flex items-center">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">O acceder por</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
             </div>

             {/* Otros Métodos */}
             <div className="grid grid-cols-2 gap-3">
                <button className="h-10 border border-slate-200 dark:border-[#2a2b3d] rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors text-slate-600 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">CORREO</span>
                </button>
                <button className="h-10 border border-slate-200 dark:border-[#2a2b3d] rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">CELULAR</span>
                </button>
             </div>
          </div>

          {/* Footer del Formulario */}
          <div className="pt-4 flex flex-col items-center gap-2">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Lock className="w-3 h-3" />
                Cifrado Fin a Fin
             </div>
             <p className="text-[10px] text-slate-400">© 2026 Admin SJM Nacional v1.070</p>
          </div>

        </div>
      </div>

    </div>
  );
}
