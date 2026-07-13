"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Image as ImageIcon, X } from "lucide-react";
import { uploadArchivoAction } from "@/app/actions/upload-foto";
import { toast } from "sonner";
import Image from "next/image";

interface BotonSubirCartelProps {
  onUploadSuccess: (url: string) => void;
  imagenActual?: string | null;
}

export function BotonSubirCartel({ onUploadSuccess, imagenActual }: BotonSubirCartelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(imagenActual || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    setIsUploading(true);
    
    // Preview local temporal
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "carteles_eventos");

    try {
      const result = await uploadArchivoAction(formData);
      if (result.success && result.url) {
        toast.success("Cartel subido exitosamente");
        setPreview(result.url); // Set the real URL
        onUploadSuccess(result.url);
      } else {
        toast.error(result.error || "Error al subir el cartel");
        setPreview(imagenActual || null); // Revert
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al subir la foto.");
      setPreview(imagenActual || null); // Revert
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess("");
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
      
      {preview ? (
        <div className="relative w-full max-w-[200px] h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-[#2a2b3d] bg-slate-50 dark:bg-[#0f1015] group">
          <Image 
            src={preview} 
            alt="Cartel del evento" 
            fill 
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm"
              title="Cambiar cartel"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); handleRemove(); }}
              className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-sm"
              title="Quitar cartel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}
          className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-[#2a2b3d] rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#151621] transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8" />
              <span className="text-sm font-medium">Subir Imagen del Cartel (Max 5MB)</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
