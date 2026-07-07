"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, CheckCircle2, Search, Plane, ShieldCheck, Upload,
  MapPin, Activity, Share2, ScrollText, Camera, Loader2, Trash2, UserCircle
} from "lucide-react";
import { registrarRenaseAction, buscarServidorPorNombreAction } from "@/app/actions/inscripciones";
import { uploadArchivoAction } from "@/app/actions/upload-foto";

const itinerarioSchema = z.object({
  fecha_hora_llegada: z.string().optional(),
  lugar_llegada: z.string().optional(),
  medio_transporte_llegada: z.string().optional(),
  fecha_hora_salida: z.string().optional(),
  lugar_salida: z.string().optional(),
  medio_transporte_salida: z.string().optional(),
  pase_abordar_url: z.string().optional(),
  participa_salida_paseo: z.boolean().default(false),
  num_cuarto: z.string().optional(),
  equipo: z.string().optional(),
  comparte_cuarto_con: z.string().optional(),
  dificultad_escaleras: z.boolean().default(false),
});

const servidorSchema = z.object({
  nombre_completo: z.string().min(3, "Obligatorio"),
  nombre_gafete: z.string().optional(),
  correo: z.string().email("Inválido").optional().or(z.literal("")),
  celular: z.string().min(10, "Obligatorio"),
  sede_id: z.string().optional(),
  ministerio_id: z.string().optional(),
  cargo_id: z.string().optional(),
  estado_civil: z.string().optional(),
  sexo: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  fecha_ingreso: z.string().optional(),
  avance_servidor: z.string().optional(),
  retiros_tomados: z.coerce.number().optional(),
  observaciones: z.string().optional(),
  fecha_baja: z.string().optional(),
  domicilio_calle: z.string().optional(),
  domicilio_colonia: z.string().optional(),
  domicilio_cp: z.string().optional(),
  contacto_emergencia: z.string().optional(),
  tels_emergencia: z.string().optional(),
  telefono_casa_trabajo: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  tiktok_url: z.string().optional(),
  youtube_url: z.string().optional(),
  retiros_tomados_detalle: z.string().optional(),
  retiros_externos_detalle: z.string().optional(),
  servicios_sjm: z.string().optional(),
  estatus: z.string().default("true"),
  foto_url: z.string().optional(),
});

const formSchema = z.intersection(itinerarioSchema, servidorSchema);
type FormValues = z.infer<typeof formSchema>;

