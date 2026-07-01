"use client";

import { TablaConsulta } from "@/components/TablaConsulta";
import { UsersRound, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { asignarEquipoEventoAction } from "@/app/actions/inscripciones";
import { sjmToast } from "@/components/ui/SjmToast";
import { useRouter } from "next/navigation";

export default function EquipoClientView({ datos, eventos, servidores }: { datos: any[], eventos: any[], servidores: any[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [eventoId, setEventoId] = useState("");
  const [servidorId, setServidorId] = useState("");
  const [cargoTexto, setCargoTexto] = useState("");
  const [aportacion, setAportacion] = useState("");

  const handleGuardar = async () => {
    if (!eventoId || !servidorId) {
      sjmToast("Error", "Seleccione evento y servidor", "error");
      return;
    }
    setCargando(true);
    const res = await asignarEquipoEventoAction({
      evento_id: eventoId,
      servidor_id: servidorId,
      cargo_texto: cargoTexto,
      aportacion_economica: aportacion,
      estatus: true
    });
    setCargando(false);
    if (res.success) {
      sjmToast("Éxito", "Asignación guardada", "success");
      setOpen(false);
      router.refresh();
    } else {
      sjmToast("Error", res.error || "No se pudo guardar", "error");
    }
  };

  return (
    <>
      <TablaConsulta
      datos={datos}
      titulo="Equipo Asignado por Evento"
      subtitulo="Control de servidores asignados a cada retiro, con cargo, aportación y estatus."
      icono={<UsersRound className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" />}
      camposFiltro={["servidor_nombre", "cargo", "evento_tipo", "asignaciones"]}
      totalLabel="Total Asignaciones"
      nombrePDF="Reporte_EquipoEventos"
      acciones={
        <Button onClick={() => setOpen(true)} className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4">
          <Plus className="w-3.5 h-3.5 mr-2" /> Nueva Asignación
        </Button>
      }
      columnas={[
        {
          header: "Servidor",
          accessorKey: "servidor_nombre",
          cell: (val: any) => (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-[#2a2b3d] dark:text-slate-300 flex items-center justify-center font-bold text-xs shadow-inner">
                {val?.charAt(0) || "S"}
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{val || "Sin asignar"}</span>
            </div>
          ),
        },
        {
          header: "Evento",
          accessorKey: "evento_tipo",
          cell: (val: any) => (
            <span className="inline-flex bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
              {val || "—"}
            </span>
          ),
        },
        {
          header: "Cargo en Evento",
          accessorKey: "cargo",
          cell: (val: any) => (
            <span className="inline-flex bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded text-[11px] font-bold">
              {val || "Sin cargo"}
            </span>
          ),
        },
        {
          header: "Asignaciones",
          accessorKey: "asignaciones",
          cell: (val: any) => <span className="text-xs text-slate-600 dark:text-slate-300">{val || "—"}</span>,
        },
        {
          header: "Aportación",
          accessorKey: "aportacion_economica",
          halign: "right" as const,
          cell: (val: any) => <span className="font-bold text-emerald-600 dark:text-emerald-400">${Number(val || 0).toLocaleString("es-MX")}</span>,
        },
        {
          header: "Estatus",
          accessorKey: "estatus",
          halign: "center" as const,
          cell: (val: any) => {
            const colores: Record<string, string> = {
              ACTIVO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              CONFIRMADO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              BAJA: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            };
            return (
              <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${colores[val] || "bg-slate-100 text-slate-600"}`}>
                {val || "ACTIVO"}
              </span>
            );
          },
        },
      ]}
    />

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold dark:text-white">Nueva Asignación de Equipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Evento</Label>
            <Select value={eventoId} onValueChange={setEventoId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre_evento || e.tipo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Servidor</Label>
            <Select value={servidorId} onValueChange={setServidorId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un servidor" />
              </SelectTrigger>
              <SelectContent>
                {servidores.map(s => <SelectItem key={s.id} value={s.id}>{s.nombre_completo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cargo en el Evento</Label>
            <Input value={cargoTexto} onChange={e => setCargoTexto(e.target.value)} placeholder="Ej. Coordinador" />
          </div>
          <div className="space-y-2">
            <Label>Aportación ($)</Label>
            <Input type="number" value={aportacion} onChange={e => setAportacion(e.target.value)} placeholder="0" />
          </div>
          <Button className="w-full" onClick={handleGuardar} disabled={cargando}>
            {cargando ? "Guardando..." : "Asignar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
