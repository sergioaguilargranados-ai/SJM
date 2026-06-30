"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, CheckCircle2, Search, Plane, ShieldCheck, Upload
} from "lucide-react";
import { registrarRenaseAction, buscarServidorPorNombreAction } from "@/app/actions/inscripciones";

// Componente para manejar la subida usando vercel/blob
import { upload } from "@vercel/blob/client";

const itinerarioSchema = z.object({
  fecha_hora_llegada: z.string().optional(),
  lugar_llegada: z.string().optional(),
  medio_transporte_llegada: z.string().optional(),
  fecha_hora_salida: z.string().optional(),
  lugar_salida: z.string().optional(),
  medio_transporte_salida: z.string().optional(),
  pase_abordar_url: z.string().optional(),
  participa_salida_paseo: z.boolean().default(false),
});

const servidorSchema = z.object({
  nombre_completo: z.string().min(3, "Obligatorio"),
  nombre_gafete: z.string().optional(),
  correo: z.string().email("Inválido").optional().or(z.literal("")),
  celular: z.string().min(10, "Obligatorio"),
  sede_id: z.string().optional(),
  ministerio_id: z.string().optional(),
  cargo_id: z.string().optional(),
});

const formSchema = z.intersection(itinerarioSchema, servidorSchema);
type FormValues = z.infer<typeof formSchema>;

