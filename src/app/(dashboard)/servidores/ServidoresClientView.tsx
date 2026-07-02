"use client";

import { useState } from "react";
import { TablaConsulta } from "@/components/TablaConsulta";
import { ShieldCheck, Eye, MapPin, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ModalCrearServidor } from "@/components/forms/ModalCrearServidor";
import { ModalImportarServidores } from "@/components/forms/ModalImportarServidores";
import { ModalDetalleServidor } from "@/components/forms/ModalDetalleServidor";
import { BotonSubirFoto } from "@/components/forms/BotonSubirFoto";

export default function ServidoresClientView({ servidores, sedes, ministerios = [], cargos = [], estados = [], sedeId, organizacionId }: {
  servidores: any[];
  sedes: any[];
  ministerios?: any[];
  cargos?: any[];
  estados?: any[];
  sedeId: string;
  organizacionId: string;
  esAdmin?: boolean;
}) {
  const [servidorSeleccionado, setServidorSeleccionado] = useState<any>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const verDetalle = (servidor: any) => {
    setServidorSeleccionado(servidor);
    setModalAbierto(true);
  };

  return (
    <>
      <TablaConsulta
      datos={servidores}
      titulo="Catálogo de Servidores"
      subtitulo="Organización y administración del capital humano de la comunidad."
      icono={<ShieldCheck className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["nombre_completo", "correo", "celular", "sede"]}
      totalLabel="Total Activos"
      nombrePDF="Padron_Servidores"
      acciones={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <ModalImportarServidores sedeId={sedeId} organizacionId={organizacionId} />
          <ModalCrearServidor 
            sedes={sedes} 
            ministerios={ministerios} 
            cargos={cargos} 
            estados={estados} 
          />
        </div>
      }
      renderCard={(row) => (
        <div key={row.id} className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative group">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <BotonSubirFoto usuarioId={row.usuario_id || row.id} />
            <button
              onClick={() => verDetalle(row)}
              className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              title="Ver detalle completo"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
             {row.foto_perfil_url ? (
               <img src={row.foto_perfil_url} alt="Foto" className="w-12 h-12 rounded-full object-cover shadow-inner shrink-0" />
             ) : (
               <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-[#2a2b3d] text-blue-700 dark:text-slate-300 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                 {row.nombre_completo?.charAt(0) || "U"}
               </div>
             )}
             <div>
               <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{row.nombre_completo || "Usuario Sin Nombre"}</h3>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-mono text-slate-500 dark:text-[#8e8ea0] bg-slate-100 dark:bg-[#2a2b3d] px-1.5 py-0.5 rounded">ID: {row.id?.substring(0, 5)}</span>
                 {row.estatus ? (
                   <span className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Activo</span>
                 ) : (
                   <span className="text-[9px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Baja</span>
                 )}
               </div>
             </div>
          </div>
          
          <div className="space-y-2 mt-auto">
             <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
               <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
               <span className="truncate">{row.correo || "Sin correo"}</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
               <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
               <span>{row.celular || "Sin celular"}</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
               <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
               <span className="font-semibold text-slate-700 dark:text-slate-300">{row.sede}</span>
             </div>
          </div>
        </div>
      )}
      columnas={[
        {
          header: "Gafete / Identidad",
          accessorKey: "nombre_completo",
          pdfKey: "nombre_completo",
          cell: (val: any, row: any) => (
            <div className="flex items-center gap-3">
              {row.foto_perfil_url ? (
                <img src={row.foto_perfil_url} alt="Foto" className="w-9 h-9 rounded-full object-cover shadow-inner shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 dark:bg-[#2a2b3d] dark:text-slate-300 flex items-center justify-center font-bold shadow-inner shrink-0">
                  {val?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900 dark:text-white leading-none">{val || "Usuario Sin Nombre"}</div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-[#8e8ea0] mt-1">ID: {row.id?.substring(0, 8)}</div>
              </div>
            </div>
          ),
        },
        {
          header: "Contacto Directo",
          accessorKey: "celular",
          cell: (val: any, row: any) => (
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200">{val || "Sin teléfono"}</div>
              <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">{row.correo}</div>
            </div>
          ),
        },
        {
          header: "Sede / Ingreso",
          accessorKey: "sede",
          cell: (val: any, row: any) => (
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{val}</div>
              <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">
                Ingreso: {row.fecha_ingreso ? format(new Date(row.fecha_ingreso), "dd MMM yyyy", { locale: es }) : "No Especificado"}
              </div>
            </div>
          ),
        },
        {
          header: "Estatus",
          accessorKey: "estatus",
          halign: "center" as const,
          cell: (val: any) =>
            val ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activo
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Baja
              </span>
            ),
        },
        {
          header: "Acciones",
          accessorKey: "id",
          ocultarEnUI: false, // It's visible in UI
          halign: "center" as const,
          cell: (val: any, row: any) => (
            <div className="flex items-center justify-center gap-2">
              <div className="scale-75 origin-center">
                <BotonSubirFoto usuarioId={row.usuario_id || row.id} />
              </div>
              <button
                onClick={() => verDetalle(row)}
                className="p-1.5 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                title="Ver detalle completo"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ),
        },
      ]}
    />
    <ModalDetalleServidor 
      servidor={servidorSeleccionado}
      open={modalAbierto}
      onOpenChange={setModalAbierto}
      esAdmin={esAdmin}
    />
    </>
  );
}
