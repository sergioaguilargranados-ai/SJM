"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Lock, UserPlus, Fingerprint, Settings2, Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sjmToast } from "@/components/ui/SjmToast";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  actualizarPermisosRolAction, 
  getAccionesPorRol 
} from "@/app/actions/permisos";
import { cn } from "@/lib/utils";

interface PermisosProps {
  rolesInitial: any[];
  planesInitial: any[];
  estructura: any[]; // [ { nombre, clave, funciones: [ { nombre, acciones: [] } ] } ]
}

export default function PermisosClient({ rolesInitial, planesInitial, estructura }: PermisosProps) {
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRol, setSelectedRol] = useState<any>(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cargandoPermisos, setCargandoPermisos] = useState(false);

  // Cargar permisos cuando cambia el rol seleccionado
  useEffect(() => {
    if (selectedRol) {
      cargarPermisos(selectedRol.id);
    } else {
      setPermisosSeleccionados([]);
    }
  }, [selectedRol]);

  const cargarPermisos = async (rolId: string) => {
    setCargandoPermisos(true);
    try {
      const perms = await getAccionesPorRol(rolId);
      setPermisosSeleccionados(perms);
    } catch (err) {
      sjmToast("Error", "No se pudieron cargar los permisos.", "error");
    } finally {
      setCargandoPermisos(false);
    }
  };

  const togglePermiso = (id: string) => {
    setPermisosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSavePermisos = async () => {
    if (!selectedRol) return;
    setGuardando(true);
    
    const res = await actualizarPermisosRolAction(selectedRol.id, permisosSeleccionados);
    
    setGuardando(false);
    
    if (res.success) {
      sjmToast("¡Guardado!", "Los permisos del rol se han actualizado correctamente.", "success");
    } else {
      sjmToast("Error", res.error || "No se pudieron guardar los cambios.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Seguridad y Acceso</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1">Configuración técnica de roles y niveles de servicio.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => sjmToast("Info", "Próximamente bitácora de cambios.", "info")}>
            <Fingerprint className="w-4 h-4 mr-2" />
            Auditoría
          </Button>
          <Button size="sm" className="bg-[#00B4AA] hover:bg-[#009a96] text-white font-bold">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Rol
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-[#2a2b3d]">
        {["roles", "matriz", "planes"].map((t) => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "pb-4 px-4 text-sm font-bold transition-all uppercase tracking-widest",
              activeTab === t ? "border-b-2 border-[#00B4AA] text-[#00B4AA]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {t === "matriz" ? "Matriz de Permisos" : t === "roles" ? "Roles" : "Planes"}
          </button>
        ))}
      </div>

      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lista de Roles */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Selecciona un Rol</h3>
            <div className="space-y-2">
              {rolesInitial.map((rol) => (
                <button
                  key={rol.id}
                  onClick={() => setSelectedRol(rol)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                    selectedRol?.id === rol.id 
                      ? "bg-[#00B4AA]/5 border-[#00B4AA] shadow-sm"
                      : "bg-white dark:bg-[#1a1b26] border-slate-200 dark:border-[#2a2b3d] hover:border-[#00B4AA]/30"
                  )}
                >
                  <div>
                    <p className={cn("font-bold text-sm", selectedRol?.id === rol.id ? "text-[#00B4AA]" : "text-slate-700 dark:text-slate-300")}>
                      {rol.nombre}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                      {rol.es_admin_sistema ? "Full Access Master" : "Control de Operación"}
                    </p>
                  </div>
                  <ShieldCheck className={cn("w-5 h-5 transition-colors", selectedRol?.id === rol.id ? "text-[#00B4AA]" : "text-slate-200 group-hover:text-slate-300")} />
                </button>
              ))}
            </div>
          </div>

          {/* Editor de Permisos */}
          <div className="md:col-span-2">
            {!selectedRol ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 dark:border-[#2a2b3d] rounded-2xl flex flex-col items-center justify-center text-center p-12 bg-slate-50/50 dark:bg-white/5">
                <div className="w-16 h-16 bg-slate-100 dark:bg-[#1a1b26] rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Configuración Granular</h3>
                <p className="text-sm text-slate-500 max-w-[280px] mt-2 leading-relaxed">Selecciona un rol de la izquierda para editar sus permisos de acceso.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                <div className="p-6 border-b border-slate-100 dark:border-[#2a2b3d] bg-slate-50/50 dark:bg-[#1f202b] flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00B4AA] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#00B4AA]/20">
                      <Settings2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">Permisos: {selectedRol.nombre}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Editor de Acciones Modulares</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSavePermisos} 
                    disabled={guardando || selectedRol.es_admin_sistema} 
                    className="bg-[#00B4AA] hover:bg-[#009a96] text-white font-black text-xs h-10 px-6 rounded-lg uppercase tracking-widest shadow-lg shadow-[#00B4AA]/20 transition-all active:scale-95"
                  >
                    {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Guardar</>}
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 max-h-[600px] custom-scrollbar">
                  {selectedRol.es_admin_sistema ? (
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20 p-6 rounded-xl text-center">
                       <Check className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                       <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Acceso Maestro Habilitado</h4>
                       <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">Este rol tiene permiso total sobre el sistema por defecto. No es necesario configurar permisos granulares.</p>
                    </div>
                  ) : (
                    estructura.map((modulo) => (
                      <div key={modulo.id} className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#2a2b3d]">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{modulo.nombre}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {modulo.funciones?.map((func: any) => (
                            <div key={func.id} className="bg-slate-50/50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">{func.nombre}</p>
                              <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {func.acciones?.map((acc: any) => (
                                  <label key={acc.id} className="flex items-center gap-2 cursor-pointer group">
                                    <Checkbox 
                                      checked={permisosSeleccionados.includes(acc.id)} 
                                      onCheckedChange={() => togglePermiso(acc.id)} 
                                      className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-[#00B4AA]"
                                    />
                                    <span className="text-xs text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors capitalize">
                                      {acc.clave === 'view' ? 'Ver' : acc.clave === 'edit' ? 'Editar' : acc.clave === 'create' ? 'Crear' : 'Eliminar'}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "planes" && (
        <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl overflow-hidden shadow-sm">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-[#1a1b26] border-b border-slate-200 dark:border-[#2a2b3d]">
                <tr>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Nivel</th>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Identificador</th>
                  <th className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Acceso Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2a2b3d]">
                {planesInitial.map(p => (
                   <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white uppercase">{p.nombre}</td>
                      <td className="px-6 py-4"><code className="text-xs bg-slate-100 dark:bg-[#2a2b3d] px-2 py-1 rounded">{p.clave}</code></td>
                      <td className="px-6 py-4 text-xs text-slate-500 italic">Pre-configurado por sistema</td>
                   </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === "matriz" && (
        <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-12 text-center flex flex-col items-center">
           <Lock className="w-12 h-12 text-slate-200 mb-4" />
           <h3 className="font-bold text-slate-900 dark:text-white">Matriz de Superposición</h3>
           <p className="text-sm text-slate-500 mt-2 max-w-sm">Esta vista permitirá visualizar de forma horizontal todos los roles y sus permisos simultáneamente. Próximamente.</p>
        </div>
      )}
    </div>
  );
}
