"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Save, X, Newspaper, Eye, EyeOff, CalendarDays } from "lucide-react";
import { crearArticuloBlog, actualizarArticuloBlog, eliminarArticuloBlog } from "@/app/actions/contenido";

interface BlogAdminClientViewProps {
  articulos: any[];
  organizacionId: string;
}

export default function BlogAdminClientView({ articulos, organizacionId }: BlogAdminClientViewProps) {
  const [isPending, startTransition] = useTransition();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({ titulo: "", extracto: "", contenido: "", categoria: "", blog_clave: "crecimientos", publicado: false, imagen_portada_url: "" });

  const guardar = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarArticuloBlog(editandoId, form);
      } else {
        await crearArticuloBlog({ ...form, organizacion_id: organizacionId, fecha_publicacion: form.publicado ? new Date() : undefined });
      }
      setModalAbierto(false);
      setEditandoId(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Blog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administra artículos de Crecimientos, Formación y Blog general</p>
        </div>
        <button onClick={() => { setForm({ titulo: "", extracto: "", contenido: "", categoria: "", blog_clave: "crecimientos", publicado: false, imagen_portada_url: "" }); setEditandoId(null); setModalAbierto(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
          <Plus className="w-4 h-4" /> Nuevo Artículo
        </button>
      </div>

      {articulos.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
          <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay artículos aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articulos.map((a) => (
            <div key={a.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${a.publicado ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-[#2a2b3d] dark:text-slate-400"}`}>
                    {a.publicado ? "Publicado" : "Borrador"}
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-bold uppercase">{a.blog_clave}</span>
                  {a.categoria && <span className="text-[9px] text-slate-400">{a.categoria}</span>}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{a.titulo}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.extracto}</p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> {a.fecha_publicacion ? new Date(a.fecha_publicacion).toLocaleDateString("es-MX") : "Sin fecha"}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startTransition(() => actualizarArticuloBlog(a.id, { publicado: !a.publicado, fecha_publicacion: !a.publicado ? new Date() : null }))} className="p-1.5 text-slate-400 hover:text-green-600">
                  {a.publicado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => { setForm({ titulo: a.titulo, extracto: a.extracto || "", contenido: a.contenido || "", categoria: a.categoria || "", blog_clave: a.blog_clave || "crecimientos", publicado: a.publicado, imagen_portada_url: a.imagen_portada_url || "" }); setEditandoId(a.id); setModalAbierto(true); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => startTransition(() => eliminarArticuloBlog(a.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(false)}>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a2b3d]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editandoId ? "Editar" : "Nuevo"} Artículo</h2>
              <button onClick={() => setModalAbierto(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">Blog</label><select value={form.blog_clave} onChange={(e) => setForm({...form, blog_clave: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm"><option value="crecimientos">Crecimientos</option><option value="formacion">Formación</option><option value="general">Blog General</option></select></div>
                <div><label className="block text-xs font-bold mb-1">Categoría</label><input type="text" value={form.categoria} onChange={(e) => setForm({...form, categoria: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" placeholder="Ej: Espiritualidad" /></div>
              </div>
              <div><label className="block text-xs font-bold mb-1">Título</label><input type="text" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Extracto</label><textarea rows={2} value={form.extracto} onChange={(e) => setForm({...form, extracto: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" /></div>
              <div><label className="block text-xs font-bold mb-1">Contenido</label><textarea rows={8} value={form.contenido} onChange={(e) => setForm({...form, contenido: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none font-mono" /></div>
              <div><label className="block text-xs font-bold mb-1">URL Imagen Portada</label><input type="url" value={form.imagen_portada_url} onChange={(e) => setForm({...form, imagen_portada_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" /></div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer"><input type="checkbox" checked={form.publicado} onChange={(e) => setForm({...form, publicado: e.target.checked})} /> Publicar inmediatamente</label>
              <button onClick={guardar} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold disabled:opacity-50"><Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar Artículo"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