export function RegistroRenaseClient({ evento, sedes }: { evento: any, sedes: any[] }) {
  const [paso, setPaso] = useState<"BUSCADOR" | "CAPTURA" | "EXITO">("BUSCADOR");
  const [cargando, setCargando] = useState(false);
  const [termBusqueda, setTermBusqueda] = useState("");
  const [servidoresEncontrados, setServidoresEncontrados] = useState<any[]>([]);
  const [servidorSeleccionado, setServidorSeleccionado] = useState<any>(null);

  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [paseUrl, setPaseUrl] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      participa_salida_paseo: false,
    }
  });

  const buscarServidor = async () => {
    if (!termBusqueda || termBusqueda.length < 3) return;
    setCargando(true);
    const res = await buscarServidorPorNombreAction(termBusqueda);
    setCargando(false);
    if (res.success && res.data) {
       setServidoresEncontrados(res.data);
    }
  };

  const seleccionarServidor = (serv: any) => {
    setServidorSeleccionado(serv);
    form.reset({
       ...form.getValues(),
       nombre_completo: serv.nombre_completo || "",
       correo: serv.correo || "",
       celular: serv.celular || "",
       sede_id: serv.sede_id || "",
       ministerio_id: serv.ministerio_id || "",
       cargo_id: serv.cargo_id || "",
    });
    setPaso("CAPTURA");
  };

  const nuevoServidor = () => {
    setServidorSeleccionado(null);
    form.reset({
      ...form.getValues(),
      nombre_completo: termBusqueda,
    });
    setPaso("CAPTURA");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    setSubiendoArchivo(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      setPaseUrl(newBlob.url);
      form.setValue("pase_abordar_url", newBlob.url);
    } catch (error) {
      alert("Error al subir el archivo.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  async function onSubmit(values: FormValues) {
    setCargando(true);
    const res = await registrarRenaseAction({ 
      ...values, 
      evento_id: evento.id,
      usuario_id: servidorSeleccionado?.usuario_id,
      servidor_id: servidorSeleccionado?.servidor_id
    });
    setCargando(false);
    if (res.success) setPaso("EXITO");
    else alert("Error: " + res.error);
  }

  if (paso === "EXITO") {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-white dark:bg-[#1a1b26] rounded-[50px] shadow-2xl border border-emerald-100 dark:border-emerald-900/30">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black tracking-tight dark:text-white">¡Registro RENASE Completado!</h2>
        <p className="text-slate-500 mt-4 text-lg">
          Tus datos de itinerario y perfil han sido guardados. Nos vemos pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {paso === "BUSCADOR" && (
        <div className="bg-white dark:bg-[#1a1b26] p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-100 dark:border-[#2a2b3d] text-center">
          <ShieldCheck className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Bienvenido a RENASE</h2>
          <p className="text-slate-500 mb-8">Digita tu nombre completo para buscarte en el catálogo de servidores.</p>
          
          <div className="flex items-center gap-2 max-w-md mx-auto mb-8">
            <Input 
              placeholder="Tu nombre completo..." 
              value={termBusqueda} 
              onChange={e => setTermBusqueda(e.target.value)}
              className="h-12 dark:bg-[#0f1015] dark:border-[#2a2b3d]"
            />
            <Button onClick={buscarServidor} disabled={cargando} className="h-12">
               <Search className="w-5 h-5" />
            </Button>
          </div>

          {servidoresEncontrados.length > 0 && (
            <div className="max-w-md mx-auto space-y-2 text-left mb-8">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Resultados:</p>
              {servidoresEncontrados.map(serv => (
                 <button 
                   key={serv.servidor_id} 
                   onClick={() => seleccionarServidor(serv)}
                   className="w-full p-4 border border-slate-200 dark:border-[#2a2b3d] rounded-xl hover:bg-blue-50 dark:hover:bg-[#151621] flex justify-between items-center transition-colors"
                 >
                    <span className="font-bold text-slate-700 dark:text-slate-200">{serv.nombre_completo}</span>
                    <span className="text-xs text-slate-400">{serv.celular}</span>
                 </button>
              ))}
            </div>
          )}

          <div className="pt-8 border-t border-slate-100 dark:border-[#2a2b3d]">
            <p className="text-slate-500 mb-4 text-sm">¿No apareces en la lista?</p>
            <Button variant="outline" onClick={nuevoServidor} className="dark:text-slate-300">
               Crea tu registro de servidor
            </Button>
          </div>
        </div>
      )}

      {paso === "CAPTURA" && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
           {/* SECCION 1: ITINERARIO */}
           <div className="bg-white dark:bg-[#1a1b26] p-8 rounded-[30px] shadow-xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Tu Itinerario de Viaje</h3>
                    <p className="text-slate-500 text-sm">Información para logística de recepción y despedida.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Fecha y Hora Llegada</Label>
                   <Input type="datetime-local" {...form.register("fecha_hora_llegada")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Lugar de Llegada</Label>
                   <Input placeholder="Ej. Aeropuerto Terminal 1" {...form.register("lugar_llegada")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Medio de Transporte</Label>
                   <Input placeholder="Ej. Vuelo Volaris Y4 123" {...form.register("medio_transporte_llegada")} className="dark:bg-[#0f1015]" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Fecha y Hora Salida</Label>
                   <Input type="datetime-local" {...form.register("fecha_hora_salida")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Lugar de Salida</Label>
                   <Input placeholder="Ej. Central de Autobuses" {...form.register("lugar_salida")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Medio de Transporte</Label>
                   <Input placeholder="Ej. Camión ETN" {...form.register("medio_transporte_salida")} className="dark:bg-[#0f1015]" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50 dark:bg-black/20 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Pase de Abordar / Boleto (Opcional)</Label>
                    <div className="flex items-center gap-4">
                       <Button type="button" variant="outline" className="relative overflow-hidden w-full dark:text-slate-300">
                          <input 
                             type="file" 
                             onChange={handleFileUpload} 
                             className="absolute inset-0 opacity-0 cursor-pointer"
                             accept="image/*,.pdf"
                          />
                          <Upload className="w-4 h-4 mr-2" />
                          {subiendoArchivo ? "Subiendo..." : paseUrl ? "Archivo Subido" : "Seleccionar Archivo"}
                       </Button>
                    </div>
                    {paseUrl && <a href={paseUrl} target="_blank" className="text-xs text-blue-600 font-medium hover:underline block mt-2">Ver archivo cargado</a>}
                 </div>
                 
                 <div className="space-y-2">
                   <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-[#2a2b3d] rounded-xl bg-white dark:bg-[#151621] hover:bg-slate-50 transition-colors">
                     <input 
                       type="checkbox" 
                       {...form.register("participa_salida_paseo")}
                       className="w-5 h-5 rounded text-blue-600 dark:bg-[#0f1015]"
                     />
                     <div>
                       <span className="text-sm font-bold block text-slate-800 dark:text-slate-200">Participaré en la salida de paseo</span>
                       <span className="text-xs text-slate-500">Actividad posterior al evento</span>
                     </div>
                   </label>
                 </div>
              </div>
           </div>

           {/* SECCION 2: PERFIL SERVIDOR */}
           <div className="bg-white dark:bg-[#1a1b26] p-8 rounded-[30px] shadow-xl border border-slate-100 dark:border-[#2a2b3d]">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                    <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Tu Perfil de Servidor</h3>
                    <p className="text-slate-500 text-sm">Revisa y actualiza tus datos generales si es necesario.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2 md:col-span-2">
                   <Label className="dark:text-slate-300">Nombre Completo *</Label>
                   <Input {...form.register("nombre_completo")} className="dark:bg-[#0f1015]" />
                   {form.formState.errors.nombre_completo && <p className="text-red-500 text-xs">{form.formState.errors.nombre_completo.message}</p>}
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Nombre Gafete</Label>
                   <Input {...form.register("nombre_gafete")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Celular *</Label>
                   <Input {...form.register("celular")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Correo</Label>
                   <Input type="email" {...form.register("correo")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Sede</Label>
                   <select {...form.register("sede_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                     <option value="">Selecciona tu sede</option>
                     {sedes.map((s: any) => (
                       <option key={s.id} value={s.id}>{s.nombre}</option>
                     ))}
                   </select>
                 </div>
              </div>
           </div>

           <Button disabled={cargando || subiendoArchivo} type="submit" className="w-full h-16 text-lg rounded-2xl font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-xl shadow-blue-500/30 transition-transform hover:scale-[1.02] text-white">
             {cargando ? "Procesando..." : "¡Confirma Tu Participación!"}
           </Button>

        </form>
      )}

    </div>
  );
}
