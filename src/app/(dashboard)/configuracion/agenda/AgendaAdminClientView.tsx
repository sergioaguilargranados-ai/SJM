"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Save, X, Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";
import { crearRetiroAgenda, actualizarRetiroAgenda, eliminarRetiroAgenda } from "@/app/actions/contenido";

interface AgendaAdminClientViewProps {
  retiros: any[];
  tiposEvento: any[];
  sedes: any[];
  casasRetiro: any[];
  organizacionId: string;
}

export default function AgendaAdminClientView({ retiros, tiposEvento, sedes, casasRetiro, organizacionId }: AgendaAdminClientViewProps) {
  const [isPending, startTransition] = useTransition();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre_evento: "", tipo_evento_id: "", sede_id: "", fecha_inicio: "", fecha_fin: "", hora_entrada: "", hora_salida: "", cupo_maximo: 0, costo: "", descripcion: "" });

  const guardar = () => {
    startTransition(async () => {
      const datos = {
        ...form,
        organizacion_id: organizacionId,
        fecha_inicio: form.fecha_inicio ? new Date(form.fecha_inicio) : undefined,
        fecha_fin: form.fecha_fin ? new Date(form.fecha_fin) : undefined,
        cupo_maximo: form.cupo_maximo || undefined,
      };
      if (editandoId) {
        await actualizarRetiroAgenda(editandoId, datos);
      } else {
        await crearRetiroAgenda(datos as any);
      }
      setModalAbierto(false);
      setEditandoId(null);
    });
  };

  const formatFecha = (fecha: any) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Agenda de Retiros</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Programa retiros y eventos públicos que se mostrarán en la página</p>
        </div>
        <button onClick={() => { setForm({ nombre_evento: "", tipo_evento_id: tiposEvento[0]?.id || "", sede_id: "", fecha_inicio: "", fecha_fin: "", hora_entrada: "16:00", hora_salida: "14:00", cupo_maximo: 50, costo: "", descripcion: "" }); setEditandoId(null); setModalAbierto(true); }} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold">
          <Plus className="w-4 h-4" /> Nuevo Retiro
        </button>
      </div>

      {retiros.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay retiros programados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {retiros.map((r) => (
            <div key={r.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-5 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Fecha visual */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
                  <span className="text-[10px] font-bold uppercase">{r.fecha_inicio ? new Date(r.fecha_inicio).toLocaleDateString("es-MX", { month: "short" }) : "TBD"}</span>
                  <span className="text-xl font-black leading-none">{r.fecha_inicio ? new Date(r.fecha_inicio).getDate() : "?"}</span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{r.nombre_evento}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {r.tipo_evento && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.tipo_evento}</span>}
                    {r.sede_nombre && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.sede_nombre}</span>}
                    {r.cupo_maximo && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Cupo: {r.cupo_maximo}</span>}
                    {r.costo && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> ${r.costo}</span>}
                    {r.hora_entrada && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.hora_entrada} - {r.hora_salida}</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{formatFecha(r.fecha_inicio)} → {formatFecha(r.fecha_fin)}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${r.estatus === "programado" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : r.estatus === "en_curso" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {r.estatus}
                  </span>
                  <button onClick={() => {
                    setForm({
                      nombre_evento: r.nombre_evento, tipo_evento_id: r.tipo_evento_id || "", sede_id: r.sede_id || "",
                      fecha_inicio: r.fecha_inicio ? new Date(r.fecha_inicio).toISOString().split("T")[0] : "",
                      fecha_fin: r.fecha_fin ? new Date(r.fecha_fin).toISOString().split("T")[0] : "",
                      hora_entrada: r.hora_entrada || "", hora_salida: r.hora_salida || "",
                      cupo_maximo: r.cupo_maximo || 0, costo: r.costo || "", descripcion: r.descripcion || ""
                    });
                    setEditandoId(r.id);
                    setModalAbierto(true);
                  }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => startTransition(() => eliminarRetiroAgenda(r.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(false)}>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a2b3d]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editandoId ? "Editar" : "Nuevo"} Retiro</h2>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-bold mb-1">Nombre del Evento</label><input type="text" value={form.nombre_evento} onChange={(e) => setForm({...form, nombre_evento: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">Tipo de Evento</label><select value={form.tipo_evento_id} onChange={(e) => setForm({...form, tipo_evento_id: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm">{tiposEvento.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></div>
                <div><label className="block text-xs font-bold mb-1">Sede</label><select value={form.sede_id} onChange={(e) => setForm({...form, sede_id: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm"><option value="">Sin sede</option>{sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">Fecha Inicio</label><input type="date" value={form.fecha_inicio} onChange={(e) => setForm({...form, fecha_inicio: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                <div><label className="block text-xs font-bold mb-1">Fecha Fin</label><input type="date" value={form.fecha_fin} onChange={(e) => setForm({...form, fecha_fin: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs font-bold mb-1">Entrada</label><input type="time" value={form.hora_entrada} onChange={(e) => setForm({...form, hora_entrada: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                <div><label className="block text-xs font-bold mb-1">Salida</label><input type="time" value={form.hora_salida} onChange={(e) => setForm({...form, hora_salida: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
                <div><label className="block text-xs font-bold mb-1">Cupo</label><input type="number" value={form.cupo_maximo} onChange={(e) => setForm({...form, cupo_maximo: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              </div>
              <div><label className="block text-xs font-bold mb-1">Costo</label><input type="text" value={form.costo} onChange={(e) => setForm({...form, costo: e.target.value})} placeholder="Ej: 1,500.00" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Descripción</label><textarea rows={3} value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" /></div>
              <button onClick={guardar} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar Retiro"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
