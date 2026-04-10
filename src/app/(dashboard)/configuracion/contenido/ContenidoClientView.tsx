"use client";

import { useState, useTransition } from "react";
import {
  Plus, Edit2, Trash2, Save, X, Eye, EyeOff, ChevronDown, ChevronRight,
  Palette, MessageCircle, HelpCircle, Phone, Users, FileText, Image as ImageIcon,
  Star, Settings
} from "lucide-react";
import {
  crearSeccionContenido, actualizarSeccionContenido, eliminarSeccionContenido,
  guardarParametrosLanding,
  crearTestimonio, aprobarTestimonio, eliminarTestimonio,
  crearFAQ, actualizarFAQ, eliminarFAQ,
  crearTelefono, actualizarTelefono, eliminarTelefono,
  crearResponsable, actualizarResponsable, eliminarResponsable,
} from "@/app/actions/contenido";

// ============================================================
// Admin CMS — Vista de gestión de contenido completa
// ============================================================

const PAGINAS = [
  { clave: "nosotros", nombre: "Nosotros" },
  { clave: "jovenes", nombre: "Jóvenes (ELEMÁ)" },
  { clave: "matrimonios", nombre: "Matrimonios" },
  { clave: "sanacion-interior", nombre: "Sanación Interior" },
  { clave: "mundo-infantil", nombre: "Mundo Infantil" },
  { clave: "llama-de-amor", nombre: "Llama de Amor" },
  { clave: "centros", nombre: "Centros SJM" },
  { clave: "contactanos", nombre: "Contáctanos" },
  { clave: "ayuda", nombre: "Ayuda" },
];

interface ContenidoClientViewProps {
  secciones: any[];
  parametros: any;
  testimonios: any[];
  faq: any[];
  telefonos: any[];
  responsables: any[];
  organizacionId: string;
}

