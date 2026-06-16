"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, Phone, MapPin, Church, Heart, Baby, 
  ChevronRight, ChevronLeft, CheckCircle2, Info,
  Stethoscope, Cross, Sparkles, FileText, ShieldCheck
} from "lucide-react";
import { registrarSolicitudAction } from "@/app/actions/inscripciones";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  // Paso 1: Identidad
  nombre_asistente: z.string().min(3, "Nombre es obligatorio"),
  nombre_gafete: z.string().optional(),
  sexo: z.enum(["M", "F"]),
  fecha_nacimiento: z.string().optional(),
  edad: z.coerce.number().min(0).max(120),
  estado_civil: z.string().min(1, "Selecciona estado civil"),
  
  // Paso 2: Contacto y Ubicación
  telefono_celular: z.string().min(10, "WhatsApp es obligatorio"),
  telefono_alternativo: z.string().optional(),
  correo: z.string().email("Correo inválido"),
  direccion_completa: z.string().optional(),
  pais_ciudad: z.string().min(2, "Ciudad/País es obligatorio"),
  contacto_emergencia_nombre: z.string().min(3, "Contacto emergencia es obligatorio"),
  contacto_emergencia_telefono: z.string().min(10, "Teléfono emergencia es obligatorio"),
  parentezco_emergencia: z.string().optional(),

  // Paso 3: Espiritualidad y Salud
  parroquia_procedencia: z.string().optional(),
  ultimo_sacramento: z.string().optional(),
  expectativas: z.string().optional(),
  dificultad_caminar: z.boolean().default(false),
  enfermedades_alergias: z.string().optional(),
  
  // Paso 4: Matrimonial (Condicional)
  esposo_a_nombre: z.string().optional(),
  fecha_boda: z.string().optional(),
  cantidad_hijos: z.coerce.number().optional(),
  datos_hijos: z.string().optional(),
  // Paso 4/5: Legal / Responsiva
  acepta_responsiva: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la carta responsiva para continuar",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistroForm({ eventoId, esMatrimonial = false }: { eventoId: string, esMatrimonial?: boolean }) {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);
  const totalSteps = esMatrimonial ? 5 : 4; // Subimos un paso por la responsiva

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      sexo: "M",
      edad: 0,
      dificultad_caminar: false,
      acepta_responsiva: false,
    }
  });

  const nextStep = async () => {
    // Validar campos del paso actual antes de avanzar
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(s => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const getFieldsForStep = (currentStep: number) => {
    if (currentStep === 1) return ["nombre_asistente", "sexo", "estado_civil", "edad"];
    if (currentStep === 2) return ["telefono_celular", "correo", "pais_ciudad", "contacto_emergencia_nombre", "contacto_emergencia_telefono"];
    if (currentStep === 3 && !esMatrimonial) return []; // El paso 3 es espiritualidad
    if (currentStep === 4 && esMatrimonial) return ["esposo_a_nombre"]; // El paso 4 es matrimonial
    return [];
  };

  async function onSubmit(values: FormValues) {
    setCargando(true);
    const res = await registrarSolicitudAction({ ...values, eventoId });
    setCargando(false);
    if (res.success) setSuccess(true);
    else alert("Error: " + res.error);
  }


  if (success) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-white dark:bg-[#1a1b26] rounded-[50px] shadow-2xl border border-emerald-100 dark:border-emerald-900/30 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">¡Registro Recibido!</h2>
        <p className="text-slate-500 dark:text-[#8e8ea0] mt-4 text-lg leading-relaxed">
          Gloria a Dios por tu sí. Un servidor de la comunidad de **SJM** se pondrá en contacto contigo muy pronto por WhatsApp.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-10 h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
          Registrar a alguien más
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Indicador de Pasos */}
      <div className="flex justify-between mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-[#2a2b3d] -translate-y-1/2 z-0"></div>
        {[...Array(totalSteps)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all duration-500 border-4 shadow-sm",
              step > i + 1 ? "bg-emerald-500 border-emerald-100 text-white" : 
              step === i + 1 ? "bg-blue-600 border-blue-100 text-white scale-125" : 
              "bg-white dark:bg-[#1a1b26] border-slate-100 dark:border-[#2a2b3d] text-slate-400"
            )}
          >
            {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1a1b26] p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-100 dark:border-[#2a2b3d] relative overflow-hidden transition-all">
        {/* Adornos visuales */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Identidad del Discípulo</h3>
                  <p className="text-slate-500 text-sm">Cuéntanos sobre ti para preparar tu lugar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Nombre Completo *</Label>
                  <Input placeholder="Tal como aparece en tu identificación" {...form.register("nombre_asistente")} className="h-12 rounded-xl" />
                  {form.formState.errors.nombre_asistente && <p className="text-red-500 text-[10px] font-bold uppercase">{form.formState.errors.nombre_asistente.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Nombre para Gafete</Label>
                  <Input placeholder="¿Cómo te gusta que te digan?" {...form.register("nombre_gafete")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Nacimiento</Label>
                  <Input type="date" {...form.register("fecha_nacimiento")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Sexo *</Label>
                  <select {...form.register("sexo")} className="w-full h-12 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-transparent px-4 font-medium text-sm">
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Estado Civil *</Label>
                  <select {...form.register("estado_civil")} className="w-full h-12 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-transparent px-4 font-medium text-sm">
                    <option value="">Selecciona...</option>
                    <option value="SOLTERO">Soltero/a</option>
                    <option value="CASADO">Casado/a (Iglesia)</option>
                    <option value="CIVIL">Casado/a (Solo Civil)</option>
                    <option value="UNION_LIBRE">Unión Libre</option>
                    <option value="VIUDO">Viudo/a</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                  <Phone className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Contacto y Cercanía</h3>
                  <p className="text-slate-500 text-sm">¿Cómo podemos estar en comunicación contigo?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>WhatsApp (Celular) *</Label>
                  <Input placeholder="Incluye código de país" {...form.register("telefono_celular")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Correo Electrónico *</Label>
                  <Input type="email" placeholder="tu@correo.com" {...form.register("correo")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>País / Ciudad de residencia *</Label>
                  <Input placeholder="Ej. México / Ciudad de México" {...form.register("pais_ciudad")} className="h-12 rounded-xl" />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t border-slate-50 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Caso de Emergencia</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Nombre del Contacto" {...form.register("contacto_emergencia_nombre")} className="h-12 rounded-xl" />
                    <Input placeholder="Teléfono" {...form.register("contacto_emergencia_telefono")} className="h-12 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <Cross className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Vida Espiritual y Salud</h3>
                  <p className="text-slate-500 text-sm">Datos para servirte mejor durante el retiro.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>Parroquia a la que asistes</Label>
                  <Input placeholder="Nombre de tu parroquia" {...form.register("parroquia_procedencia")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>¿Qué esperas de este retiro? (Expectativas)</Label>
                  <textarea {...form.register("expectativas")} className="w-full h-24 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-transparent p-4 text-sm" placeholder="Cuéntanos brevemente..."></textarea>
                </div>

                <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-4">
                  <Stethoscope className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                  <div className="flex-1">
                    <Label className="text-rose-900 dark:text-rose-200">Anotaciones Médicas / Alergias</Label>
                    <Input placeholder="Medicinas, dietas especiales, etc." {...form.register("enfermedades_alergias")} className="h-10 mt-2 rounded-lg bg-white/50 border-rose-200" />
                    <div className="flex items-center gap-2 mt-3 cursor-pointer">
                      <input type="checkbox" id="caminar" {...form.register("dificultad_caminar")} className="w-4 h-4 rounded border-rose-300" />
                      <label htmlFor="caminar" className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase">Tengo dificultad para caminar</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && esMatrimonial && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl">
                  <Heart className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Corazón Matrimonial</h3>
                  <p className="text-slate-500 text-sm">Información de tu cónyuge y familia.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Nombre Completo del Cónyuge *</Label>
                  <Input placeholder="Nombre de tu esposo(a)" {...form.register("esposo_a_nombre")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Boda Religiosa</Label>
                  <Input type="date" {...form.register("fecha_boda")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Número de Hijos</Label>
                  <Input type="number" {...form.register("cantidad_hijos")} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Nombres y edades de los hijos</Label>
                  <textarea {...form.register("datos_hijos")} className="w-full h-20 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-transparent p-4 text-sm" placeholder="Ej: Juan (12), María (8)..."></textarea>
                </div>
              </div>
            </div>
          )}


          {step === totalSteps && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <ShieldCheck className="w-8 h-8 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Carta Responsiva</h3>
                  <p className="text-slate-500 text-sm">Deslinde de responsabilidades y compromiso SJM.</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-[#2a2b3d] overflow-hidden">
                <div className="p-6 md:p-8 max-h-[350px] overflow-y-auto text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-serif text-justify space-y-4">
                  <p className="font-bold text-center text-slate-800 dark:text-slate-200 uppercase mb-4">CARTA DE DESLINDE DE RESPONSABILIDAD Y COMPROMISO</p>
                  
                  <p>Por medio de la presente, yo, el participante registrado, declaro que asisto al retiro organizado por <strong>Servidores de Jesús por María (SJM)</strong> por mi propia voluntad y bajo mi total responsabilidad.</p>
                  
                  <p>Reconozco que el retiro es un evento de carácter espiritual y formativo, y que la comunidad SJM no se hace responsable por accidentes, pérdidas materiales o situaciones de salud preexistentes que pudieran manifestarse durante el desarrollo del mismo, siempre que no sean causadas por negligencia directa de la organización.</p>
                  
                  <p>Me comprometo a seguir las normas de convivencia, horarios y recomendaciones de seguridad proporcionadas por los servidores coordinadores. Asimismo, autorizo a SJM a brindarme atención de primeros auxilios en caso de ser necesario o coordinar mi traslado a un centro médico si la situación lo requiere, notificando de inmediato a mi contacto de emergencia.</p>
                  
                  <p><strong>Uso de Imagen:</strong> Autorizo a SJM el uso de fotografías o videos captados durante el evento con fines estrictamente testimoniales o de difusión de la obra, respetando siempre el decoro y la privacidad cristiana.</p>

                  <div className="pt-4 border-t border-slate-200 dark:border-[#2a2b3d] text-center italic">
                    "Todo lo puedo en Aquel que me fortalece" (Flp 4,13)
                  </div>
                </div>
                
                <div className="bg-slate-100 dark:bg-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="acepta_responsiva" 
                        {...form.register("acepta_responsiva")}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <label htmlFor="acepta_responsiva" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        HE LEÍDO Y ACEPTO LOS TÉRMINOS
                      </label>
                   </div>
                   <button 
                     type="button" 
                     className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                     onClick={() => window.print()}
                   >
                     <FileText className="w-3 h-3" /> Descargar para mis archivos
                   </button>
                </div>
              </div>
              {form.formState.errors.acepta_responsiva && (
                <p className="text-red-500 text-xs font-bold text-center uppercase tracking-tighter">Debes marcar la casilla para poder enviar tu solicitud</p>
              )}
            </div>
          )}

          {/* Navegación de Pasos */}

          <div className="pt-8 flex flex-col sm:flex-row gap-4 border-t border-slate-50 dark:border-white/5">
            {step > 1 && (
              <Button 
                type="button" 
                onClick={prevStep} 
                variant="outline" 
                className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 dark:border-[#2a2b3d] hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
              </Button>
            )}
            
            {step < totalSteps ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none"
              >
                Siguiente Paso <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={cargando}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none"
              >
                {cargando ? "Guardando..." : "Completar mi Inscripción"} <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
