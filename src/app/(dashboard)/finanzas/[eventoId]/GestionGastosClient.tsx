"use client";

import { useState } from "react";
import { Plus, Receipt, Trash2, FileText, Calendar, DollarSign, Tag, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { crearGasto, eliminarGasto } from "@/app/actions/finanzas";
import { toast } from "sonner"; // Asumiendo que existe, sino usar alert o toast propio

interface Gasto {
  id: string;
  monto: string;
  descripcion: string | null;
  fecha_gasto: string | null;
  url_comprobante: string | null;
  clasificacion: string | null;
}

export function GestionGastosClient({ 
  eventoId, 
  gastos, 
  clasificaciones 
}: { 
  eventoId: string; 
  gastos: Gasto[]; 
  clasificaciones: any[] 
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clasificacion_id: "",
    monto: "",
    descripcion: "",
    fecha_gasto: new Date().toISOString().split('T')[0],
    url_comprobante: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clasificacion_id || !formData.monto) {
      alert("Favor de completar los campos obligatorios");
      return;
    }

    setLoading(true);
    const res = await crearGasto({
      evento_id: eventoId,
      ...formData
    });

    if (res.success) {
      setShowModal(false);
      setFormData({
        clasificacion_id: "",
        monto: "",
        descripcion: "",
        fecha_gasto: new Date().toISOString().split('T')[0],
        url_comprobante: ""
      });
      // La página se revalidará desde el server action
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este gasto?")) return;
    const res = await eliminarGasto(id, eventoId);
    if (!res.success) alert(res.error);
  };

  return (
    <div className="space-y-6">
      {/* Botón Añadir */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-[#00B4AA] hover:bg-[#00968d] text-white font-bold rounded-2xl h-11 px-6 shadow-lg shadow-[#00B4AA]/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Registrar Gasto
        </Button>
      </div>

      {/* Lista de Gastos */}
      <div className="grid grid-cols-1 gap-4">
        {gastos.length === 0 ? (
          <div className="bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-[#2a2b3d] rounded-[32px] p-12 text-center">
            <Receipt className="w-12 h-12 text-slate-300 dark:text-[#2a2b3d] mx-auto mb-4" />
            <p className="text-slate-500 dark:text-[#8e8ea0] font-medium">No hay gastos registrados aún para este evento.</p>
          </div>
        ) : (
          gastos.map((gasto) => (
            <div key={gasto.id} className="bg-white dark:bg-[#1a1b26] p-5 rounded-[24px] border border-slate-200 dark:border-[#2a2b3d] flex items-center justify-between group hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {gasto.clasificacion || "Sin categoría"}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium mt-0.5 line-clamp-1">
                    {gasto.descripcion || "Sin descripción"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {gasto.fecha_gasto}
                    </span>
                    {gasto.url_comprobante && (
                      <a href={gasto.url_comprobante} target="_blank" className="text-[10px] font-black text-[#00B4AA] hover:underline flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Ver Comprobante
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white">${parseFloat(gasto.monto).toLocaleString()}</span>
                  <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Egresos</p>
                </div>
                <button 
                  onClick={() => handleDelete(gasto.id)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white dark:bg-[#1a1b26] w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#00B4AA]/10 flex items-center justify-center text-[#00B4AA]">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Registrar Gasto</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Añade un nuevo egreso al evento</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                    <div className="relative">
                      <select 
                        className="w-full h-12 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-[#2a2b3d] rounded-2xl px-4 text-sm font-bold focus:border-[#00B4AA] outline-none transition-all appearance-none"
                        value={formData.clasificacion_id}
                        onChange={(e) => setFormData({...formData, clasificacion_id: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {clasificaciones.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                      <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto ($)</label>
                    <div className="relative">
                      <input 
                        type="number" step="0.01"
                        className="w-full h-12 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-[#2a2b3d] rounded-2xl px-10 text-sm font-bold focus:border-[#00B4AA] outline-none transition-all"
                        placeholder="0.00"
                        value={formData.monto}
                        onChange={(e) => setFormData({...formData, monto: e.target.value})}
                        required
                      />
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha</label>
                  <div className="relative">
                    <input 
                      type="date"
                      className="w-full h-12 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-[#2a2b3d] rounded-2xl px-10 text-sm font-bold focus:border-[#00B4AA] outline-none transition-all"
                      value={formData.fecha_gasto}
                      onChange={(e) => setFormData({...formData, fecha_gasto: e.target.value})}
                      required
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción</label>
                  <div className="relative">
                    <textarea 
                      className="w-full min-h-[100px] bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-[#2a2b3d] rounded-2xl p-4 text-sm font-medium focus:border-[#00B4AA] outline-none transition-all"
                      placeholder="Ej: Pago de renta de la casa de retiro..."
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-12 rounded-2xl font-bold border-slate-200 text-slate-600"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 rounded-2xl font-black bg-[#00B4AA] hover:bg-[#00968d] text-white shadow-xl shadow-[#00B4AA]/20"
                  >
                    {loading ? "Guardando..." : "Guardar Gasto"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
