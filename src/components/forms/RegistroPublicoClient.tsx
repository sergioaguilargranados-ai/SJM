"use client";

import React, { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegistroPublicoClientProps {
  evento: any;
  children: React.ReactNode;
  bypassPassword?: boolean;
}

export function RegistroPublicoClient({ evento, children, bypassPassword }: RegistroPublicoClientProps) {
  const [password, setPassword] = useState("");
  const [autorizado, setAutorizado] = useState(!evento.contrasena_inscripcion || bypassPassword);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleValidar = () => {
    if (password === evento.contrasena_inscripcion) {
      setAutorizado(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (autorizado) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-[#1a1b26] rounded-[40px] shadow-2xl border border-slate-100 dark:border-[#2a2b3d] text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Acceso Restringido</h2>
      <p className="text-slate-500 dark:text-[#8e8ea0] mt-2 text-sm">
        Este retiro requiere una contraseña de inscripción proporcionada por el personal de SJM.
      </p>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"}
            placeholder="Introduce la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleValidar()}
            className={`h-14 rounded-2xl text-center font-bold tracking-widest pr-12 ${error ? 'border-red-500 ring-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {error && (
            <p className="text-red-500 text-[10px] font-bold uppercase mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" /> Contraseña incorrecta
            </p>
          )}
        </div>

        <Button 
          onClick={handleValidar}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:-translate-y-1 transition-all"
        >
          Validar Acceso <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <button 
          onClick={() => window.location.href = '/retiros-eventos'}
          className="w-full h-12 rounded-2xl text-slate-500 font-bold text-sm uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-[#2a2b3d] transition-all"
        >
          Regresar a Eventos
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-center gap-2 opacity-50">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Inscripción Protegida por SJM</span>
      </div>
    </div>
  );
}
