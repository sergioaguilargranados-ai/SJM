"use client";\r\n\r\nimport { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2, User, Mail, Phone, Building2, Plane, CalendarDays } from "lucide-react";
import { registrarLeadAction } from "@/app/actions/leads";

function RegistroLeadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoQuery = searchParams?.get("tipo"); // viajero, agencia_viajes, agencia_eventos, empresa
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    tipo_lead: "viajero",
  });

  useEffect(() => {
    if (tipoQuery) {
      if (["viajero", "agencia_viajes", "agencia_eventos", "empresa"].includes(tipoQuery)) {
        setForm(prev => ({ ...prev, tipo_lead: tipoQuery }));
      }
    }
  }, [tipoQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const resultado = await registrarLeadAction({
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      tipo_lead: form.tipo_lead,
    });

    setIsLoading(false);

    if (!resultado.ok) {
      setError(resultado.error || "Error al registrar.");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)] relative overflow-hidden">
        <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-4">¡Registro Exitoso!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Hemos recibido tu información. En breve nos pondremos en contacto contigo y te hemos enviado un correo de confirmación.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)] font-sans relative overflow-hidden">
      <div className="w-full max-w-[480px] z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden">
          
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="font-serif text-4xl font-black tracking-tighter mb-4">AS</span>
            <h1 className="text-2xl font-bold font-serif mb-2">Comienza tu registro</h1>
            <p className="text-sm text-gray-500">Completa tus datos y nuestro equipo te contactará para validar tu perfil.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de Perfil */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-gray-500">Tipo de Perfil</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo_lead: "viajero" })}
                  className={`flex items-center gap-2 p-3 border rounded-lg text-sm transition-colors ${form.tipo_lead === "viajero" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  <User className="w-4 h-4" /> Viajero
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo_lead: "agencia_viajes" })}
                  className={`flex items-center gap-2 p-3 border rounded-lg text-sm transition-colors ${form.tipo_lead === "agencia_viajes" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  <Plane className="w-4 h-4" /> Agencia de Viajes
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo_lead: "agencia_eventos" })}
                  className={`flex items-center gap-2 p-3 border rounded-lg text-sm transition-colors ${form.tipo_lead === "agencia_eventos" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  <CalendarDays className="w-4 h-4" /> Agencia Eventos
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo_lead: "empresa" })}
                  className={`flex items-center gap-2 p-3 border rounded-lg text-sm transition-colors ${form.tipo_lead === "empresa" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  <Building2 className="w-4 h-4" /> Empresa
                </button>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-xs font-bold uppercase text-gray-500">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="nombre"
                  placeholder="Ej. Juan Pérez"
                  className="pl-10 h-12 bg-[var(--surface)] border-[var(--card-border)]"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo" className="text-xs font-bold uppercase text-gray-500">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  className="pl-10 h-12 bg-[var(--surface)] border-[var(--card-border)]"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-xs font-bold uppercase text-gray-500">Celular / Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="10 dígitos"
                  className="pl-10 h-12 bg-[var(--surface)] border-[var(--card-border)]"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider text-xs hover:opacity-80 rounded-none transition-all mt-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Solicitud"}
            </Button>

            <div className="text-center mt-6">
              <Link href="/" className="inline-flex items-center text-xs text-gray-500 hover:text-black dark:hover:text-white uppercase font-bold tracking-wide">
                <ArrowLeft className="w-3 h-3 mr-2" /> Volver al inicio
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}


export default function RegistroLeadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>}>
      <RegistroLeadContent />
    </Suspense>
  );
}
