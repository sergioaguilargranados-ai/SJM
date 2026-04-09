"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Mail, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; message: string }> = {
    AccessDenied: {
      title: "Acceso Denegado",
      message: "Tu correo electrónico no se encuentra registrado en nuestra base de datos nacional. Por favor, solicita tu acceso al administrador de tu sede.",
    },
    Verification: {
      title: "Error de Verificación",
      message: "El enlace ha expirado o ya ha sido utilizado. Por favor, intenta iniciar sesión de nuevo.",
    },
    Configuration: {
      title: "Error de Configuración",
      message: "Hay un problema con la configuración de autenticación del servidor. Contacta a soporte técnico.",
    },
    default: {
      title: "Error de Autenticación",
      message: "Ocurrió un problema inesperado al intentar iniciar sesión. Por favor, intenta de nuevo.",
    },
  };

  const { title, message } = errorMessages[error as string] || errorMessages.default;

  return (
    <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-red-100 dark:border-red-900/20 rounded-[40px] p-10 shadow-2xl relative text-center">
        
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
          {title}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
          {message}
        </p>

        <div className="grid grid-cols-1 gap-4">
          <Link href="/login" className="w-full">
            <Button className="w-full bg-[#1E3A5F] hover:bg-[#152944] text-white h-12 rounded-xl font-bold transition-all shadow-lg text-xs uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Login
            </Button>
          </Link>
          
          <div className="flex gap-3 w-full">
            <a href="mailto:soporte@serjema.com" className="flex-1">
              <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-[#2a2b3d] dark:text-slate-300 text-xs font-bold uppercase tracking-widest">
                <Mail className="w-4 h-4 mr-2" /> Soporte
              </Button>
            </a>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 dark:border-[#2a2b3d] dark:text-slate-300 text-xs font-bold uppercase tracking-widest">
                <Home className="w-4 h-4 mr-2" /> Inicio
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#00B4AA]" />
          <span className="text-[10px] font-black text-[#00B4AA] uppercase tracking-widest">SJM Support Team</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />

      <Suspense fallback={
        <div className="w-full max-w-[480px] z-10 animate-pulse">
          <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-red-100 rounded-[40px] p-20 shadow-2xl" />
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </main>
  );
}