export default function ContenidoClientView({
  secciones, parametros, testimonios: testimoniosInit, faq: faqInit,
  telefonos: telefonosInit, responsables: responsablesInit, organizacionId
}: ContenidoClientViewProps) {
  const [isPending, startTransition] = useTransition();
  const [tabActiva, setTabActiva] = useState("secciones");
  const [paginaFiltro, setPaginaFiltro] = useState("nosotros");
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  // Forms
  const [formSeccion, setFormSeccion] = useState({ pagina_clave: "nosotros", titulo: "", subtitulo: "", contenido: "", autoria: "", orden: 0, tipo: "contenido" });
  const [formTestimonio, setFormTestimonio] = useState({ texto: "", nombre_autor: "", es_anonimo: false, calificacion: 5 });
  const [formFAQ, setFormFAQ] = useState({ pregunta: "", respuesta: "", pagina_clave: "general", orden: 0 });
  const [formTelefono, setFormTelefono] = useState({ tipo: "emergencia", nombre_contacto: "", telefono: "", whatsapp: "", cargo: "", horario: "", orden: 0 });
  const [formResponsable, setFormResponsable] = useState({ nombre: "", cargo: "", correo: "", telefono: "", mensaje_saludo: "", orden: 0 });

  // Parámetros de landing
  const [formParams, setFormParams] = useState({
    color_primario: parametros?.color_primario || "#1E3A5F",
    color_secundario: parametros?.color_secundario || "#00B4AA",
    color_terciario: parametros?.color_terciario || "#E2AB5F",
    cenefa_transparencia: parametros?.cenefa_transparencia || 70,
    footer_color_inicio: parametros?.footer_color_inicio || "#000000",
    footer_color_fin: parametros?.footer_color_fin || "#374151",
    carrusel_velocidad: parametros?.carrusel_velocidad || 5000,
    whatsapp_qr_url: parametros?.whatsapp_qr_url || "",
    google_maps_url: parametros?.google_maps_url || "",
    video_principal_url: parametros?.video_principal_url || "",
  });

  const tabs = [
    { id: "secciones", nombre: "Secciones", icono: FileText, count: secciones.length },
    { id: "parametros", nombre: "Branding", icono: Palette, count: 0 },
    { id: "testimonios", nombre: "Testimonios", icono: Star, count: testimoniosInit.length },
    { id: "faq", nombre: "FAQ", icono: HelpCircle, count: faqInit.length },
    { id: "telefonos", nombre: "Teléfonos", icono: Phone, count: telefonosInit.length },
    { id: "responsables", nombre: "Equipo", icono: Users, count: responsablesInit.length },
  ];

  const guardarSeccion = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarSeccionContenido(editandoId, formSeccion);
      } else {
        await crearSeccionContenido({ ...formSeccion, organizacion_id: organizacionId });
      }
      setModalAbierto(null);
      setEditandoId(null);
    });
  };

  const guardarParams = () => {
    startTransition(async () => {
      await guardarParametrosLanding(organizacionId, formParams);
    });
  };

  const guardarTestimonioNuevo = () => {
    startTransition(async () => {
      await crearTestimonio({ ...formTestimonio, organizacion_id: organizacionId });
      setModalAbierto(null);
      setFormTestimonio({ texto: "", nombre_autor: "", es_anonimo: false, calificacion: 5 });
    });
  };

  const guardarFAQNueva = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarFAQ(editandoId, formFAQ);
      } else {
        await crearFAQ({ ...formFAQ, organizacion_id: organizacionId });
      }
      setModalAbierto(null);
      setEditandoId(null);
    });
  };

  const guardarTelefonoNuevo = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarTelefono(editandoId, formTelefono);
      } else {
        await crearTelefono({ ...formTelefono, organizacion_id: organizacionId });
      }
      setModalAbierto(null);
      setEditandoId(null);
    });
  };

  const guardarResponsableNuevo = () => {
    startTransition(async () => {
      if (editandoId) {
        await actualizarResponsable(editandoId, formResponsable);
      } else {
        await crearResponsable({ ...formResponsable, organizacion_id: organizacionId });
      }
      setModalAbierto(null);
      setEditandoId(null);
    });
  };

  const seccionesFiltradas = secciones.filter(s => s.pagina_clave === paginaFiltro);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Contenido del Sitio Web</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administra secciones, testimonios, FAQ y configuración visual</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-[#2a2b3d] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tabActiva === tab.id
                ? "bg-[#00B4AA] text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2a2b3d]"
            }`}
          >
            <tab.icono className="w-4 h-4" />
            {tab.nombre}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tabActiva === tab.id ? "bg-white/20" : "bg-slate-200 dark:bg-[#2a2b3d] text-slate-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== TAB: SECCIONES ===== */}
      {tabActiva === "secciones" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <select
              value={paginaFiltro}
              onChange={(e) => setPaginaFiltro(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#1a1b26] text-sm text-slate-700 dark:text-slate-300"
            >
              {PAGINAS.map((p) => (
                <option key={p.clave} value={p.clave}>{p.nombre}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setFormSeccion({ pagina_clave: paginaFiltro, titulo: "", subtitulo: "", contenido: "", autoria: "", orden: seccionesFiltradas.length + 1, tipo: "contenido" });
                setEditandoId(null);
                setModalAbierto("seccion");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#00B4AA] text-white rounded-lg text-sm font-bold hover:bg-[#009990] transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva Sección
            </button>
          </div>

          {seccionesFiltradas.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No hay secciones configuradas para esta página</p>
              <p className="text-xs text-slate-400 mt-1">Haz clic en &quot;Nueva Sección&quot; para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {seccionesFiltradas.map((seccion, idx) => (
                <div key={seccion.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#2a2b3d] flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {seccion.orden || idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{seccion.titulo || "(Sin título)"}</h3>
                    {seccion.subtitulo && <p className="text-xs text-[#00B4AA] font-medium">{seccion.subtitulo}</p>}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{seccion.contenido}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${seccion.estatus ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}>
                      {seccion.estatus ? "Activo" : "Inactivo"}
                    </span>
                    <button
                      onClick={() => {
                        setFormSeccion({
                          pagina_clave: seccion.pagina_clave, titulo: seccion.titulo || "", subtitulo: seccion.subtitulo || "",
                          contenido: seccion.contenido || "", autoria: seccion.autoria || "", orden: seccion.orden || 0, tipo: seccion.tipo || "contenido"
                        });
                        setEditandoId(seccion.id);
                        setModalAbierto("seccion");
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startTransition(() => eliminarSeccionContenido(seccion.id))}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== TAB: BRANDING ===== */}
      {tabActiva === "parametros" && (
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#00B4AA]" /> Configuración Visual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colores */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Color Primario</label>
              <div className="flex items-center gap-3">
                <input type="color" value={formParams.color_primario} onChange={(e) => setFormParams({...formParams, color_primario: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={formParams.color_primario} onChange={(e) => setFormParams({...formParams, color_primario: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Color Secundario</label>
              <div className="flex items-center gap-3">
                <input type="color" value={formParams.color_secundario} onChange={(e) => setFormParams({...formParams, color_secundario: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={formParams.color_secundario} onChange={(e) => setFormParams({...formParams, color_secundario: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Color Terciario</label>
              <div className="flex items-center gap-3">
                <input type="color" value={formParams.color_terciario} onChange={(e) => setFormParams({...formParams, color_terciario: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
                <input type="text" value={formParams.color_terciario} onChange={(e) => setFormParams({...formParams, color_terciario: e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
              </div>
            </div>
          </div>

          {/* Cenefa y Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Transparencia Cenefa ({formParams.cenefa_transparencia}%)</label>
              <input type="range" min={0} max={100} value={formParams.cenefa_transparencia} onChange={(e) => setFormParams({...formParams, cenefa_transparencia: parseInt(e.target.value)})} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Footer Inicio</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={formParams.footer_color_inicio} onChange={(e) => setFormParams({...formParams, footer_color_inicio: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={formParams.footer_color_inicio} onChange={(e) => setFormParams({...formParams, footer_color_inicio: e.target.value})} className="flex-1 px-2 py-1.5 rounded border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Footer Fin</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={formParams.footer_color_fin} onChange={(e) => setFormParams({...formParams, footer_color_fin: e.target.value})} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={formParams.footer_color_fin} onChange={(e) => setFormParams({...formParams, footer_color_fin: e.target.value})} className="flex-1 px-2 py-1.5 rounded border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Video Principal (YouTube URL)</label>
              <input type="url" value={formParams.video_principal_url} onChange={(e) => setFormParams({...formParams, video_principal_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Google Maps URL</label>
              <input type="url" value={formParams.google_maps_url} onChange={(e) => setFormParams({...formParams, google_maps_url: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" placeholder="https://maps.google.com/..." />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={guardarParams} disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 bg-[#00B4AA] text-white rounded-lg text-sm font-bold hover:bg-[#009990] disabled:opacity-50 transition-all">
              <Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </div>
      )}

      {/* ===== TAB: TESTIMONIOS ===== */}
      {tabActiva === "testimonios" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setModalAbierto("testimonio")} className="flex items-center gap-2 px-4 py-2 bg-[#00B4AA] text-white rounded-lg text-sm font-bold">
              <Plus className="w-4 h-4" /> Nuevo Testimonio
            </button>
          </div>
          <div className="space-y-3">
            {testimoniosInit.map((t) => (
              <div key={t.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">&ldquo;{t.texto}&rdquo;</p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">{t.es_anonimo ? "Anónimo" : t.nombre_autor}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startTransition(() => aprobarTestimonio(t.id, !t.aprobado))}
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase cursor-pointer ${t.aprobado ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}`}
                  >
                    {t.aprobado ? "Aprobado" : "Pendiente"}
                  </button>
                  <button onClick={() => startTransition(() => eliminarTestimonio(t.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB: FAQ ===== */}
      {tabActiva === "faq" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setFormFAQ({ pregunta: "", respuesta: "", pagina_clave: "general", orden: faqInit.length + 1 }); setEditandoId(null); setModalAbierto("faq"); }} className="flex items-center gap-2 px-4 py-2 bg-[#00B4AA] text-white rounded-lg text-sm font-bold">
              <Plus className="w-4 h-4" /> Nueva Pregunta
            </button>
          </div>
          <div className="space-y-3">
            {faqInit.map((f) => (
              <div key={f.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{f.pregunta}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.respuesta}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => { setFormFAQ({ pregunta: f.pregunta, respuesta: f.respuesta, pagina_clave: f.pagina_clave || "general", orden: f.orden || 0 }); setEditandoId(f.id); setModalAbierto("faq"); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => startTransition(() => eliminarFAQ(f.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB: TELÉFONOS ===== */}
      {tabActiva === "telefonos" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setFormTelefono({ tipo: "emergencia", nombre_contacto: "", telefono: "", whatsapp: "", cargo: "", horario: "", orden: telefonosInit.length + 1 }); setEditandoId(null); setModalAbierto("telefono"); }} className="flex items-center gap-2 px-4 py-2 bg-[#00B4AA] text-white rounded-lg text-sm font-bold">
              <Plus className="w-4 h-4" /> Nuevo Teléfono
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {telefonosInit.map((t) => (
              <div key={t.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-4 flex items-start gap-4">
                <Phone className="w-8 h-8 text-green-500 shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{t.nombre_contacto || "Sin nombre"}</p>
                  <p className="text-xs text-slate-500">{t.cargo} · {t.tipo}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">📞 {t.telefono} {t.whatsapp && `· 💬 ${t.whatsapp}`}</p>
                  {t.horario && <p className="text-[10px] text-slate-400 mt-0.5">🕐 {t.horario}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setFormTelefono({ tipo: t.tipo || "emergencia", nombre_contacto: t.nombre_contacto || "", telefono: t.telefono || "", whatsapp: t.whatsapp || "", cargo: t.cargo || "", horario: t.horario || "", orden: t.orden || 0 }); setEditandoId(t.id); setModalAbierto("telefono"); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => startTransition(() => eliminarTelefono(t.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB: RESPONSABLES ===== */}
      {tabActiva === "responsables" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setFormResponsable({ nombre: "", cargo: "", correo: "", telefono: "", mensaje_saludo: "", orden: responsablesInit.length + 1 }); setEditandoId(null); setModalAbierto("responsable"); }} className="flex items-center gap-2 px-4 py-2 bg-[#00B4AA] text-white rounded-lg text-sm font-bold">
              <Plus className="w-4 h-4" /> Nuevo Responsable
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responsablesInit.map((r) => (
              <div key={r.id} className="bg-white dark:bg-[#1a1b26] rounded-xl border border-slate-200 dark:border-[#2a2b3d] p-5 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00B4AA] to-[#1E3A5F] flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                  {r.nombre?.[0]?.toUpperCase()}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{r.nombre}</h3>
                <p className="text-xs text-[#00B4AA] font-medium">{r.cargo}</p>
                {r.correo && <p className="text-[10px] text-slate-400 mt-1">{r.correo}</p>}
                <div className="flex items-center justify-center gap-1 mt-3">
                  <button onClick={() => { setFormResponsable({ nombre: r.nombre || "", cargo: r.cargo || "", correo: r.correo || "", telefono: r.telefono || "", mensaje_saludo: r.mensaje_saludo || "", orden: r.orden || 0 }); setEditandoId(r.id); setModalAbierto("responsable"); }} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => startTransition(() => eliminarResponsable(r.id))} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MODALES ===== */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(null)}>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#2a2b3d] w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#2a2b3d]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {modalAbierto === "seccion" && (editandoId ? "Editar Sección" : "Nueva Sección")}
                {modalAbierto === "testimonio" && "Nuevo Testimonio"}
                {modalAbierto === "faq" && (editandoId ? "Editar FAQ" : "Nueva Pregunta Frecuente")}
                {modalAbierto === "telefono" && (editandoId ? "Editar Teléfono" : "Nuevo Teléfono")}
                {modalAbierto === "responsable" && (editandoId ? "Editar Responsable" : "Nuevo Responsable")}
              </h2>
              <button onClick={() => setModalAbierto(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Modal Sección */}
              {modalAbierto === "seccion" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Página</label>
                      <select value={formSeccion.pagina_clave} onChange={(e) => setFormSeccion({...formSeccion, pagina_clave: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm">
                        {PAGINAS.map(p => <option key={p.clave} value={p.clave}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Orden</label>
                      <input type="number" value={formSeccion.orden} onChange={(e) => setFormSeccion({...formSeccion, orden: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título</label>
                    <input type="text" value={formSeccion.titulo} onChange={(e) => setFormSeccion({...formSeccion, titulo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtítulo</label>
                    <input type="text" value={formSeccion.subtitulo} onChange={(e) => setFormSeccion({...formSeccion, subtitulo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contenido</label>
                    <textarea rows={5} value={formSeccion.contenido} onChange={(e) => setFormSeccion({...formSeccion, contenido: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Autoría / Fuente</label>
                    <input type="text" value={formSeccion.autoria} onChange={(e) => setFormSeccion({...formSeccion, autoria: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                  </div>
                  <button onClick={guardarSeccion} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00B4AA] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar Sección"}
                  </button>
                </>
              )}

              {/* Modal Testimonio */}
              {modalAbierto === "testimonio" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Testimonio</label>
                    <textarea rows={4} value={formTestimonio.texto} onChange={(e) => setFormTestimonio({...formTestimonio, texto: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input type="checkbox" checked={formTestimonio.es_anonimo} onChange={(e) => setFormTestimonio({...formTestimonio, es_anonimo: e.target.checked})} /> Anónimo
                    </label>
                  </div>
                  {!formTestimonio.es_anonimo && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del autor</label>
                      <input type="text" value={formTestimonio.nombre_autor} onChange={(e) => setFormTestimonio({...formTestimonio, nombre_autor: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                  )}
                  <button onClick={guardarTestimonioNuevo} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00B4AA] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar Testimonio"}
                  </button>
                </>
              )}

              {/* Modal FAQ */}
              {modalAbierto === "faq" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pregunta</label>
                    <input type="text" value={formFAQ.pregunta} onChange={(e) => setFormFAQ({...formFAQ, pregunta: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Respuesta</label>
                    <textarea rows={4} value={formFAQ.respuesta} onChange={(e) => setFormFAQ({...formFAQ, respuesta: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" />
                  </div>
                  <button onClick={guardarFAQNueva} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00B4AA] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar"}
                  </button>
                </>
              )}

              {/* Modal Teléfono */}
              {modalAbierto === "telefono" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                      <select value={formTelefono.tipo} onChange={(e) => setFormTelefono({...formTelefono, tipo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm">
                        <option value="emergencia">Emergencia</option>
                        <option value="administrativo">Administrativo</option>
                        <option value="pastoral">Pastoral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                      <input type="text" value={formTelefono.nombre_contacto} onChange={(e) => setFormTelefono({...formTelefono, nombre_contacto: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                      <input type="tel" value={formTelefono.telefono} onChange={(e) => setFormTelefono({...formTelefono, telefono: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp</label>
                      <input type="tel" value={formTelefono.whatsapp} onChange={(e) => setFormTelefono({...formTelefono, whatsapp: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cargo</label>
                      <input type="text" value={formTelefono.cargo} onChange={(e) => setFormTelefono({...formTelefono, cargo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Horario</label>
                      <input type="text" value={formTelefono.horario} onChange={(e) => setFormTelefono({...formTelefono, horario: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" placeholder="Lun-Vie 9am-6pm" />
                    </div>
                  </div>
                  <button onClick={guardarTelefonoNuevo} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00B4AA] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar"}
                  </button>
                </>
              )}

              {/* Modal Responsable */}
              {modalAbierto === "responsable" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                    <input type="text" value={formResponsable.nombre} onChange={(e) => setFormResponsable({...formResponsable, nombre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cargo</label>
                      <input type="text" value={formResponsable.cargo} onChange={(e) => setFormResponsable({...formResponsable, cargo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo</label>
                      <input type="email" value={formResponsable.correo} onChange={(e) => setFormResponsable({...formResponsable, correo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mensaje de Saludo</label>
                    <textarea rows={3} value={formResponsable.mensaje_saludo} onChange={(e) => setFormResponsable({...formResponsable, mensaje_saludo: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-sm resize-none" />
                  </div>
                  <button onClick={guardarResponsableNuevo} disabled={isPending} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00B4AA] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                    <Save className="w-4 h-4" /> {isPending ? "Guardando..." : "Guardar"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
