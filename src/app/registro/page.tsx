"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff, User, Mail, Phone } from "lucide-react";
import { sjmToast } from "@/components/ui/SjmToast";
import { registrarUsuarioPublicoAction } from "@/app/actions/usuarios";

export default function RegistroSJMPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirm: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirm) {
      sjmToast("Error", "Las contraseñas no coinciden.", "error");
      return;
    }
    
    if (form.password.length < 6) {
      sjmToast("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    setIsLoading(true);
    
    const res = await registrarUsuarioPublicoAction({
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      password: form.password
    });
    
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
      sjmToast("¡Registro Exitoso!", "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.", "success");
      // Opcionalmente, redirigir automático después de unos segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      sjmToast("Error", res.error || "Ocurrió un error al registrarte.", "error");
    }
  };

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
        <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4">¡Registro Exitoso!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Tu cuenta ha sido creada exitosamente. Por seguridad, un administrador SJM podría necesitar habilitar tus permisos más adelante.
            </p>
            <Link 
              href="/login"
              className="inline-flex w-full items-center justify-center h-12 bg-[#00B4AA] hover:bg-[#009a96] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#00B4AA]/30 text-xs uppercase tracking-widest"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#0f1015] relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B4AA]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1E3A5F]/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Barra superior de color */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F]" />

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white dark:bg-[#2a2b3d] rounded-2xl shadow-xl flex items-center justify-center mb-6 p-4 border border-slate-100 dark:border-white/5">
               <Image 
                 src="/logo-sjm-oficial.png" 
                 alt="SJM" 
                 width={80} 
                 height={80} 
                 className="object-contain" 
               />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center">
              Crear Cuenta
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center font-medium leading-relaxed">
              Únete a la plataforma SJM
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-xs font-bold uppercase text-slate-500">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="nombre"
                  placeholder="Ej. Juan Pérez"
                  className="pl-10 rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo" className="text-xs font-bold uppercase text-slate-500">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  className="pl-10 rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-xs font-bold uppercase text-slate-500">Celular / Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="10 dígitos"
                  className="pl-10 rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-500">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00B4AA] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-xs font-bold uppercase text-slate-500">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA] pr-10"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00B4AA] transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#00B4AA] hover:bg-[#009a96] text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#00B4AA]/30 mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear Cuenta"}
            </Button>

            <div className="text-center mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
              <Link href="/login" className="inline-flex items-center text-xs text-slate-500 hover:text-[#00B4AA] uppercase font-bold tracking-wide transition-colors">
                <ArrowLeft className="w-3 h-3 mr-2" /> Ya tengo una cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
