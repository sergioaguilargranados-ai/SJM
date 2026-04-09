"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User, Mail, Phone, Calendar, Save, Loader2, CheckCircle2,
  MapPin, ArrowLeft, Camera, Shield
} from "lucide-react";
import { actualizarPerfilAction } from "@/app/actions/perfil";
import { NavbarPublica } from "@/components/layout/NavbarPublica";

interface PerfilClientViewProps {
  usuario: {
    id: string;
    nombre_completo: string;
    correo: string;
    celular: string;
    fecha_nacimiento: string;
    foto_perfil_url: string;
    es_servidor: boolean;
    sede_id: string;
  };
  sedes: Array<{ id: string; nombre: string }>;
}

export function PerfilClientView({ usuario, sedes }: PerfilClientViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre_completo: usuario.nombre_completo,
    celular: usuario.celular,
    fecha_nacimiento: usuario.fecha_nacimiento,
    es_servidor: usuario.es_servidor,
    sede_id: usuario.sede_id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    const resultado = await actualizarPerfilAction({
      usuario_id: usuario.id,
      nombre_completo: form.nombre_completo,
      celular: form.celular || undefined,
      fecha_nacimiento: form.fecha_nacimiento || undefined,
      es_servidor: form.es_servidor,
      sede_id: form.es_servidor ? form.sede_id : undefined,
    });

    setIsLoading(false);

    if (!resultado.ok) {
      setError(resultado.error || "Error desconocido.");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    router.refresh();
  };

  // Obtener iniciales para el avatar
  const iniciales = usuario.nombre_completo
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0f1015]">
      <NavbarPublica />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-xs font-black text-[#00B4AA] hover:text-[#009a96] uppercase tracking-tight mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Mi Perfil
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Administra tu información personal y preferencias
            </p>
          </div>

          {/* Card de Perfil */}
          <div className="bg-white dark:bg-[#1a1b26] rounded-3xl shadow-xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden">
            {/* Header con Avatar */}
            <div className="bg-gradient-to-r from-[#00B4AA] to-[#1E3A5F] px-8 pt-8 pb-16 relative">
              <div className="absolute bottom-0 left-8 translate-y-1/2">
                <div className="relative group">
                  {usuario.foto_perfil_url ? (
                    <Image
                      src={usuario.foto_perfil_url}
                      alt={usuario.nombre_completo}
                      width={96}
                      height={96}
                      className="rounded-2xl border-4 border-white dark:border-[#1a1b26] shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-4 border-white dark:border-[#1a1b26] shadow-xl bg-[#1E3A5F] flex items-center justify-center text-white font-black text-2xl">
                      {iniciales}
                    </div>
                  )}
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-[#2a2b3d] rounded-full shadow-lg flex items-center justify-center text-slate-500 hover:text-[#00B4AA] transition-colors border border-slate-200 dark:border-[#2a2b3d]">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Miembro SJM</p>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-8 pt-16 pb-8 space-y-6">

              {/* Mensajes */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 animate-in fade-in duration-200">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 animate-in fade-in duration-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Perfil actualizado exitosamente.</p>
                </div>
              )}

              {/* Nombre */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={form.nombre_completo}
                    onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
                    className="rounded-xl h-12 pl-10 bg-slate-50 dark:bg-[#0f1015] border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                    required
                  />
                </div>
              </div>

              {/* Correo (solo lectura) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={usuario.correo}
                    disabled
                    className="rounded-xl h-12 pl-10 bg-slate-100 dark:bg-[#0f1015]/50 border-slate-200 dark:border-[#2a2b3d] opacity-60 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400 ml-1">El correo no se puede cambiar por seguridad.</p>
              </div>

              {/* Celular y Fecha de Nacimiento en grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Celular
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="tel"
                      placeholder="55 1234 5678"
                      value={form.celular}
                      onChange={(e) => setForm({ ...form, celular: e.target.value })}
                      className="rounded-xl h-12 pl-10 bg-slate-50 dark:bg-[#0f1015] border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Fecha de Nacimiento
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="date"
                      value={form.fecha_nacimiento}
                      onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                      className="rounded-xl h-12 pl-10 bg-slate-50 dark:bg-[#0f1015] border-slate-200 dark:border-[#2a2b3d] focus:ring-[#00B4AA] focus:border-[#00B4AA]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Servidor SJM */}
              <div className="border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-5 space-y-4 bg-slate-50/50 dark:bg-[#0f1015]/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#00B4AA] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">¿Eres Servidor SJM actualmente?</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Si eres servidor activo, selecciona tu sede para que tu coordinador te asigne el rol correspondiente.
                    </p>
                  </div>
                  {/* Toggle switch */}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, es_servidor: !form.es_servidor, sede_id: "" })}
                    className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                      form.es_servidor ? "bg-[#00B4AA]" : "bg-slate-300 dark:bg-[#2a2b3d]"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        form.es_servidor ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Selector de Sede (visible solo si es servidor) */}
                {form.es_servidor && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Selecciona tu Sede
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={form.sede_id}
                        onChange={(e) => setForm({ ...form, sede_id: e.target.value })}
                        className="w-full rounded-xl h-12 pl-10 pr-4 bg-white dark:bg-[#0f1015] border border-slate-200 dark:border-[#2a2b3d] text-sm text-slate-900 dark:text-white focus:ring-[#00B4AA] focus:border-[#00B4AA] appearance-none"
                        required
                      >
                        <option value="">— Selecciona una sede —</option>
                        {sedes.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium ml-1">
                      ⚡ Al guardar, se notificará al responsable de la sede para continuar con tu asignación de rol.
                    </p>
                  </div>
                )}
              </div>

              {/* Botón Guardar */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00B4AA] hover:bg-[#009a96] text-white h-12 rounded-xl font-bold transition-all shadow-lg shadow-[#00B4AA]/30 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Guardar Cambios
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
