"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/TenantProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2, Eye, EyeOff, CheckCircle2, XCircle,
  ShieldCheck, ArrowLeft, Lock, AlertTriangle
} from "lucide-react";
import {
  validarTokenAction,
  restablecerContrasenaAction,
} from "@/app/actions/recuperar";

export default function RestablecerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const tenant = useTenant();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [validando, setValidando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [errorToken, setErrorToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({ contrasena: "", confirmar: "" });

  const passChecks = {
    longitud: form.contrasena.length >= 8,
    mayuscula: /[A-Z]/.test(form.contrasena),
    numero: /[0-9]/.test(form.contrasena),
    coincide: form.contrasena === form.confirmar && form.confirmar.length > 0,
  };

  const passStrength = Object.values(passChecks).filter(Boolean).length;

  // Validar token al cargar
  useEffect(() => {
    async function validar() {
      const resultado = await validarTokenAction(token);
      setTokenValido(resultado.valido);
      if (!resultado.valido) setErrorToken(resultado.error || "Enlace inválido.");
      setValidando(false);
    }
    validar();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    const resultado = await restablecerContrasenaAction(token, form.contrasena);
    setIsLoading(false);

    if (!resultado.ok) {
      setError(resultado.error || "Error al restablecer.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  };

  const PassCheck = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${ok ? "text-emerald-500" : "text-slate-400 dark:text-[#5e5e72]"}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </div>
  );

  // Estado: Validando token
  if (validando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f1015]">
        <div className="text-center animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-[#00B4AA] mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Validando enlace...</p>
        </div>
      </main>
    );
  }

  // Estado: Token inválido
  if (!tokenValido) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]" />
        <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Enlace no válido</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6">{errorToken}</p>
            <Link href="/recuperar">
              <Button className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold text-xs uppercase tracking-widest">
                Solicitar nuevo enlace
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Estado: Contraseña restablecida exitosamente
  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-[#00B4AA]" />
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-3">¡Contraseña actualizada!</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6">Tu contraseña ha sido restablecida exitosamente. Redirigiendo al login...</p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00B4AA]" />
          </div>
        </div>
      </main>
    );
  }

  // Estado: Formulario para nueva contraseña
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B4AA]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1E3A5F]/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />

          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white dark:bg-[#2a2b3d] rounded-2xl shadow-xl flex items-center justify-center mb-5 p-3 border border-slate-100 dark:border-white/5">
              <Lock className="w-8 h-8 text-[#00B4AA]" />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-center">Nueva Contraseña</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm text-center font-medium">Crea una nueva contraseña segura</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 animate-in fade-in duration-200">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contraseña */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] pr-10"
                  value={form.contrasena}
                  onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Indicador de fortaleza */}
            {form.contrasena.length > 0 && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${passStrength >= i ? (passStrength <= 2 ? "bg-orange-400" : passStrength === 3 ? "bg-yellow-400" : "bg-emerald-500") : "bg-slate-200 dark:bg-[#2a2b3d]"}`} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <PassCheck ok={passChecks.longitud} label="8+ caracteres" />
                  <PassCheck ok={passChecks.mayuscula} label="1 mayúscula" />
                  <PassCheck ok={passChecks.numero} label="1 número" />
                  <PassCheck ok={passChecks.coincide} label="Coinciden" />
                </div>
              </div>
            )}

            {/* Confirmar */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] pr-10"
                  value={form.confirmar}
                  onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !passChecks.longitud || !passChecks.mayuscula || !passChecks.numero || !passChecks.coincide}
              className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-[#00B4AA]/30 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Restablecer Contraseña"}
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
        </div>
      </div>
    </main>
  );
}
