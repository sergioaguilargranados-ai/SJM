"use client";

import { useState } from "react";
import { Upload, FileDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importarEventosAction } from "@/app/actions/importador";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalImportarEventosProps {
  organizacionId: string;
}

export function ModalImportarEventos({ organizacionId }: ModalImportarEventosProps) {
  const [open, setOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCargando(true);
    setResultado(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];
      const res = await importarEventosAction(base64Data, organizacionId);
      setResultado(res);
      setCargando(false);
      if (res.success) {
         setTimeout(() => { if (open) window.location.reload(); }, 2000);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
      >
        <Upload className="w-4 h-4" />
        Importar Excel
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-xl dark:bg-[#1a1b26] dark:border-[#2a2b3d] p-0"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="p-6 border-b border-slate-100 dark:border-[#3b3c54]">
            <DialogTitle className="text-xl font-bold dark:text-white">Carga Masiva de Eventos y Retiros</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
            
            {!resultado && !cargando && (
              <div className="space-y-6">
                {/* Instrucciones de Columnas */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-start gap-4 flex-1">
                        <FileDown className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                           <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-tighter">Preparación de Archivo</p>
                           <p className="text-xs text-emerald-700 dark:text-emerald-300/80 leading-relaxed mt-1">
                              Descarga y llena nuestra plantilla oficial con los datos de cada evento. Asegúrate de escribir exactamente igual los nombres de las sedes y los tipos de retiro.
                           </p>
                        </div>
                     </div>
                     <a 
                        href="/plantilla_eventos.xlsx" 
                        download
                        className="shrink-0 mt-2 sm:mt-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                     >
                        <FileDown className="w-4 h-4" />
                        Descargar Plantilla
                     </a>
                </div>

                {/* Dropzone de Simulado */}
                <label className="border-2 border-dashed border-slate-200 dark:border-[#3b3c54] hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900/30 group">
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <div className="p-4 bg-white dark:bg-[#0f1015] rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                       <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Haz clic para subir tu Excel lleno</p>
                    <p className="text-xs text-slate-400 mt-1">Formatos permitidos: .xlsx, .xls</p>
                </label>
              </div>
            )}

            {cargando && (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Procesando y validando eventos...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Por favor, no cierres esta ventana.</p>
              </div>
            )}

            {resultado && (
              <div className="space-y-6">
                {resultado.success ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">¡Importación Exitosa!</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mb-4">
                      Se han guardado correctamente {resultado.procesados} eventos.
                    </p>
                    {resultado.errores > 0 && (
                      <p className="text-xs text-amber-600 font-medium">
                        Hubo {resultado.errores} filas que no pudieron ser procesadas por errores en los datos (sedes o tipos no encontrados).
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-800 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">Error en la Importación</h4>
                    <p className="text-sm text-red-700 dark:text-red-400/80 mb-4">
                      No se pudo procesar el archivo. Revisa que el formato sea el correcto.
                    </p>
                    <div className="text-xs text-red-600 bg-red-100/50 dark:bg-red-900/50 p-3 rounded-lg text-left w-full break-all">
                      {resultado.error}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => {
                    setOpen(false);
                    if (resultado.success) window.location.reload();
                  }}>
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
