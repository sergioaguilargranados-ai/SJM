"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

// ============================================================
// Modal reutilizable para dar de alta registros en catálogos simples
// Patrón ERPCubox: backdrop cerrado, solo se cierra con Cancelar/éxito
// ============================================================

interface CampoFormulario {
  nombre: string;
  label: string;
  tipo?: "text" | "checkbox" | "number" | "url";
  requerido?: boolean;
  placeholder?: string;
}

interface Props {
  titulo: string;
  campos: CampoFormulario[];
  onSubmit: (datos: any) => Promise<{ success: boolean; error?: string; id?: string }>;
  textoBoton?: string;
  datosExtra?: Record<string, any>; // Datos fijos que se envían junto con el formulario
}

export function ModalCatalogo({ titulo, campos, onSubmit, textoBoton = "Nuevo", datosExtra = {} }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (nombre: string, valor: any) => {
    setFormData((prev) => ({ ...prev, [nombre]: valor }));
  };

  const handleSubmit = () => {
    setError("");
    const datosFinales = { ...formData, ...datosExtra };

    // Validar requeridos
    for (const campo of campos) {
      if (campo.requerido && !datosFinales[campo.nombre]) {
        setError(`El campo "${campo.label}" es obligatorio.`);
        return;
      }
    }

    startTransition(async () => {
      const result = await onSubmit(datosFinales);
      if (result.success) {
        setOpen(false);
        setFormData({});
        setError("");
        router.refresh();
      } else {
        setError(result.error || "Error al guardar");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-4 flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] rounded-md transition-colors shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" /> {textoBoton}
      </button>

      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="bg-white dark:bg-[#1a1b26] border-slate-200 dark:border-[#2a2b3d] text-slate-900 dark:text-white sm:max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{titulo}</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-[#8e8ea0]">
              Complete los campos y presione guardar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {campos.map((campo) => (
              <div key={campo.nombre} className="space-y-2">
                {campo.tipo === "checkbox" ? (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData[campo.nombre]}
                      onChange={(e) => handleChange(campo.nombre, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 dark:border-[#3b3c54] accent-blue-600 dark:accent-[#e11d48]"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-[#c1c1d1]">{campo.label}</span>
                  </label>
                ) : (
                  <>
                    <Label className="text-slate-700 dark:text-[#c1c1d1]">
                      {campo.label} {campo.requerido && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      type={campo.tipo || "text"}
                      value={formData[campo.nombre] || ""}
                      onChange={(e) => handleChange(campo.nombre, campo.tipo === "number" ? e.target.value : e.target.value)}
                      placeholder={campo.placeholder || ""}
                      className="bg-white dark:bg-[#0f1015] border-slate-300 dark:border-[#2a2b3d] text-slate-900 dark:text-white"
                    />
                  </>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#2a2b3d]">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setFormData({});
                setError("");
              }}
              className="h-9 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#3b3c54] rounded-md hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="h-9 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] rounded-md transition-colors disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
