"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTenant } from "@/components/TenantProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle2, ShieldCheck, Send } from "lucide-react";
import { solicitarRecuperacionAction } from "@/app/actions/recuperar";

export default function RecuperarPage() {
  const tenant = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [identificador, setIdentificador] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const resultado = await solicitarRecuperacionAction(identificador);

    setIsLoading(false);

    if (!resultado.ok) {
      setError(resultado.error || "Error al procesar la solicitud.");
      return;
    }

    setEnviado(true);
  };

  if (enviado) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B4AA]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1E3A5F]/20 rounded-full blur-[120px]" />
        <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Send className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Revisa tu correo</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 leading-relaxed">
              Si el correo o celular está registrado, recibirás un enlace para restablecer tu contraseña. El enlace expira en <strong>1 hora</strong>.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold text-xs uppercase tracking-widest">
                  Volver a Iniciar Sesión
                </Button>
              </Link>
              <button
                onClick={() => { setEnviado(false); setIdentificador(""); }}
                className="text-sm text-[#00B4AA] font-bold hover:underline"
              >
                Reenviar enlace
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B4AA]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1E3A5F]/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white dark:bg-[#2a2b3d] rounded-2xl shadow-xl flex items-center justify-center mb-5 p-3 border border-slate-100 dark:border-white/5">
              <Image src="/logo-sjm-oficial.png" alt={tenant.nombre} width={64} height={64} className="object-contain" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-center">Recuperar Contraseña</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm text-center font-medium leading-relaxed">
              Ingresa tu correo o celular registrado y te enviaremos un enlace
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 animate-in fade-in duration-200">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="identificador" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Correo Electrónico o Celular
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="identificador"
                  type="text"
                  placeholder="tu@ejemplo.com o 55 1234 5678"
                  className="rounded-xl h-12 pl-10 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !identificador.trim()}
              className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-[#00B4AA]/30 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Enlace de Recuperación"}
            </Button>
          </form>

          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-[#00B4AA] font-bold hover:underline gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Volver a Iniciar Sesión
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 opacity-70">
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white dark:border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#00B4AA]" />
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Seguridad Fin a Fin Habilitada</span>
          </div>
          <p className="text-center text-[10px] text-slate-400 dark:text-[#5e5e72] font-black uppercase tracking-[0.2em]">
            SJM PLATFORM &bull; v1.165
          </p>
        </div>
      </div>
    </main>
  );
}
