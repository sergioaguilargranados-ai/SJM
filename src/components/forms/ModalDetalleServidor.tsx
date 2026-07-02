"use client";

import { useState } from "react";
import { X, User, MapPin, Phone, Mail, Building, Briefcase, Calendar, Info, Activity, Share2, AlertTriangle, ScrollText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BotonSubirFoto } from "./BotonSubirFoto";
import { ModalEditarServidor } from "./ModalEditarServidor";
import { eliminarServidorAction } from "@/app/actions/inscripciones";

interface ModalDetalleServidorProps {
  servidor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  esAdmin?: boolean;
}

export function ModalDetalleServidor({ servidor, open, onOpenChange, esAdmin }: ModalDetalleServidorProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!servidor) return null;

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${servidor.nombre_completo}?`)) return;
    
    setIsDeleting(true);
    const res = await eliminarServidorAction(servidor.id);
    setIsDeleting(false);
    
    if (res.success) {
      toast.success("Servidor eliminado exitosamente");
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(res.error || "No se pudo eliminar el servidor");
    }
  };

  const DetailItem = ({ label, value, icon: Icon, span = 1 }: { label: string, value: any, icon?: any, span?: number }) => (
    <div className={`space-y-1 ${span === 2 ? 'col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8e8ea0] text-xs font-bold uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className="text-sm font-medium text-slate-900 dark:text-slate-200">
        {value || <span className="text-slate-400 italic">No especificado</span>}
      </div>
    </div>
  );

  const LongTextItem = ({ label, value, icon: Icon }: { label: string, value: any, icon?: any }) => (
    <div className="space-y-2 mt-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-[#2a2b3d]">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        {label}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
        {value || <span className="text-slate-400 italic">Sin información registrada</span>}
      </div>
    </div>
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-[#3b3c54] flex flex-row items-start gap-4">
           <div className="relative group shrink-0">
             {servidor.foto_perfil_url || servidor.foto_url ? (
               <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-[#3b3c54]">
                 <img src={servidor.foto_perfil_url || servidor.foto_url} alt="Foto" className="w-full h-full object-cover" />
               </div>
             ) : (
               <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-black text-3xl shadow-inner border border-transparent dark:border-[#3b3c54]">
                 {servidor.nombre_completo?.charAt(0) || "U"}
               </div>
             )}
             <div className="absolute -bottom-2 -right-2 scale-75">
               <BotonSubirFoto usuarioId={servidor.usuario_id || servidor.id} />
             </div>
           </div>
           <div className="flex-1 mt-2">
             <DialogTitle className="text-2xl font-black dark:text-white flex items-center gap-3">
               {servidor.nombre_completo}
               {servidor.estatus ? (
                 <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Activo</span>
               ) : (
                 <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Baja</span>
               )}
             </DialogTitle>
             <p className="text-sm text-slate-500 dark:text-[#8e8ea0] font-medium mt-1">ID: {servidor.id}</p>
           </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-8">
            
            {/* Sección: Datos de Contacto */}
            <section>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-[#3b3c54] pb-2 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> Información Principal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DetailItem label="Correo Electrónico" value={servidor.correo} icon={Mail} />
                <DetailItem label="Celular" value={servidor.celular} icon={Phone} />
                <DetailItem label="Tel. Casa/Trabajo" value={servidor.telefono_casa_trabajo} icon={Phone} />
                <DetailItem label="Fecha de Nacimiento" value={formatDate(servidor.fecha_nacimiento)} icon={Calendar} />
              </div>
            </section>

            {/* Sección: Organización */}
            <section>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-[#3b3c54] pb-2 mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-500" /> Datos de SJM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DetailItem label="Sede" value={servidor.sede} icon={MapPin} />
                <DetailItem label="Ministerio" value={servidor.ministerio} icon={Briefcase} />
                <DetailItem label="Cargo" value={servidor.cargo} icon={Activity} />
                <DetailItem label="Avance Servidor" value={servidor.avance_servidor} icon={Info} />
                <DetailItem label="Fecha Ingreso" value={formatDate(servidor.fecha_ingreso)} icon={Calendar} />
                {!servidor.estatus && (
                  <DetailItem label="Fecha Baja" value={formatDate(servidor.fecha_baja)} icon={Calendar} />
                )}
              </div>
            </section>

            {/* Sección: Domicilio */}
            <section>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-[#3b3c54] pb-2 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" /> Domicilio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DetailItem label="Calle y Número" value={servidor.domicilio_calle} span={2} />
                <DetailItem label="Colonia" value={servidor.domicilio_colonia} />
                <DetailItem label="Código Postal" value={servidor.domicilio_cp} />
              </div>
            </section>

            {/* Sección: Emergencia */}
            <section>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-[#3b3c54] pb-2 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-500" /> Contacto de Emergencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DetailItem label="Nombre Contacto" value={servidor.contacto_emergencia} span={2} />
                <DetailItem label="Teléfonos de Emergencia" value={servidor.tels_emergencia || servidor.telefono_emergencia} span={2} />
              </div>
            </section>

            {/* Sección: Redes Sociales */}
            <section>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-[#3b3c54] pb-2 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-500" /> Redes Sociales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <DetailItem label="Facebook" value={servidor.facebook_url} />
                <DetailItem label="Instagram" value={servidor.instagram_url} />
                <DetailItem label="TikTok" value={servidor.tiktok_url} />
                <DetailItem label="YouTube" value={servidor.youtube_url} />
              </div>
            </section>

            {/* Sección: Textos Largos (Retiros y Servicios) */}
            <section className="pb-8">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-[#3b3c54] pb-2 mb-4 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-blue-500" /> Historial de Servicio y Retiros
              </h3>
              <div className="space-y-4">
                <LongTextItem label="Retiros Tomados (Detalle)" value={servidor.retiros_tomados_detalle} />
                <LongTextItem label="Retiros en Otras Comunidades (Detalle)" value={servidor.retiros_externos_detalle} />
                <LongTextItem label="Servicios en SJM" value={servidor.servicios_sjm} />
                <LongTextItem label="Observaciones" value={servidor.observaciones} />
              </div>
            </section>

          </div>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-[#3b3c54] flex justify-between items-center bg-slate-50 dark:bg-[#151621]">
           <div className="flex items-center gap-2">
             <ModalEditarServidor servidorId={servidor.id} />
             {esAdmin && (
               <Button
                 variant="outline"
                 className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-900/50"
                 disabled={isDeleting}
                 onClick={handleDelete}
               >
                 <Trash2 className="w-4 h-4 mr-1.5" />
                 {isDeleting ? "Eliminando..." : "Eliminar"}
               </Button>
             )}
           </div>
           <Button onClick={() => onOpenChange(false)} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 font-bold">
              Cerrar
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
