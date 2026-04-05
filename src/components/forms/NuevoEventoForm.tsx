"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crearEventoAction } from "@/app/actions/inscripciones";
import { CalendarDays, Home, MapPin, DollarSign, Users, ChevronLeft, Save, Info } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  tipo_evento_id: z.string().uuid("Selecciona el tipo de retiro"),
  sede_id: z.string().uuid("Selecciona la sede responsable"),
  casa_retiro_id: z.string().uuid("Selecciona la casa de retiro"),
  fecha_inicio: z.string().min(1, "Obligatoria"),
  fecha_fin: z.string().min(1, "Obligatoria"),
  costo_publico: z.coerce.number().min(0, "Monto inválido"),
  cupo_maximo: z.coerce.number().min(1, "Cupo mínimo 1"),
  recomendaciones: z.string().optional(),
});

export default function NuevoEventoForm({ sedes, casas, tipos, onSuccess, isModal }: { sedes: any[], casas: any[], tipos: any[], onSuccess?: () => void, isModal?: boolean }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      costo_publico: 0,
      cupo_maximo: 50,
      sede_id: sedes[0]?.id || "",
      tipo_evento_id: tipos[0]?.id || "",
      casa_retiro_id: casas[0]?.id || "",
    },
  });

  async function onSubmit(values: any) {
    setCargando(true);
    const res = await crearEventoAction(values);
    setCargando(false);

    if (res.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/eventos");
        router.refresh();
      }
    } else {
      alert("Error al crear retiro: " + res.error);
    }
  }

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", isModal && "max-w-full")}>
      {!isModal && (
        <div className="flex items-center gap-4">
          <Link href="/eventos" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Programar Nuevo Retiro / Evento</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Establece las fechas, sede y costos para el próximo evento de la obra.</p>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", !isModal && "pb-20")}>
        
        {/* BLOQUE 1: Definición del Evento */}
        <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Configuración General</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Tipo de Retiro / Evento *</Label>
              <select {...form.register("tipo_evento_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]">
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Sede Responsable (Organiza) *</Label>
              <select {...form.register("sede_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="dark:text-slate-300">Casa de Retiro (Lugar) *</Label>
              <div className="relative">
                <Home className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select {...form.register("casa_retiro_id")} className="w-full h-10 pl-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                  {casas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Logística y Costos */}
        <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Logística, Cupo y Costos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Fecha Inicio *</Label>
              <Input type="datetime-local" {...form.register("fecha_inicio")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Fecha Fin *</Label>
              <Input type="datetime-local" {...form.register("fecha_fin")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Costo al Público *</Label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input type="number" step="0.01" {...form.register("costo_publico")} className="pl-9 dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Cupo Máximo *</Label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input type="number" {...form.register("cupo_maximo")} className="pl-9 dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
              </div>
            </div>

            <div className="space-y-2 md:col-span-4">
              <Label className="dark:text-slate-300">Recomendaciones Especiales para Asistentes</Label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]"
                {...form.register("recomendaciones")}
                placeholder="Ej. Llevar Biblia, artículos de aseo personal, ropa cómoda..."
              />
            </div>
          </div>
        </div>

        {/* Footer con acciones - Flotante solo si NO es modal */}
        <div className={cn(
          "flex items-center justify-end px-8 z-40",
          !isModal ? "fixed bottom-0 left-0 lg:left-64 right-0 h-16 bg-white dark:bg-[#1a1b26] border-t border-slate-200 dark:border-[#2a2b3d]" : "pt-6"
        )}>
           <div className="flex gap-4">
              {!isModal && (
                <Link href="/eventos" className="h-10 px-6 flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                  Cancelar
                </Link>
              )}
              <Button disabled={cargando} type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white px-8 h-10 rounded-md font-bold shadow-lg shadow-blue-100 dark:shadow-none">
                 <Save className="w-4 h-4 mr-2" />
                 {cargando ? "Publicar Retiro" : "Publicar Retiro"}
              </Button>
           </div>
        </div>
      </form>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
