"use client";

import { useState } from "react";
import { User, CheckCircle2, XCircle, DollarSign, Search, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { asignarEquipoEventoAction } from "@/app/actions/inscripciones";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EquipoClientView({ evento, equipoActual, servidores }: { evento: any, equipoActual: any[], servidores: any[] }) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [servidorSeleccionado, setServidorSeleccionado] = useState<any>(null);
  const [cargando, setCargando] = useState(false);

  // Form states for assignment
  const [cargoTexto, setCargoTexto] = useState("");
  const [asignaciones, setAsignaciones] = useState("");
  const [aportacion, setAportacion] = useState("");
  const [estatus, setEstatus] = useState(true);

  // Filter and sort servers: First those in the same sede as the event
  const servidoresFiltrados = servidores
    .filter(s => 
      s.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) || 
      s.correo?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      // Prioritize same sede
      if (a.sede_id === evento.sede_id && b.sede_id !== evento.sede_id) return -1;
      if (a.sede_id !== evento.sede_id && b.sede_id === evento.sede_id) return 1;
      return a.nombre_completo?.localeCompare(b.nombre_completo);
    });

  const abrirAsignacion = (servidor: any) => {
    const asignacionActual = equipoActual.find(e => e.servidor_id === servidor.id);
    setServidorSeleccionado(servidor);
    setCargoTexto(asignacionActual?.cargo_texto || "");
    setAsignaciones(asignacionActual?.asignaciones || "");
    setAportacion(asignacionActual?.aportacion_economica || "0");
    setEstatus(asignacionActual ? asignacionActual.estatus : true);
  };

  const handleGuardar = async () => {
    if (!servidorSeleccionado) return;
    setCargando(true);
    
    const res = await asignarEquipoEventoAction({
      evento_id: evento.id,
      servidor_id: servidorSeleccionado.id,
      cargo_texto: cargoTexto,
      asignaciones: asignaciones,
      aportacion_economica: aportacion,
      estatus: estatus
    });

    if (res.success) {
      toast.success("Asignación guardada correctamente");
      setServidorSeleccionado(null);
      router.refresh();
    } else {
      toast.error(res.error || "Error al guardar");
    }
    setCargando(false);
  };

  return (
    <div className="space-y-6">
      {/* Resumen del equipo */}
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div>
           <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Equipo Asignado Actualmente: {equipoActual.length}</p>
        </div>
        <div className="relative">
           <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
           <Input 
             placeholder="Buscar servidor para asignar..." 
             className="pl-9 w-64 dark:bg-[#0f1015]"
             value={busqueda}
             onChange={e => setBusqueda(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {servidoresFiltrados.map(serv => {
          const asignacion = equipoActual.find(e => e.servidor_id === serv.id);
          const isSameSede = serv.sede_id === evento.sede_id;

          return (
            <div key={serv.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${asignacion ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/50' : 'bg-white border-slate-200 dark:bg-[#151621] dark:border-[#2a2b3d]'}`} onClick={() => abrirAsignacion(serv)}>
              {serv.foto_url ? (
                 <img src={serv.foto_url} alt="Foto" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
              ) : (
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#2a2b3d] flex items-center justify-center text-lg font-bold text-slate-500">
                    {serv.nombre_completo?.charAt(0)}
                 </div>
              )}
              <div className="flex-1 min-w-0">
                 <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{serv.nombre_completo}</p>
                 <div className="flex items-center gap-1 mt-1 text-[10px] uppercase font-bold text-slate-500">
                   {isSameSede && <span className="text-emerald-600 bg-emerald-100 px-1.5 rounded">Sede Local</span>}
                   {asignacion && <span className="text-blue-600 bg-blue-100 px-1.5 rounded flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Asignado</span>}
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!servidorSeleccionado} onOpenChange={() => setServidorSeleccionado(null)}>
         <DialogContent className="max-w-md dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold dark:text-white">Gestionar Asignación</DialogTitle>
            </DialogHeader>
            {servidorSeleccionado && (
              <div className="space-y-4 py-4">
                 <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#151621] rounded-xl border border-slate-100 dark:border-[#2a2b3d]">
                    {servidorSeleccionado.foto_url ? (
                       <img src={servidorSeleccionado.foto_url} alt="Foto" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                       <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-[#2a2b3d] flex items-center justify-center text-lg font-bold">
                          {servidorSeleccionado.nombre_completo?.charAt(0)}
                       </div>
                    )}
                    <div>
                       <p className="font-bold text-slate-900 dark:text-white">{servidorSeleccionado.nombre_completo}</p>
                       <p className="text-xs text-slate-500">{servidorSeleccionado.correo}</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label>Cargo en el evento (Texto libre)</Label>
                    <Input placeholder="Ej. Coordinador de logística" value={cargoTexto} onChange={e => setCargoTexto(e.target.value)} />
                 </div>

                 <div className="space-y-2">
                    <Label>Asignaciones específicas (Opcional)</Label>
                    <textarea 
                      placeholder="Tareas detalladas..." 
                      value={asignaciones} 
                      onChange={e => setAsignaciones(e.target.value)} 
                      className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-[#0f1015] dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    />
                 </div>

                 <div className="space-y-2">
                    <Label>Aportación Económica</Label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <Input type="number" min="0" step="0.01" className="pl-9" value={aportacion} onChange={e => setAportacion(e.target.value)} />
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-[#2a2b3d] rounded-xl">
                    <div className="space-y-0.5">
                       <Label className="text-sm font-bold">Estatus del Servidor en el Evento</Label>
                       <p className="text-xs text-slate-500">{estatus ? 'Activo (Participará)' : 'Inactivo (No participará)'}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={estatus} onChange={e => setEstatus(e.target.checked)} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                 </div>

                 <Button className="w-full h-12" onClick={handleGuardar} disabled={cargando}>
                    {cargando ? "Guardando..." : "Guardar Asignación"}
                 </Button>
              </div>
            )}
         </DialogContent>
      </Dialog>
    </div>
  );
}
