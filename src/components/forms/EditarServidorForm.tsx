"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actualizarServidorAction } from "@/app/actions/inscripciones";
import { Save, UserCircle, Shield, Briefcase, Heart, MapPin, Mail, Phone, FileText, Activity, Share2, ScrollText } from "lucide-react";

const formSchema = z.object({
  nombre_completo: z.string().min(3, "Mínimo 3 caracteres"),
  celular: z.string().optional(),
  correo: z.string().optional(),
  ministerio_id: z.string().nullable().optional(),
  cargo_id: z.string().nullable().optional(),
  estado_civil: z.string().optional(),
  avance_servidor: z.string().optional(),
  estatus: z.boolean().default(true),
  fecha_nacimiento: z.string().optional(),
  sede_id: z.string().optional(),
  fecha_ingreso: z.string().optional(),
  domicilio_calle: z.string().optional(),
  domicilio_colonia: z.string().optional(),
  domicilio_cp: z.string().optional(),
  contacto_emergencia: z.string().optional(),
  tels_emergencia: z.string().optional(),
  telefono_casa_trabajo: z.string().optional(),
  observaciones: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  tiktok_url: z.string().optional(),
  youtube_url: z.string().optional(),
  retiros_tomados_detalle: z.string().optional(),
  retiros_externos_detalle: z.string().optional(),
  servicios_sjm: z.string().optional(),
});

