"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { uploadFotoServidor } from "@/app/actions/upload-foto";
import { toast } from "sonner";

interface BotonSubirFotoProps {
  usuarioId: string;
}

export function BotonSubirFoto({ usuarioId }: BotonSubirFotoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica de tamaño (ej. 5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("usuarioId", usuarioId);

    try {
      const result = await uploadFotoServidor(formData);
      if (result.success) {
        toast.success("Fotografía actualizada exitosamente");
      } else {
        toast.error(result.error || "Error al actualizar la foto");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al subir la foto.");
    } finally {
      setIsUploading(false);
      // Limpiar el input para permitir volver a seleccionar la misma foto si hubo error
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
      
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50"
        title="Actualizar foto"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
        ) : (
          <Camera className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        )}
      </button>
    </div>
  );
}
