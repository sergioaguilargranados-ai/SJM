"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Save, X, Music, Video, Headphones, MonitorPlay } from "lucide-react";
import { crearMedia, actualizarMedia, eliminarMedia } from "@/app/actions/contenido";

interface MediaAdminClientViewProps {
  media: any[];
  organizacionId: string;
}

export default function MediaAdminClientView({ media, organizacionId }: MediaAdminClientViewProps) {
  const [isPending, startTransition] = useTransition();
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({ tipo: "musica", titulo: "", descripcion: "", url_contenido: "", imagen_miniatura_url: "", duracion: "", artista_autor: "", categoria: "", orden: 0 });

  const mediaFiltrada = filtroTipo === "todos" ? media : media.filter(m => m.tipo === filtroTipo);
  const iconoTipo: Record<string, React.ReactNode> = { musica: <Music className="w-5 h-5 text-purple-500" />, podcast: <Headphones className="w-5 h-5 text-blue-500" />, video: <Video className="w-5 h-5 text-red-500" /> };

  const guardar = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarMedia(editandoId, form);
      } else {
        await crearMedia({ ...form, organizacion_id: organizacionId });
      }
      setModalAbierto(false);
      setEditandoId(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Multimedia</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Música, Podcasts y Videos</p>
        </div>
        <button onClick={() => { setForm({ tipo: "musica", titulo: "", descripcion: "", url_contenido: "", imagen_miniatura_url: "", duracion: "", artista_autor: "", categoria: "", orden: media.length + 1 }); setEditandoId(null); setModalAbierto(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">
          <Plus className="w-4 h-4" /> Nuevo Contenido
        </button>
      </div>

      <div className="flex gap-2">
        {[{ id: "todos", nombre: "Todos" }, { id: "musica", nombre: "Música" }, { id: "podcast", nombre: "Podcasts" }, { id: "video", nombre: "Videos" }].map(t => (
          <button key={t.id} onClick={() => setFiltroTipo(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filtroTipo === t.id ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d]"}`}>
            {t.nombre}
          </button>
        ))}
      </div>

      {mediaFiltrada.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
          <MonitorPlay className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay contenido multimedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaFiltrada.map((m) => (
            <div key={m.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden hover:shadow-lg transition-all">
              <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2a2b3d] dark:to-[#1a1b26] flex items-center justify-center">
                {m.imagen_miniatura_url ? <img src={m.imagen_miniatura_url} alt={m.titulo} className="h-full w-full object-cover" /> : iconoTipo[m.tipo] || <MonitorPlay className="w-8 h-8 text-slate-300" />}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${m.tipo === "musica" ? "bg-purple-100 text-purple-700" : m.tipo === "podcast" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{m.tipo}</span>
                  {m.duracion && <span className="text-[10px] text-slate-400">{m.duracion}</span>}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{m.titulo}</h3>
                {m.artista_autor && <p className="text-xs text-slate-500">{m.artista_autor}</p>}
                <div className="flex justify-end gap-1 mt-3">
                  <button onClick={() => { setForm({ tipo: m.tipo, titulo: m.titulo, descripcion: m.descripcion || "", url_contenido: m.url_contenido, imagen_miniatura_url: m.imagen_miniatura_url || "", duracion: m.duracion || "", artista_autor: m.artista_autor || "", categoria: m.categoria || "", orden: m.orden || 0 }); setEditandoId(m.id); setModalAbierto(true); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => startTransition(() => eliminarMedia(m.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(false)}>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a2b3d]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editandoId ? "Editar" : "Nuevo"} Contenido</h2>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">Tipo</label><select value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm"><option value="musica">Música</option><option value="podcast">Podcast</option><option value="video">Video</option></select></div>
                <div><label className="block text-xs font-bold mb-1">Duración</label><input type="text" value={form.duracion} onChange={(e) => setForm({...form, duracion: e.target.value})} placeholder="3:45" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              </div>
              <div><label className="block text-xs font-bold mb-1">Título</label><input type="text" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Artista / Autor</label><input type="text" value={form.artista_autor} onChange={(e) => setForm({...form, artista_autor: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">URL del Contenido (YouTube, Spotify, etc.)</label><input type="url" value={form.url_contenido} onChange={(e) => setForm({...form, url_contenido: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">URL Miniatura</label><input type="url" value={form.imagen_miniatura_url} onChange={(e) => setForm({...form, imagen_miniatura_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Descripción</label><textarea rows={3} value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" /></div>
              <button onClick={guardar} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