export function RegistroRenaseClient({ evento, sedes, ministerios, cargos }: { evento: any, sedes: any[], ministerios: any[], cargos: any[] }) {
  const [paso, setPaso] = useState<"BUSCADOR" | "CAPTURA" | "EXITO">("BUSCADOR");
  const [cargando, setCargando] = useState(false);
  const [termBusqueda, setTermBusqueda] = useState("");
  const [servidoresEncontrados, setServidoresEncontrados] = useState<any[]>([]);
  const [servidorSeleccionado, setServidorSeleccionado] = useState<any>(null);

  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [paseUrl, setPaseUrl] = useState("");

  const [subiendoFotoPerfil, setSubiendoFotoPerfil] = useState(false);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      participa_salida_paseo: false,
      dificultad_escaleras: false,
    }
  });

  const buscarServidor = async () => {
    if (!termBusqueda || termBusqueda.length < 3) return;
    setCargando(true);
    const res = await buscarServidorPorNombreAction(termBusqueda, evento.id);
    setCargando(false);
    if (res.success && res.data) {
       setServidoresEncontrados(res.data);
    }
  };

  const seleccionarServidor = (serv: any) => {
    setServidorSeleccionado(serv);
    const fotoUrlInicial = serv.foto_url || serv.foto_perfil_url || "";
    setFotoPerfilUrl(fotoUrlInicial);
    
    if (serv.pase_abordar_url) {
      setPaseUrl(serv.pase_abordar_url);
    } else {
      setPaseUrl("");
    }

    form.reset({
       ...form.getValues(),
       nombre_completo: serv.nombre_completo || "",
       correo: serv.correo || "",
       celular: serv.celular || "",
       sede_id: serv.sede_id || "",
       ministerio_id: serv.ministerio_id || "",
       cargo_id: serv.cargo_id || "",
       estado_civil: serv.estado_civil || "",
       sexo: serv.sexo || "",
       fecha_nacimiento: serv.fecha_nacimiento ? serv.fecha_nacimiento.toString().slice(0, 10) : "",
       fecha_ingreso: serv.fecha_ingreso ? serv.fecha_ingreso.toString().slice(0, 10) : "",
       fecha_baja: serv.fecha_baja ? serv.fecha_baja.toString().slice(0, 10) : "",
       avance_servidor: serv.avance_servidor || "",
       retiros_tomados: serv.retiros_tomados || 0,
       observaciones: serv.observaciones || "",
       domicilio_calle: serv.domicilio_calle || "",
       domicilio_colonia: serv.domicilio_colonia || "",
       domicilio_cp: serv.domicilio_cp || "",
       contacto_emergencia: serv.contacto_emergencia || "",
       tels_emergencia: serv.tels_emergencia || "",
       telefono_casa_trabajo: serv.telefono_casa_trabajo || "",
       facebook_url: serv.facebook_url || "",
       instagram_url: serv.instagram_url || "",
       tiktok_url: serv.tiktok_url || "",
       youtube_url: serv.youtube_url || "",
       retiros_tomados_detalle: serv.retiros_tomados_detalle || "",
       retiros_externos_detalle: serv.retiros_externos_detalle || "",
       servicios_sjm: serv.servicios_sjm || "",
       estatus: serv.estatus === false ? "false" : "true",
       foto_url: fotoUrlInicial,
       nombre_gafete: serv.nombre_gafete || "",
       num_cuarto: serv.num_cuarto || "",
       equipo: serv.equipo || "",
       comparte_cuarto_con: serv.comparte_cuarto_con || "",
       dificultad_escaleras: serv.dificultad_escaleras || false,
       participa_salida_paseo: serv.participa_salida_paseo || false,
       fecha_hora_llegada: serv.fecha_hora_llegada ? new Date(serv.fecha_hora_llegada).toISOString().slice(0, 16) : "",
       lugar_llegada: serv.lugar_llegada || "",
       medio_transporte_llegada: serv.medio_transporte_llegada || "",
       fecha_hora_salida: serv.fecha_hora_salida ? new Date(serv.fecha_hora_salida).toISOString().slice(0, 16) : "",
       lugar_salida: serv.lugar_salida || "",
       medio_transporte_salida: serv.medio_transporte_salida || "",
       pase_abordar_url: serv.pase_abordar_url || "",
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
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    
    setSubiendoArchivo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "boletos");
      
      const res = await uploadArchivoAction(formData);
      
      if (res.success && res.url) {
         setPaseUrl(res.url);
         form.setValue("pase_abordar_url", res.url);
      } else {
         alert("Error al subir el archivo: " + res.error);
      }
    } catch (error: any) {
      alert("Error al subir el archivo: " + (error.message || "Error desconocido"));
    } finally {
      setSubiendoArchivo(false);
    }
  };

  const handleSubirFotoPerfil = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    
    setSubiendoFotoPerfil(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "servidores");
      
      const res = await uploadArchivoAction(formData);
      
      if (res.success && res.url) {
         setFotoPerfilUrl(res.url);
         form.setValue("foto_url", res.url);
      } else {
         alert("Error al subir la foto de perfil: " + res.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al subir la foto de perfil.");
    } finally {
      setSubiendoFotoPerfil(false);
    }
  };

  const handleEliminarFotoPerfil = () => {
    if (!confirm("¿Seguro que deseas quitar la foto?")) return;
    setFotoPerfilUrl("");
    form.setValue("foto_url", "");
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
        <div className="mt-10">
          <Button onClick={() => window.location.href = '/'} className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full md:w-auto">
            Aceptar y Volver al Inicio
          </Button>
        </div>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  buscarServidor();
                }
              }}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Número de Cuarto</Label>
                   <Input {...form.register("num_cuarto")} placeholder="Ej. 101, Compartido..." className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Equipo Asignado</Label>
                   <Input {...form.register("equipo")} placeholder="Ej. Equipo 1, Logística..." className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Compartir habitación con (nombre y razón)</Label>
                   <Input {...form.register("comparte_cuarto_con")} placeholder="Ej. Con mi hermana por motivos médicos..." className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2 flex items-center">
                   <label className="flex items-center gap-3 cursor-pointer p-3 w-full border border-slate-200 dark:border-[#2a2b3d] rounded-xl bg-white dark:bg-[#151621] hover:bg-slate-50 transition-colors h-[42px] mt-6">
                     <input 
                       type="checkbox" 
                       {...form.register("dificultad_escaleras")}
                       className="w-5 h-5 rounded text-blue-600 dark:bg-[#0f1015]"
                     />
                     <div>
                       <span className="text-sm font-bold block text-slate-800 dark:text-slate-200">Problema físico para subir escaleras</span>
                     </div>
                   </label>
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

               <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#151621] rounded-xl border border-slate-100 dark:border-[#2a2b3d] mb-8">
                  <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-[#0f1015] shadow-md flex items-center justify-center">
                    {subiendoFotoPerfil ? (
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    ) : fotoPerfilUrl ? (
                      <img src={fotoPerfilUrl} alt="Foto" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-16 h-16 text-slate-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSubirFotoPerfil}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={subiendoFotoPerfil}
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-[10px] font-bold">Cambiar</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">Haz clic en la imagen para subir o actualizar tu foto.</p>
                  {fotoPerfilUrl && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
                      onClick={handleEliminarFotoPerfil}
                      disabled={subiendoFotoPerfil}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Quitar Foto
                    </Button>
                  )}
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
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Ministerio Actual</Label>
                   <select {...form.register("ministerio_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                     <option value="">Selecciona tu ministerio</option>
                     {ministerios.map((m: any) => (
                       <option key={m.id} value={m.id}>{m.nombre}</option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Cargo Actual</Label>
                   <select {...form.register("cargo_id")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                     <option value="">Selecciona tu cargo</option>
                     {cargos.map((c: any) => (
                       <option key={c.id} value={c.id}>{c.nombre}</option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Estado Civil</Label>
                   <select {...form.register("estado_civil")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                     <option value="">Selecciona...</option>
                     <option value="Soltero/a">Soltero/a</option>
                     <option value="Casado/a">Casado/a</option>
                     <option value="Divorciado/a">Divorciado/a</option>
                     <option value="Viudo/a">Viudo/a</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Sexo</Label>
                   <select {...form.register("sexo")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                     <option value="">Selecciona...</option>
                     <option value="Masculino">Masculino</option>
                     <option value="Femenino">Femenino</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Fecha de Nacimiento</Label>
                   <Input type="date" {...form.register("fecha_nacimiento")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Fecha de Ingreso SJM</Label>
                   <Input type="date" {...form.register("fecha_ingreso")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Avance / Nivel</Label>
                   <select {...form.register("avance_servidor")} className="w-full h-10 rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none">
                     <option value="">Selecciona...</option>
                     <option value="SERVIDOR">SERVIDOR</option>
                     <option value="APOYO">APOYO</option>
                     <option value="ASPIRANTE">ASPIRANTE</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <Label className="dark:text-slate-300">Retiros Tomados</Label>
                   <Input type="number" {...form.register("retiros_tomados")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label className="dark:text-slate-300">Observaciones Internas</Label>
                   <textarea {...form.register("observaciones")} placeholder="Notas adicionales sobre el perfil del servidor..." className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none" />
                 </div>
              </div>

              {/* SECCIÓN: DOMICILIO Y EMERGENCIA */}
              <div className="mt-12 mb-8 flex items-center gap-4">
                 <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Domicilio y Contacto de Emergencia</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2 md:col-span-2">
                    <Label className="dark:text-slate-300">Calle y Número</Label>
                    <Input {...form.register("domicilio_calle")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Colonia</Label>
                    <Input {...form.register("domicilio_colonia")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Código Postal</Label>
                    <Input {...form.register("domicilio_cp")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Contacto de Emergencia (Nombre)</Label>
                    <Input {...form.register("contacto_emergencia")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Teléfonos de Emergencia</Label>
                    <Input {...form.register("tels_emergencia")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Teléfono Casa/Trabajo</Label>
                    <Input {...form.register("telefono_casa_trabajo")} className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Fecha de Baja</Label>
                    <Input type="date" {...form.register("fecha_baja")} className="dark:bg-[#0f1015]" />
                 </div>
              </div>

              {/* SECCIÓN: REDES SOCIALES */}
              <div className="mt-12 mb-8 flex items-center gap-4">
                 <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <Share2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Redes Sociales</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Facebook URL</Label>
                    <Input {...form.register("facebook_url")} placeholder="https://facebook.com/..." className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Instagram URL</Label>
                    <Input {...form.register("instagram_url")} placeholder="https://instagram.com/..." className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">TikTok URL</Label>
                    <Input {...form.register("tiktok_url")} placeholder="https://tiktok.com/..." className="dark:bg-[#0f1015]" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">YouTube URL</Label>
                    <Input {...form.register("youtube_url")} placeholder="https://youtube.com/..." className="dark:bg-[#0f1015]" />
                 </div>
              </div>

              {/* SECCIÓN: HISTORIAL DE SERVICIO Y RETIROS */}
              <div className="mt-12 mb-8 flex items-center gap-4">
                 <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <ScrollText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                 </div>
                 <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Historial de Servicio y Retiros</h4>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Retiros SJM Tomados (Detalle)</Label>
                    <textarea {...form.register("retiros_tomados_detalle")} placeholder="Ej. Retiro de Sanación 2019, Matrimonios 2021..." className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Retiros Externos Tomados</Label>
                    <textarea {...form.register("retiros_externos_detalle")} placeholder="Ej. Retiro de Juan Pablo II, Retiro de Emaús..." className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none" />
                 </div>
                 <div className="space-y-2">
                    <Label className="dark:text-slate-300">Historial de Servicios en SJM</Label>
                    <textarea {...form.register("servicios_sjm")} placeholder="Ej. Coordinador de Acogida 2022, Servidor en Alabanza..." className="w-full min-h-[80px] rounded-md border border-slate-300 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm dark:text-white outline-none" />
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
