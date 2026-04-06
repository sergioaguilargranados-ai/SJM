"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

// ============================================================
// Botones reutilizables de Editar y Eliminar para catálogos
// Patrón ERPCubox: Acciones en fila de tabla
// ============================================================

interface CampoEdicion {
  nombre: string;
  label: string;
  tipo?: "text" | "checkbox" | "number" | "url";
}

// --- BOTÓN EDITAR con Modal ---
interface EditarProps {
  titulo: string;
  campos: CampoEdicion[];
  datosActuales: Record<string, any>;
  onSubmit: (id: string, datos: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  id: string;
}

export function BotonEditar({ titulo, campos, datosActuales, onSubmit, id }: EditarProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(datosActuales);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOpen = () => {
    setFormData(datosActuales);
    setOpen(true);
  };

  const handleSubmit = () => {
    setError("");
    startTransition(async () => {
      const result = await onSubmit(id, formData);
      if (result.success) {
        setOpen(false);
        setError("");
        router.refresh();
      } else {
        setError(result.error || "Error al actualizar");
      }
    });
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        title="Editar"
      >
        <Pencil className="w-3.5 h-3.5" />
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
              Modifique los campos necesarios y presione guardar.
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, [campo.nombre]: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 dark:border-[#3b3c54] accent-blue-600 dark:accent-[#e11d48]"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-[#c1c1d1]">{campo.label}</span>
                  </label>
                ) : (
                  <>
                    <Label className="text-slate-700 dark:text-[#c1c1d1]">{campo.label}</Label>
                    <Input
                      type={campo.tipo || "text"}
                      value={formData[campo.nombre] || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [campo.nombre]: e.target.value }))}
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
              onClick={() => { setOpen(false); setError(""); }}
              className="h-9 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-[#3b3c54] rounded-md hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="h-9 px-6 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] rounded-md transition-colors disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- BOTÓN ELIMINAR con Confirmación ---
interface EliminarProps {
  id: string;
  nombre: string;
  onEliminar: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function BotonEliminar({ id, nombre, onEliminar }: EliminarProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEliminar = () => {
    setError("");
    startTransition(async () => {
      const result = await onEliminar(id);
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error || "Error al eliminar");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="bg-white dark:bg-[#1a1b26] border-slate-200 dark:border-[#2a2b3d] text-slate-900 dark:text-white sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600 dark:text-red-400">Confirmar Eliminación</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-[#8e8ea0]">
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300">
                ¿Estás seguro de que deseas eliminar <strong className="text-red-900 dark:text-red-200">"{nombre}"</strong>?
              </p>
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                Si tiene registros vinculados podría fallar la eliminación por integridad referencial.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#2a2b3d]">
            <button
              onClick={() => { setOpen(false); setError(""); }}
              className="h-9 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-[#3b3c54] rounded-md hover:bg-slate-50 dark:hover:bg-[#2a2b3d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEliminar}
              disabled={isPending}
              className="h-9 px-6 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
            >
              {isPending ? "Eliminando..." : "Sí, Eliminar"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
