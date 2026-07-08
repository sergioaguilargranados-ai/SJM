"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Shield, Settings2, Key, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { sjmToast } from "@/components/ui/SjmToast";
import { 
  upsertModuloAction, 
  deleteModuloAction, 
  upsertFuncionAction, 
  deleteFuncionAction, 
  upsertAccionAction, 
  deleteAccionAction,
  actualizarPlanPermisosAction,
  getPlanPermisos
} from "@/app/actions/modulos";

export default function ModulosClient({ modulosInitial, planes }: { modulosInitial: any[], planes: any[] }) {
  const [modulos, setModulos] = useState(modulosInitial);
  
  // Modals state
  const [isModuloModalOpen, setModuloModalOpen] = useState(false);
  const [isFuncionModalOpen, setFuncionModalOpen] = useState(false);
  const [isAccionModalOpen, setAccionModalOpen] = useState(false);
  const [isPlanesModalOpen, setPlanesModalOpen] = useState(false);
  
  // Current edit state
  const [currentModulo, setCurrentModulo] = useState<any>(null);
  const [currentFuncion, setCurrentFuncion] = useState<any>(null);
  const [currentAccion, setCurrentAccion] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [planFuncionesIds, setPlanFuncionesIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Handlers para Módulos ---
  const handleEditModulo = (modulo?: any) => {
    setCurrentModulo(modulo || { nombre: "", clave: "", icono: "" });
    setModuloModalOpen(true);
  };

  const handleSaveModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertModuloAction(currentModulo);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Módulo guardado");
      setModuloModalOpen(false);
      window.location.reload();
    } else {
      sjmToast("Error", res.error || "Error al guardar", "error");
    }
  };

  const handleDeleteModulo = async (id: string) => {
    if (!confirm("¿Seguro de eliminar este módulo?")) return;
    setLoading(true);
    const res = await deleteModuloAction(id);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Módulo eliminado");
      window.location.reload();
    } else {
      sjmToast("Error", res.error || "Error al eliminar", "error");
    }
  };

  // --- Handlers para Funciones ---
  const handleEditFuncion = (moduloId: string, funcion?: any) => {
    setCurrentFuncion(funcion || { modulo_id: moduloId, nombre: "", clave: "", descripcion: "" });
    setFuncionModalOpen(true);
  };

  const handleSaveFuncion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertFuncionAction(currentFuncion);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Función guardada");
      setFuncionModalOpen(false);
      window.location.reload();
    } else {
      sjmToast("Error", res.error || "Error al guardar", "error");
    }
  };

  const handleDeleteFuncion = async (id: string) => {
    if (!confirm("¿Seguro de eliminar esta función?")) return;
    setLoading(true);
    const res = await deleteFuncionAction(id);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Función eliminada");
      window.location.reload();
    } else {
      sjmToast("Error", res.error || "Error al eliminar", "error");
    }
  };

  // --- Handlers para Acciones ---
  const handleEditAccion = (funcionId: string, accion?: any) => {
    setCurrentAccion(accion || { funcion_id: funcionId, nombre: "", clave: "" });
    setAccionModalOpen(true);
  };

  const handleSaveAccion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await upsertAccionAction(currentAccion);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Acción guardada");
      setAccionModalOpen(false);
      window.location.reload();
    } else {
      sjmToast("Error", res.error || "Error al guardar", "error");
    }
  };

  const handleDeleteAccion = async (id: string) => {
    if (!confirm("¿Seguro de eliminar esta acción?")) return;
    setLoading(true);
    const res = await deleteAccionAction(id);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Acción eliminada");
      window.location.reload();
    } else {
      sjmToast("Error", res.error || "Error al eliminar", "error");
    }
  };

  // --- Handlers para Planes ---
  const handleManagePlanes = async (plan: any) => {
    setCurrentPlan(plan);
    setLoading(true);
    const permitidas = await getPlanPermisos(plan.id);
    setPlanFuncionesIds(permitidas);
    setLoading(false);
    setPlanesModalOpen(true);
  };

  const togglePlanFuncion = (funcionId: string) => {
    if (planFuncionesIds.includes(funcionId)) {
      setPlanFuncionesIds(prev => prev.filter(id => id !== funcionId));
    } else {
      setPlanFuncionesIds(prev => [...prev, funcionId]);
    }
  };

  const handleSavePlanes = async () => {
    setLoading(true);
    const res = await actualizarPlanPermisosAction(currentPlan.id, planFuncionesIds);
    setLoading(false);
    if (res.success) {
      sjmToast("Éxito", "Permisos del plan actualizados");
      setPlanesModalOpen(false);
    } else {
      sjmToast("Error", res.error || "Error al guardar", "error");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen dark:bg-[#0f1015]">
      <div className="flex justify-between items-center bg-white dark:bg-[#1a1b26] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2b3d]">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Gestor Global de Módulos (SuperAdmin)
          </h1>
          <p className="text-slate-500 dark:text-[#8e8ea0] mt-1 text-sm">
            Administra los módulos, funciones y vinculación a planes del sistema
          </p>
        </div>
        <Button onClick={() => handleEditModulo()} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo Módulo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Planes */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-[#1a1b26] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2b3d]">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Key className="h-5 w-5" /> Planes y Suscripciones
            </h2>
            <div className="space-y-3">
              {planes.map(plan => (
                <div key={plan.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#151621] rounded-lg border border-slate-100 dark:border-[#2a2b3d]">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{plan.nombre}</p>
                    <p className="text-xs text-slate-500 dark:text-[#5e5e72]">{plan.clave}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleManagePlanes(plan)}>
                    Asignar Módulos
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Módulos, Funciones y Acciones */}
        <div className="lg:col-span-2 space-y-6">
          {modulos.map(modulo => (
            <div key={modulo.id} className="bg-white dark:bg-[#1a1b26] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2b3d] overflow-hidden">
              {/* Header Módulo */}
              <div className="bg-slate-100 dark:bg-[#151621] p-4 border-b border-slate-200 dark:border-[#2a2b3d] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {modulo.icono || <Settings2 className="h-4 w-4" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{modulo.nombre}</h3>
                    <p className="text-xs text-slate-500 dark:text-[#8e8ea0]">{modulo.clave}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditFuncion(modulo.id)} className="h-8 text-xs text-blue-600">
                    <Plus className="h-3 w-3 mr-1" /> Función
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditModulo(modulo)} className="h-8 w-8 p-0 text-slate-500">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteModulo(modulo.id)} className="h-8 w-8 p-0 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Funciones */}
              <div className="p-4 space-y-4">
                {modulo.funciones?.map((funcion: any) => (
                  <div key={funcion.id} className="border border-slate-100 dark:border-[#2a2b3d] rounded-lg p-3 bg-slate-50 dark:bg-transparent">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{funcion.nombre}</h4>
                        <p className="text-xs text-slate-500 dark:text-[#8e8ea0]">{funcion.clave}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAccion(funcion.id)} className="h-6 text-[10px] px-2 text-green-600">
                          <Plus className="h-3 w-3 mr-1" /> Acción
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditFuncion(modulo.id, funcion)} className="h-6 w-6 p-0 text-slate-400">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteFuncion(funcion.id)} className="h-6 w-6 p-0 text-red-400">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Acciones */}
                    {funcion.acciones?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {funcion.acciones.map((accion: any) => (
                          <div key={accion.id} className="flex items-center gap-1 bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded text-xs px-2 py-1 shadow-sm">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{accion.nombre}</span>
                            <span className="text-slate-400 dark:text-[#5e5e72] mx-1">|</span>
                            <span className="text-slate-500 dark:text-[#8e8ea0]">{accion.clave}</span>
                            <div className="flex gap-1 ml-2">
                              <button onClick={() => handleEditAccion(funcion.id, accion)} className="text-slate-400 hover:text-blue-500"><Edit2 className="h-3 w-3" /></button>
                              <button onClick={() => handleDeleteAccion(accion.id)} className="text-slate-400 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {(!modulo.funciones || modulo.funciones.length === 0) && (
                  <p className="text-sm text-slate-400 dark:text-[#5e5e72] italic text-center py-2">No hay funciones en este módulo.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Modal Módulo */}
      <Dialog open={isModuloModalOpen} onOpenChange={setModuloModalOpen}>
        <DialogContent className="dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{currentModulo?.id ? 'Editar Módulo' : 'Nuevo Módulo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveModulo} className="space-y-4">
            <div>
              <Label className="dark:text-slate-300">Nombre del Módulo</Label>
              <Input required value={currentModulo?.nombre || ''} onChange={e => setCurrentModulo({...currentModulo, nombre: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" placeholder="Ej: Gestor de Eventos" />
            </div>
            <div>
              <Label className="dark:text-slate-300">Clave (Única, sin espacios)</Label>
              <Input required value={currentModulo?.clave || ''} onChange={e => setCurrentModulo({...currentModulo, clave: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" placeholder="Ej: eventos" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setModuloModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Función */}
      <Dialog open={isFuncionModalOpen} onOpenChange={setFuncionModalOpen}>
        <DialogContent className="dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{currentFuncion?.id ? 'Editar Función' : 'Nueva Función'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveFuncion} className="space-y-4">
            <div>
              <Label className="dark:text-slate-300">Nombre de la Función</Label>
              <Input required value={currentFuncion?.nombre || ''} onChange={e => setCurrentFuncion({...currentFuncion, nombre: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" placeholder="Ej: Padrón de Servidores" />
            </div>
            <div>
              <Label className="dark:text-slate-300">Clave (Ej: modulo.funcion)</Label>
              <Input required value={currentFuncion?.clave || ''} onChange={e => setCurrentFuncion({...currentFuncion, clave: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" placeholder="Ej: servidores.padron" />
            </div>
            <div>
              <Label className="dark:text-slate-300">Descripción</Label>
              <Input value={currentFuncion?.descripcion || ''} onChange={e => setCurrentFuncion({...currentFuncion, descripcion: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setFuncionModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Acción */}
      <Dialog open={isAccionModalOpen} onOpenChange={setAccionModalOpen}>
        <DialogContent className="dark:bg-[#1a1b26] dark:border-[#2a2b3d]">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{currentAccion?.id ? 'Editar Acción' : 'Nueva Acción'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAccion} className="space-y-4">
            <div>
              <Label className="dark:text-slate-300">Nombre (Ej: Crear, Eliminar, Todo)</Label>
              <Input required value={currentAccion?.nombre || ''} onChange={e => setCurrentAccion({...currentAccion, nombre: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
            </div>
            <div>
              <Label className="dark:text-slate-300">Clave (Ej: create, view, *)</Label>
              <Input required value={currentAccion?.clave || ''} onChange={e => setCurrentAccion({...currentAccion, clave: e.target.value})} className="dark:bg-[#0f1015] dark:border-[#2a2b3d]" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setAccionModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Planes Permisos */}
      <Dialog open={isPlanesModalOpen} onOpenChange={setPlanesModalOpen}>
        <DialogContent className="max-w-3xl dark:bg-[#1a1b26] dark:border-[#2a2b3d] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Permisos del Plan: {currentPlan?.nombre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {modulos.map(modulo => (
              <div key={modulo.id} className="border border-slate-200 dark:border-[#2a2b3d] rounded-xl overflow-hidden">
                <div className="bg-slate-100 dark:bg-[#151621] p-3 font-semibold text-slate-800 dark:text-white">
                  {modulo.nombre}
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modulo.funciones?.map((funcion: any) => (
                    <label key={funcion.id} className="flex items-start gap-3 p-3 border border-slate-100 dark:border-[#2a2b3d] rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-[#151621]">
                      <Checkbox 
                        checked={planFuncionesIds.includes(funcion.id)}
                        onCheckedChange={() => togglePlanFuncion(funcion.id)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">{funcion.nombre}</p>
                        <p className="text-xs text-slate-500 dark:text-[#8e8ea0]">{funcion.clave}</p>
                      </div>
                    </label>
                  ))}
                  {(!modulo.funciones || modulo.funciones.length === 0) && (
                    <p className="text-sm text-slate-400 italic">No hay funciones</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#2a2b3d]">
            <Button variant="outline" onClick={() => setPlanesModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePlanes} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" /> Guardar Permisos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
