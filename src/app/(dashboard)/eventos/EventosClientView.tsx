"use client";

import { useState } from "react";
import { TablaConsulta } from "@/components/TablaConsulta";
import { CalendarDays, MapPin, Users, ChevronRight, Edit, Trash2, ShieldCheck, Target } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ModalCrearEvento } from "@/components/forms/ModalCrearEvento";
import NuevoEventoForm from "@/components/forms/NuevoEventoForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { eliminarEventoAction } from "@/app/actions/inscripciones";
import { useRouter } from "next/navigation";
import { ModalImportarEventos } from "@/components/forms/ModalImportarEventos";

export default function EventosClientView({ eventos, sedes, casas, tipos, isAdmin, organizacionId }: {
  eventos: any[];
  sedes: any[];
  casas: any[];
  tipos: any[];
  isAdmin: boolean;
  organizacionId: string;
}) {
  const router = useRouter();
  const [eventoEditando, setEventoEditando] = useState<any>(null);
  
  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    
    const res = await eliminarEventoAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  };

  const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");

  return (
    <>
      <TablaConsulta
        datos={eventos}
        titulo="Gestión de Retiros y Eventos"
        subtitulo="Planificación operativa y financiera de la obra."
        icono={<CalendarDays className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
        camposFiltro={["tipo", "casa", "estatus"]}
        totalLabel="Retiros Programados"
        nombrePDF="Reporte_Eventos"
        filaVacia={
          <div className="py-20 text-center">
             <Target className="w-12 h-12 text-slate-300 dark:text-[#3b3c54] mx-auto mb-4" />
             <p className="text-slate-600 dark:text-slate-400 font-medium">No hay retiros programados próximamente.</p>
          </div>
        }
        acciones={
          <div className="flex items-center gap-2">
            <ModalImportarEventos organizacionId={organizacionId} />
            <ModalCrearEvento sedes={sedes} casas={casas} tipos={tipos} />
          </div>
        }
        renderCard={(evt) => (
          <div key={evt.id} className="group bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col border-b-4 border-b-blue-600 dark:border-b-[#e11d48] h-full relative">
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setEventoEditando(evt)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Editar">
                 <Edit className="w-4 h-4" />
               </button>
               {isAdmin && (
                 <button onClick={() => handleEliminar(evt.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Eliminar">
                   <Trash2 className="w-4 h-4" />
                 </button>
               )}
             </div>
             
             <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mt-1",
                     evt.estatus === 'PLANEACION' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                   )}>
                      {evt.estatus}
                   </span>
                </div>

                <div className="space-y-1">
                   <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-[#e11d48] transition-colors">{evt.nombre_evento || evt.tipo}</h3>
                   <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8e8ea0] text-xs">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{evt.casa}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 dark:border-[#2a2b3d]">
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Fecha Inicio</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{evt.fecha_inicio ? format(new Date(evt.fecha_inicio), "dd MMM, yy", { locale: es }) : "TBD"}</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Aportación Sugerida</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${evt.costo || "0"}</p>
                   </div>
                </div>
             </div>

             <Link href={`/eventos/${evt.id}`} className="bg-slate-50 dark:bg-[#151621] p-4 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-[#e11d48] transition-colors mt-auto">
                VER DETALLES OPERATIVOS
                <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
        )}
        columnas={[
          {
            header: "Evento / Retiro",
            accessorKey: "tipo",
            pdfKey: "tipo",
            cell: (val: any, row: any) => (
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{val}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/> {row.casa}</div>
              </div>
            )
          },
          {
            header: "Fecha",
            accessorKey: "fecha_inicio",
            cell: (val: any) => val ? format(new Date(val), "dd MMM yyyy", { locale: es }) : "TBD"
          },
          {
            header: "Aportación",
            accessorKey: "costo",
            cell: (val: any) => <span className="font-bold text-emerald-600">${val || "0"}</span>
          },
          {
            header: "Estatus",
            accessorKey: "estatus",
            halign: "center",
            cell: (val: any) => (
               <span className={cn(
                 "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded inline-block",
                 val === 'PLANEACION' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
               )}>
                  {val}
               </span>
            )
          },
          {
            header: "Acciones",
            accessorKey: "id",
            halign: "right",
            ocultarEnUI: false,
            cell: (val: any, row: any) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/eventos/${row.id}`} className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors" title="Ver Detalles">
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button onClick={() => setEventoEditando(row)} className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                {isAdmin && (
                  <button onClick={() => handleEliminar(row.id)} className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          }
        ]}
      />

      <Dialog open={!!eventoEditando} onOpenChange={(open) => !open && setEventoEditando(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-[#1a1b26] p-0">
          <DialogHeader className="p-6 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-left">Editar Retiro / Evento</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
             {eventoEditando && (
               <NuevoEventoForm 
                 sedes={sedes} 
                 casas={casas} 
                 tipos={tipos}
                 eventoToEdit={eventoEditando}
                 onSuccess={() => {
                   setEventoEditando(null);
                   router.refresh();
                 }} 
                 isModal={true}
               />
             )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
