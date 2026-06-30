"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crearServidorAction } from "@/app/actions/inscripciones";
import { User, Mail, Phone, MapPin, Calendar, Heart, ShieldCheck, ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  nombre_completo: z.string().min(3, "Obligatorio (min 3 caracteres)"),
  correo: z.string().email("Correo electrónico inválido"),
  celular: z.string().min(10, "Anota 10 dígitos"),
  sede_id: z.string().uuid("Selecciona una sede válida"),
  estado_civil: z.string().optional(),
  sexo: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  fecha_ingreso: z.string().optional(),
  avance_servidor: z.string().optional(),
  retiros_tomados: z.coerce.number().default(0),
  observaciones: z.string().optional(),
  ministerio_id: z.string().optional(),
  cargo_id: z.string().optional(),
  domicilio_calle: z.string().optional(),
  domicilio_colonia: z.string().optional(),
  domicilio_cp: z.string().optional(),
  estado_id: z.string().optional(),
  telefono_casa_trabajo: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  tiktok_url: z.string().optional(),
  youtube_url: z.string().optional(),
  contacto_emergencia: z.string().optional(),
  tels_emergencia: z.string().optional(),
  retiros_tomados_detalle: z.string().optional(),
  retiros_externos_detalle: z.string().optional(),
  servicios_sjm: z.string().optional(),
  nombre_gafete: z.string().optional(),
});

export default function NuevoServidorForm({ sedes, ministerios = [], cargos = [], estados = [], onSuccess, isModal }: { sedes: any[], ministerios?: any[], cargos?: any[], estados?: any[], onSuccess?: () => void, isModal?: boolean }) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  // En demo hardcoded, en prod viene de session
  const ORGANIZACION_ID = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd"; // SJM Nacional UUID de ejemplo

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      retiros_tomados: 0,
      sede_id: sedes[0]?.id || "",
    },
  });

  async function onSubmit(values: any) {
    setCargando(true);
    const res = await crearServidorAction({ ...values, organizacion_id: ORGANIZACION_ID });
    setCargando(false);

    if (res.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/servidores");
        router.refresh();
      }
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", isModal && "max-w-full")}>
      {!isModal && (
        <div className="flex items-center gap-4">
          <Link href="/servidores" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nuevo Registro de Servidor</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Captura la información base para integrar al nuevo miembro a la comunidad.</p>
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", !isModal && "pb-20")}>
        
        {/* BLOQUE 1: Identidad Core */}
        <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Información de Usuario</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Nombre Completo *</Label>
              <Input placeholder="Ej. Juan Manuel Pérez" {...form.register("nombre_completo")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
              {form.formState.errors.nombre_completo && <p className="text-red-500 text-xs">{form.formState.errors.nombre_completo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Sede de Adscripción *</Label>
              <select {...form.register("sede_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]">
                {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Correo Electrónico *</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input placeholder="correo@ejemplo.com" {...form.register("correo")} className="pl-10 dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
              </div>
              {form.formState.errors.correo && <p className="text-red-500 text-xs">{form.formState.errors.correo.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Celular WhatsApp *</Label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input placeholder="10 dígitos" {...form.register("celular")} className="pl-10 dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
              </div>
              {form.formState.errors.celular && <p className="text-red-500 text-xs">{form.formState.errors.celular.message}</p>}
            </div>
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Nombre Gafete</Label>
              <Input {...form.register("nombre_gafete")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>
            
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Ministerio Actual</Label>
              <select {...form.register("ministerio_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]">
                <option value="">Seleccione...</option>
                {ministerios.map((m: any) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Cargo Actual</Label>
              <select {...form.register("cargo_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]">
                <option value="">Seleccione...</option>
                {cargos.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="dark:text-slate-300">Domicilio (Calle y número)</Label>
              <Input {...form.register("domicilio_calle")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Colonia</Label>
              <Input {...form.register("domicilio_colonia")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Código Postal</Label>
              <Input {...form.register("domicilio_cp")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Estado</Label>
              <select {...form.register("estado_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]">
                <option value="">Seleccione...</option>
                {estados.map((e: any) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Teléfono Casa o Trabajo</Label>
              <Input {...form.register("telefono_casa_trabajo")} placeholder="Formato libre" className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Contacto de Emergencia</Label>
              <Input {...form.register("contacto_emergencia")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Tels. de Emergencia</Label>
              <Input {...form.register("tels_emergencia")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Facebook</Label>
              <Input {...form.register("facebook_url")} placeholder="Identificador / URL" className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Instagram</Label>
              <Input {...form.register("instagram_url")} placeholder="Identificador / URL" className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Perfil Servidor */}
        <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-[#e11d48]" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Padrón de Servidores</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Estado Civil</Label>
              <select {...form.register("estado_civil")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                <option value="SOLTERO">Soltero/a</option>
                <option value="CASADO">Casado/a (Iglesia)</option>
                <option value="CIVIL">Casado/a (Civil)</option>
                <option value="UNION_LIBRE">Unión Libre</option>
                <option value="RECONCILIADO">Reconciliado</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Sexo</Label>
              <select {...form.register("sexo")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Fecha de Nacimiento</Label>
              <Input type="date" {...form.register("fecha_nacimiento")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Fecha de Ingreso SJM</Label>
              <Input type="date" {...form.register("fecha_ingreso")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Avance / Nivel</Label>
              <Input placeholder="Ej. Servidor I" {...form.register("avance_servidor")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Retiros Tomados</Label>
              <Input type="number" {...form.register("retiros_tomados")} className="dark:bg-[#0f1015] dark:border-[#2a2b3d] dark:text-white" />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label className="dark:text-slate-300">Retiros Tomados (Detalle extenso)</Label>
              <textarea 
                className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]"
                {...form.register("retiros_tomados_detalle")}
                placeholder="Listado detallado libre de retiros tomados..."
              />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label className="dark:text-slate-300">Retiros Otras Comunidades (Detalle extenso)</Label>
              <textarea 
                className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]"
                {...form.register("retiros_externos_detalle")}
                placeholder="Listado de retiros en otras comunidades..."
              />
            </div>
            
            <div className="space-y-2 md:col-span-3">
              <Label className="dark:text-slate-300">Servicios en SJM (Detalle extenso)</Label>
              <textarea 
                className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]"
                {...form.register("servicios_sjm")}
                placeholder="Listado de servicios dentro de la obra..."
              />
            </div>

            <div className="space-y-2 md:col-span-3">
              <Label className="dark:text-slate-300">Observaciones Internas</Label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48]"
                {...form.register("observaciones")}
                placeholder="Notas adicionales sobre el perfil del servidor..."
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
                <Link href="/servidores" className="h-10 px-6 flex items-center justify-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                  Cancelar
                </Link>
              )}
              <Button disabled={cargando} type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white px-8 h-10 rounded-md font-bold shadow-lg shadow-blue-100 dark:shadow-none">
                 <Save className="w-4 h-4 mr-2" />
                 {cargando ? "Guardando..." : "Crear Servidor"}
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
