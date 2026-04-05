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
import { Save, UserCircle, Shield, Briefcase, Heart } from "lucide-react";

const formSchema = z.object({
  nombre_completo: z.string().min(3, "Mínimo 3 caracteres"),
  celular: z.string().optional(),
  ministerio_id: z.string().nullable().optional(),
  cargo_id: z.string().nullable().optional(),
  estado_civil: z.string().optional(),
  avance_servidor: z.string().optional(),
  estatus: z.boolean().default(true),
});

export default function EditarServidorForm({ 
  servidor, 
  ministerios, 
  cargos, 
  onSuccess 
}: { 
  servidor: any, 
  ministerios: any[], 
  cargos: any[], 
  onSuccess: () => void 
}) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nombre_completo: servidor.nombre_completo || "",
      celular: servidor.celular || "",
      ministerio_id: servidor.ministerio_id || null,
      cargo_id: servidor.cargo_id || null,
      estado_civil: servidor.estado_civil || "SOLTERO(A)",
      avance_servidor: servidor.avance_servidor || "NUEVO",
      estatus: servidor.estatus ?? true,
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
              <Label className="text-xs font-bold uppercase tracking-tight">WhatsApp / Celular</Label>
              <Input {...form.register("celular")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
           </div>
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Estatus en la Obra</Label>
              <select {...form.register("estatus", { setValueAs: (v) => v === "true" })} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                <option value="true">ACTIVO</option>
                <option value="false">BAJA</option>
              </select>
           </div>
        </div>

        {/* Roles y Ministerio */}
        <div className="space-y-4">
           <Label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Shield className="w-4 h-4" /> Asignación Institucional
           </Label>
           
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Ministerio al que pertenece</Label>
              <div className="relative">
                 <Heart className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                 <select {...form.register("ministerio_id")} className="w-full h-10 pl-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                   <option value="">Ninguno / Sin Ministerio</option>
                   {ministerios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Cargo / Responsabilidad</Label>
              <div className="relative">
                 <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                 <select {...form.register("cargo_id")} className="w-full h-10 pl-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#1a1b26] px-3 py-2 text-sm dark:text-white outline-none">
                   <option value="">Servidor General</option>
                   {cargos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight">Crecimiento Espiritual</Label>
              <select {...form.register("avance_servidor")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                <option value="NUEVO">NUEVO</option>
                <option value="EN FORMACION">EN FORMACIÓN</option>
                <option value="COMPROMETIDO">COMPROMETIDO</option>
                <option value="CONSAGRADO">CONSAGRADO</option>
              </select>
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
