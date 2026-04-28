"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useTenant } from "@/components/TenantProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, ArrowLeft, Loader2, UserPlus, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const tenant = useTenant();
  const [viewMode, setViewMode] = useState<"social" | "email" | "phone">("social");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", phone: "" });

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Aquí se conectará con el API de NextAuth
    setTimeout(() => {
      setIsLoading(false);
      alert("Autenticación por credenciales próximamente habilitada en v1.085");
    }, 1500);
  };

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
                 alt={tenant.nombre} 
                 width={80} 
                 height={80} 
                 className="object-contain" 
               />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center">
              {viewMode === "social" ? "Acceso SJM Nacional" : viewMode === "email" ? "Acceso por Correo" : "Acceso por Celular"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm text-center font-medium leading-relaxed">
              {viewMode === "social" ? "Para mayor gloria de Dios" : "Introduce tus datos de acceso"}
            </p>
          </div>

          {/* Formulario Dinámico */}
          <div className="space-y-4">
            {viewMode === "social" ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <button 
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#0f1015] hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold py-4 px-6 rounded-2xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continuar con Google</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-[#2a2b3d]"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest bg-transparent">
                    <span className="px-4 text-slate-400 dark:text-[#5e5e72] bg-white dark:bg-[#1a1b26] rounded-full">Otras opciones</span>
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
              <form onSubmit={handleCredentialsLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                  type="button" 
                  onClick={() => setViewMode("social")} 
                  className="inline-flex items-center text-xs font-black text-[#00B4AA] hover:text-[#009a96] mb-2 uppercase tracking-tight"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Volver a opciones
                </button>

                {viewMode === "email" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@ejemplo.com"
                        className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Contraseña</Label>
                        <Link href="/recuperar" className="text-[10px] text-[#00B4AA] font-bold hover:underline">¿Olvidaste tu contraseña?</Link>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in slide-in-from-bottom-2">
                    <Label htmlFor="phone">Número de Celular</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="55-1234-5678"
                      className="rounded-xl h-12 bg-white/50 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                )}

                <Button 
                  disabled={isLoading}
                  className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-[#00B4AA]/30 text-xs uppercase tracking-widest"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
                </Button>
              </form>
            )}
          </div>

          {/* Footer del Formulario */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-sm text-slate-500 dark:text-[#8e8ea0] font-medium">
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="text-[#00B4AA] font-bold hover:underline inline-flex items-center gap-1 group">
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Seguridad */}
        <div className="mt-8 flex flex-col items-center gap-4 opacity-70">
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur px-4 py-2 rounded-full border border-white dark:border-white/10 flex items-center gap-3">
             <ShieldCheck className="w-4 h-4 text-[#00B4AA]" />
             <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Seguridad Fin a Fin Habilitada</span>
          </div>
          <p className="text-center text-[10px] text-slate-400 dark:text-[#5e5e72] font-black uppercase tracking-[0.2em]">
            SJM PLATFORM &bull; v1.171 &bull; COMPILACIÓN: 27-04-2026 09:50 PM
          </p>
        </div>
      </div>
    </main>
  );
}
