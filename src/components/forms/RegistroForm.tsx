"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church, CheckCircle2, User, Phone, MapPin, Heart } from "lucide-react";

const formSchema = z.object({
  nombre_asistente: z.string().min(3, "Obligatorio (min 3 caracteres)"),
  edad: z.coerce.number().min(18, "Debes ser mayor de 18 años").max(99),
  sexo: z.enum(["M", "F"]),
  estado_civil: z.string().min(1, "Selecciona tu estado civil"),
  telefono_celular: z.string().min(10, "Anota los 10 dígitos"),
  correo: z.string().email("Correo electrónico inválido"),
  
  es_primera_vez: z.boolean().default(true),
  parroquia_procedencia: z.string().min(3, "Obligatorio"),
  medicinas_requeridas: z.string().optional(),
  
  // Condicionales en caso de matrimonio (se validan lógicamente después)
  esposo_a_nombre: z.string().optional(),
  fecha_boda: z.string().optional(),
});

export function RegistroForm({ eventoId }: { eventoId: string }) {
  const [success, setSuccess] = useState(false);
  const [esMatrimonial, setEsMatrimonial] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      es_primera_vez: true,
      sexo: "M",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Valores enviados:", { ...values, eventoId });
    // TODO: Enviar por Server Action a la BD en la nube (Neon).
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-green-50 border border-green-200 rounded-3xl shadow-sm mt-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-2">¡Inscripción Exitosa!</h2>
        <p className="text-slate-600 mb-6 max-w-md">
          Hemos recibido tu solicitud para el retiro. En breve un servidor se pondrá en contacto contigo usando el número {form.getValues("telefono_celular")}.
        </p>
        <Button onClick={() => setSuccess(false)}>Registrar a otra persona</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      
      {/* Header Visual Moderno */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
        <div className="bg-blue-50 p-4 rounded-2xl flex-shrink-0">
          <Church className="w-10 h-10 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registro General al Evento</h1>
          <p className="text-slate-500 mt-1">Completa tus datos con atención. Los campos marcados con * son obligatorios.</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* BLOQUE: Datos Personales */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold text-slate-800">1. Datos Personales</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nombre Completo *</Label>
              <Input placeholder="Ej. Juan Pérez López" {...form.register("nombre_asistente")} />
              {form.formState.errors.nombre_asistente && <p className="text-red-500 text-xs font-medium">{form.formState.errors.nombre_asistente.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Edad *</Label>
                <Input type="number" placeholder="Años" {...form.register("edad")} />
                {form.formState.errors.edad && <p className="text-red-500 text-xs font-medium">{form.formState.errors.edad.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Sexo *</Label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-sm" {...form.register("sexo")}>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado Civil *</Label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-sm" {...form.register("estado_civil")}>
                <option value="">Selecciona...</option>
                <option value="SOLTERO">Soltero/a</option>
                <option value="CASADO">Casado/a (Iglesia)</option>
                <option value="CIVIL">Casado/a (Civil)</option>
                <option value="UNION_LIBRE">Unión Libre</option>
                <option value="DIVORCIADO">Divorciado/a</option>
                <option value="VIUDO">Viudo/a</option>
              </select>
              {form.formState.errors.estado_civil && <p className="text-red-500 text-xs font-medium">{form.formState.errors.estado_civil.message}</p>}
            </div>
          </div>
        </div>

        {/* BLOQUE: Contacto y Logística */}
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/50">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-bold text-slate-800">2. Contacto e Información SJM</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Teléfono Celular *</Label>
              <Input placeholder="10 dígitos" {...form.register("telefono_celular")} />
              {form.formState.errors.telefono_celular && <p className="text-red-500 text-xs font-medium">{form.formState.errors.telefono_celular.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Correo Electrónico *</Label>
              <Input type="email" placeholder="tucorreo@ejemplo.com" {...form.register("correo")} />
              {form.formState.errors.correo && <p className="text-red-500 text-xs font-medium">{form.formState.errors.correo.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>¿A qué parroquia asistes regularmente? *</Label>
              <Input placeholder="Ej. Parroquia de San Pablo Apóstol" {...form.register("parroquia_procedencia")} />
            </div>

            <div className="space-y-2 md:col-span-2 mt-2">
              <label className="flex items-center space-x-3 cursor-pointer p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-colors">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" {...form.register("es_primera_vez")} />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">¿Es tu primer retiro con SJM?</p>
                  <p className="text-slate-500 text-xs">Marca la casilla si nunca has asistido a un evento o retiro con la comunidad.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* DYNAMIC: Datos Cónyuge (Visual Optional for Demo) */}
        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100/50">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="text-xl font-bold text-slate-800">3. Modalidad Matrimonial</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">Si te registras para un Retiro Matrimonial, por favor llena los datos de tu cónyuge aquí. De lo contrario, puedes ignorarlo.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nombre del Esposo(a)</Label>
              <Input placeholder="Nombre Completo" {...form.register("esposo_a_nombre")} />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Boda Religiosa (Opcional)</Label>
              <Input type="date" {...form.register("fecha_boda")} />
            </div>
          </div>
        </div>

        {/* Submit area */}
        <div className="pt-6 flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto px-12 rounded-xl text-base h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
            Completar Registro
          </Button>
        </div>
      </form>

    </div>
  );
}