export default function EditarServidorForm({ 
  servidor, 
  ministerios, 
  cargos,
  sedes, 
  onSuccess 
}: { 
  servidor: any, 
  ministerios: any[], 
  cargos: any[],
  sedes: any[], 
  onSuccess: () => void 
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nombre_completo: servidor.nombre_completo || "",
      celular: servidor.celular || "",
      correo: servidor.correo || "",
      ministerio_id: servidor.ministerio_id || null,
      cargo_id: servidor.cargo_id || null,
      estado_civil: servidor.estado_civil || "SOLTERO(A)",
      avance_servidor: servidor.avance_servidor || "Servidor",
      estatus: servidor.estatus ?? true,
      fecha_nacimiento: servidor.fecha_nacimiento ? new Date(servidor.fecha_nacimiento).toISOString().split('T')[0] : "",
      sede_id: servidor.sede_id || "",
      fecha_ingreso: servidor.fecha_ingreso ? new Date(servidor.fecha_ingreso).toISOString().split('T')[0] : "",
      domicilio_calle: servidor.domicilio_calle || "",
      domicilio_colonia: servidor.domicilio_colonia || "",
      domicilio_cp: servidor.domicilio_cp || "",
      contacto_emergencia: servidor.contacto_emergencia || "",
      tels_emergencia: servidor.tels_emergencia || "",
      telefono_casa_trabajo: servidor.telefono_casa_trabajo || "",
      observaciones: servidor.observaciones || "",
      facebook_url: servidor.facebook_url || "",
      instagram_url: servidor.instagram_url || "",
      tiktok_url: servidor.tiktok_url || "",
      youtube_url: servidor.youtube_url || "",
      retiros_tomados_detalle: servidor.retiros_tomados_detalle || "",
      retiros_externos_detalle: servidor.retiros_externos_detalle || "",
      servicios_sjm: servidor.servicios_sjm || "",
    },
  });

  async function onSubmit(values: any) {
    setCargando(true);
    const res = await actualizarServidorAction(servidor.id, values);
    setCargando(false);

    if (res.success) {
      onSuccess();
      router.refresh();
    } else {
      alert("Error al actualizar: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identidad */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <UserCircle className="w-4 h-4" /> Datos de Identidad
           </Label>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Nombre Completo</Label>
              <Input {...form.register("nombre_completo")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Correo Electrónico</Label>
              <Input type="email" {...form.register("correo")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">WhatsApp / Celular</Label>
                <Input {...form.register("celular")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Tel. Casa / Trabajo</Label>
                <Input {...form.register("telefono_casa_trabajo")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Fecha de Nacimiento</Label>
              <Input type="date" {...form.register("fecha_nacimiento")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
        </div>

        {/* Roles y Ministerio */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Shield className="w-4 h-4" /> Asignación Institucional
           </Label>
           
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Sede</Label>
                <select {...form.register("sede_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                  <option value="">Selecciona Sede...</option>
                  {sedes?.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Estatus en la Obra</Label>
                <select {...form.register("estatus", { setValueAs: (v) => v === "true" })} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                  <option value="true">ACTIVO</option>
                  <option value="false">BAJA</option>
                </select>
             </div>
           </div>

           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Ministerio al que pertenece</Label>
              <div className="relative">
                 <Heart className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                 <select {...form.register("ministerio_id")} className="w-full h-10 pl-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                   <option value="">Ninguno / Sin Ministerio</option>
                   {ministerios?.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Cargo / Responsabilidad</Label>
              <div className="relative">
                 <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                 <select {...form.register("cargo_id")} className="w-full h-10 pl-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#1a1b26] px-3 py-2 text-sm dark:text-white outline-none">
                   <option value="">Servidor General</option>
                   {cargos?.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Avance Servidor</Label>
              <select {...form.register("avance_servidor")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                <option value="Servidor">Servidor</option>
                <option value="Apoyo">Apoyo</option>
                <option value="Aspirante">Aspirante</option>
              </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domicilio */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4" /> Domicilio
           </Label>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Calle y Número</Label>
              <Input {...form.register("domicilio_calle")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Colonia</Label>
                <Input {...form.register("domicilio_colonia")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Código Postal</Label>
                <Input {...form.register("domicilio_cp")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
           </div>
        </div>

        {/* Emergencia y Otros */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Activity className="w-4 h-4" /> Emergencia y Otros
           </Label>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Contacto de Emergencia</Label>
              <Input placeholder="Nombre del contacto" {...form.register("contacto_emergencia")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Teléfonos de Emergencia</Label>
              <Input {...form.register("tels_emergencia")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Fecha de Ingreso a SJM</Label>
              <Input type="date" {...form.register("fecha_ingreso")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Redes Sociales */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Share2 className="w-4 h-4" /> Redes Sociales
           </Label>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Facebook</Label>
                <Input placeholder="URL del perfil" {...form.register("facebook_url")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">Instagram</Label>
                <Input placeholder="Usuario / URL" {...form.register("instagram_url")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">TikTok</Label>
                <Input placeholder="Usuario / URL" {...form.register("tiktok_url")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight">YouTube</Label>
                <Input placeholder="Canal / URL" {...form.register("youtube_url")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
             </div>
           </div>
        </div>

        {/* Historial y Observaciones */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <ScrollText className="w-4 h-4" /> Historial de Servicio y Retiros
           </Label>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Retiros Tomados en SJM (Detalle)</Label>
              <textarea 
                {...form.register("retiros_tomados_detalle")} 
                className="w-full rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none resize-y min-h-[60px]" 
              />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Retiros Externos (Otras Comunidades)</Label>
              <textarea 
                {...form.register("retiros_externos_detalle")} 
                className="w-full rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none resize-y min-h-[60px]" 
              />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Servicios en SJM</Label>
              <textarea 
                {...form.register("servicios_sjm")} 
                className="w-full rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none resize-y min-h-[60px]" 
              />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Observaciones</Label>
              <textarea 
                {...form.register("observaciones")} 
                className="w-full rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none resize-y min-h-[60px]" 
              />
           </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-[#2a2b3d] flex justify-end">
         <Button disabled={cargando} type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white px-10 h-12 rounded-xl font-bold">
            <Save className="w-4 h-4 mr-2" />
            {cargando ? "Actualizando..." : "Guardar Cambios"}
         </Button>
      </div>
    </form>
  );
}
