"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, CheckCircle2, User, Phone, MapPin, Briefcase, CreditCard } from "lucide-react";
import { registrarSolicitudAction } from "@/app/actions/inscripciones";

const formSchema = z.object({
  nombre_asistente: z.string().min(3, "Obligatorio (Como aparecerá en el certificado)"),
  correo: z.string().email("Correo electrónico inválido (Indispensable para plataforma)"),
  telefono_celular: z.string().min(10, "Anota el WhatsApp con código de país"),
  pais_ciudad: z.string().min(2, "Obligatorio"),
  ministerio_actual: z.string().min(3, "Obligatorio (Confirma que perteneces a SJM)"),
  compromiso_pago_99usd: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar el compromiso de pago para inscribirte al Diplomado.",
  }),
});

export function RegistroDiplomadoForm({ eventoId }: { eventoId: string }) {
  const [success, setSuccess] = useState(false);
  const [cargando, setCargando] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      compromiso_pago_99usd: false,
    },
  });

  async function onSubmit(values: any) {
    setCargando(true);
    // Disparamos Backend
    const respuesta = await registrarSolicitudAction({ ...values, eventoId });
    setCargando(false);

    if (respuesta.success) {
      setSuccess(true);
    } else {
      alert("Error: " + respuesta.error);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-3xl shadow-sm mt-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">¡Inscripción Exitosa al Diplomado!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md">
          Hemos recibido tu solicitud. Estaremos en contacto vía WhatsApp al número {form.getValues("telefono_celular")} para instrucciones adicionales y tutorías.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/20 border border-slate-100 dark:border-slate-800">
      
      {/* Header Visual Moderno */}
      <div className="flex flex-col gap-6 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-2xl flex-shrink-0">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Registro: "Diplomatura en Abordaje de la Pornografía"</h1>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Registro especial modalidad On-line. Por favor captura tus datos exactamente como deseas que aparezcan en tu certificado universitario.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* BLOQUE: Datos Identidad y Certificado */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-200">Nombre Completo *</Label>
              <Input placeholder="Como aparecerá en el certificado universitario" {...form.register("nombre_asistente")} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
              {form.formState.errors.nombre_asistente && <p className="text-red-500 text-xs font-medium">{(form.formState.errors.nombre_asistente as any).message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-200">Correo Electrónico *</Label>
              <Input type="email" placeholder="Indispensable para crear tu perfil en la plataforma" {...form.register("correo")} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
              {form.formState.errors.correo && <p className="text-red-500 text-xs font-medium">{(form.formState.errors.correo as any).message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-200">WhatsApp de contacto *</Label>
              <Input placeholder="Para coordinación del grupo y tutorías (incluye cód. país)" {...form.register("telefono_celular")} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
              {form.formState.errors.telefono_celular && <p className="text-red-500 text-xs font-medium">{(form.formState.errors.telefono_celular as any).message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-slate-200">País / Ciudad *</Label>
                <Input placeholder="Ej. México / Monterrey" {...form.register("pais_ciudad")} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                {form.formState.errors.pais_ciudad && <p className="text-red-500 text-xs font-medium">{(form.formState.errors.pais_ciudad as any).message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="dark:text-slate-200">Ministerio o Servicio actual *</Label>
                <Input placeholder="Tu servicio en SJM" {...form.register("ministerio_actual")} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
                {form.formState.errors.ministerio_actual && <p className="text-red-500 text-xs font-medium">{(form.formState.errors.ministerio_actual as any).message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE: Pago */}
        <div className="bg-blue-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-blue-100/50 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <input type="checkbox" id="pago" className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-950 focus:ring-blue-500" {...form.register("compromiso_pago_99usd")} />
            </div>
            <div>
              <label htmlFor="pago" className="font-semibold text-slate-800 dark:text-slate-100 text-sm cursor-pointer">Compromiso de pago</label>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">¿Estás de acuerdo en realizar el pago de <strong className="dark:text-slate-200">99 USD</strong> una vez que completemos el grupo de 30 personas?</p>
              {form.formState.errors.compromiso_pago_99usd && <p className="text-red-500 text-xs font-medium mt-2">{(form.formState.errors.compromiso_pago_99usd as any).message}</p>}
            </div>
          </div>
        </div>

        {/* Submit area */}
        <div className="pt-2 flex justify-end">
          <Button disabled={cargando} type="submit" size="lg" className="w-full px-12 rounded-xl text-base h-12 bg-blue-600 hover:bg-blue-700 dark:text-white shadow-lg shadow-blue-200 dark:shadow-none">
            {cargando ? "Registrando..." : "Enviar Inscripción"}
          </Button>
        </div>
      </form>

    </div>
  );
}
