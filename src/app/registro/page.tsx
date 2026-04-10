"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/TenantProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail, Phone, ArrowLeft, Loader2, Eye, EyeOff, CheckCircle2,
  XCircle, ShieldCheck, Calendar, User
} from "lucide-react";
import { registrarUsuarioAction } from "@/app/actions/registro";

export default function RegistroPage() {
  const tenant = useTenant();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"main" | "email" | "phone">("main");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    celular: "",
    fecha_nacimiento: "",
    contrasena: "",
    confirmar: "",
  });

  // Validaciones de contraseña en tiempo real
  const passChecks = {
    longitud: form.contrasena.length >= 8,
    mayuscula: /[A-Z]/.test(form.contrasena),
    numero: /[0-9]/.test(form.contrasena),
    coincide: form.contrasena === form.confirmar && form.confirmar.length > 0,
  };

  const passStrength = Object.values(passChecks).filter(Boolean).length;

  const handleGoogleRegister = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar coincidencia de contraseñas
    if (form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validar todos los checks
    if (!passChecks.longitud || !passChecks.mayuscula || !passChecks.numero) {
      setError("La contraseña no cumple con los requisitos mínimos.");
      return;
    }

    setIsLoading(true);

    const resultado = await registrarUsuarioAction({
      nombre_completo: form.nombre,
      correo: viewMode === "email" ? form.correo : undefined,
      celular: viewMode === "phone" ? form.celular : undefined,
      contrasena: form.contrasena,
      fecha_nacimiento: form.fecha_nacimiento || undefined,
    });

    if (!resultado.ok) {
      setError(resultado.error || "Error al registrar.");
      setIsLoading(false);
      return;
    }

    // Registro exitoso — hacer login automático
    setSuccess(true);
    setTimeout(async () => {
      const loginResult = await signIn("credentials", {
        email: viewMode === "email" ? form.correo : form.celular,
        password: form.contrasena,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push("/dashboard");
      } else {
        // Si el auto-login falla, redirigir al login normal
        router.push("/login");
      }
    }, 1500);
  };

  const PassCheck = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${ok ? "text-emerald-500" : "text-slate-400 dark:text-[#5e5e72]"}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </div>
  );

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00B4AA]/20 rounded-full blur-[120px]" />
        <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">¡Bienvenido a SJM!</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Tu cuenta ha sido creada exitosamente. Ingresando al sistema...</p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00B4AA]" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B4AA]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1E3A5F]/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">

          {/* Barra superior */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-white dark:bg-[#2a2b3d] rounded-2xl shadow-xl flex items-center justify-center mb-5 p-3 border border-slate-100 dark:border-white/5">
              <Image
                src="/logo-sjm-oficial.png"
                alt={tenant.nombre}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-center">
              {viewMode === "main" ? "Crear tu Cuenta" : viewMode === "email" ? "Registro por Correo" : "Registro por Celular"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm text-center font-medium">
              {viewMode === "main" ? "Únete a la comunidad SJM" : "Completa tus datos para registrarte"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
            </div>
          )}

          {/* Contenido dinámico */}
          <div className="space-y-4">
            {viewMode === "main" ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Google Sign-Up */}
                <button
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#0f1015] hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold py-4 px-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Registrarse con Google</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-[#2a2b3d]"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="px-4 text-slate-400 dark:text-[#5e5e72] bg-white dark:bg-[#1a1b26] rounded-full">O regístrate con</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setViewMode("email")} className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#0f1015] border border-slate-100 dark:border-[#2a2b3d] hover:bg-[#00B4AA]/5 hover:border-[#00B4AA]/30 transition-all group">
                    <Mail className="w-5 h-5 text-slate-400 group-hover:text-[#00B4AA] mb-2" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Correo</span>
                  </button>
                  <button onClick={() => setViewMode("phone")} className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#0f1015] border border-slate-100 dark:border-[#2a2b3d] hover:bg-[#00B4AA]/5 hover:border-[#00B4AA]/30 transition-all group">
                    <Phone className="w-5 h-5 text-slate-400 group-hover:text-[#00B4AA] mb-2" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Celular</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                  type="button"
                  onClick={() => { setViewMode("main"); setError(""); }}
                  className="inline-flex items-center text-xs font-black text-[#00B4AA] hover:text-[#009a96] mb-1 uppercase tracking-tight"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Volver a opciones
                </button>

                {/* Nombre completo */}
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      className="rounded-xl h-11 pl-10 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] text-sm"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Correo o Celular */}
                {viewMode === "email" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="correo" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="correo"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        className="rounded-xl h-11 pl-10 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] text-sm"
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="celular" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Número de Celular</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="celular"
                        type="tel"
                        placeholder="55 1234 5678"
                        className="rounded-xl h-11 pl-10 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] text-sm"
                        value={form.celular}
                        onChange={(e) => setForm({ ...form, celular: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Fecha de nacimiento */}
                <div className="space-y-1.5">
                  <Label htmlFor="fecha_nacimiento" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Fecha de Nacimiento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      className="rounded-xl h-11 pl-10 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] text-sm"
                      value={form.fecha_nacimiento}
                      onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="pass" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      className="rounded-xl h-11 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] pr-10 text-sm"
                      value={form.contrasena}
                      onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Indicador de fortaleza */}
                {form.contrasena.length > 0 && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passStrength >= i
                              ? passStrength <= 2
                                ? "bg-orange-400"
                                : passStrength === 3
                                ? "bg-yellow-400"
                                : "bg-emerald-500"
                              : "bg-slate-200 dark:bg-[#2a2b3d]"
                          }`}
                        />
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

                {/* Confirmar contraseña */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm" className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      className="rounded-xl h-11 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] pr-10 text-sm"
                      value={form.confirmar}
                      onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading || !passChecks.longitud || !passChecks.mayuscula || !passChecks.numero || !passChecks.coincide}
                  className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-[#00B4AA]/30 text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear Mi Cuenta"}
                </Button>
              </form>
            )}
          </div>

          {/* Footer — Ya tengo cuenta */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-500 dark:text-[#8e8ea0] font-medium">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-[#00B4AA] font-bold hover:underline">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer seguridad */}
        <div className="mt-8 flex flex-col items-center gap-4 opacity-70">
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white dark:border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#00B4AA]" />
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Seguridad Fin a Fin Habilitada</span>
          </div>
          <p className="text-center text-[10px] text-slate-400 dark:text-[#5e5e72] font-black uppercase tracking-[0.2em]">
            SJM PLATFORM &bull; v1.140
          </p>
        </div>
      </div>
    </main>
  );
}
