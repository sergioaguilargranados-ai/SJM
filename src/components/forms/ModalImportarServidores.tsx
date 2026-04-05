"use client";

import { useState } from "react";
import { Upload, FileDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { importarServidoresAction } from "@/app/actions/importador";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalImportarServidoresProps {
  sedeId: string;
  organizacionId: string;
}

export function ModalImportarServidores({ sedeId, organizacionId }: ModalImportarServidoresProps) {
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
      const res = await importarServidoresAction(base64Data, organizacionId, sedeId);
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
        className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#2a2b3d]/50 dark:hover:bg-[#2a2b3d] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#3b3c54] px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
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
            <DialogTitle className="text-xl font-bold dark:text-white">Carga Masiva de Servidores</DialogTitle>
          </DialogHeader>
          
          <div className="p-8 space-y-6">
            
            {!resultado && !cargando && (
              <div className="space-y-6">
                {/* Instrucciones de Columnas */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                   <div className="flex items-start gap-4">
                      <FileDown className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                         <p className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-tighter">Preparación de Archivo</p>
                         <p className="text-xs text-blue-700 dark:text-blue-300/80 leading-relaxed mt-1">
                            Asegúrate que tu archivo .xlsx tenga las columnas: <br />
                            <strong className="block mt-1 font-mono text-[10px] bg-white/50 dark:bg-black/20 p-1 px-2 rounded">
                               Nombre, Correo, Celular, Sexo, EstadoCivil, Avance, FechaIngreso
                            </strong>
                         </p>
                      </div>
                   </div>
                </div>

                {/* Dropzone de Simulado */}
                <label className="border-2 border-dashed border-slate-200 dark:border-[#3b3c54] hover:border-blue-500 dark:hover:border-[#e11d48] rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-900/30 group">
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <div className="p-4 bg-white dark:bg-[#0f1015] rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                       <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-[#e11d48]" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Haz clic para subir tu Excel</p>
                    <p className="text-xs text-slate-400 mt-1">Formatos permitidos: .xlsx, .xls</p>
                </label>
              </div>
            )}

            {cargando && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                 <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Procesando registros de servidores...</p>
                 <p className="text-xs text-slate-400 italic">Esto puede tomar unos segundos dependiendo del tamaño.</p>
              </div>
            )}

            {resultado && (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                 {resultado.success ? (
                   <>
                     <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Importación Completada</h3>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                           <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-[#2a2b3d]">
                              <p className="text-2xl font-black text-emerald-600">{resultado.procesados}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Procesados</p>
                           </div>
                           <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-[#2a2b3d]">
                              <p className="text-2xl font-black text-rose-500">{resultado.errores}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Con errores</p>
                           </div>
                        </div>
                     </div>
                   </>
                 ) : (
                   <>
                      <AlertCircle className="w-12 h-12 text-rose-500" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Error inesperado: {resultado.error}</p>
                   </>
                 )}
                 <Button onClick={() => setOpen(false)} className="mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 h-12 rounded-xl font-bold">
                    Cerrar
                 </Button>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
