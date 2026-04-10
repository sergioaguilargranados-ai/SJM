"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Trash2, 
  UserCog, 
  Mail, 
  Calendar, 
  Shield, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { sjmToast } from "@/components/ui/SjmToast";
import { eliminarUsuarioAction } from "@/app/actions/usuarios"; 
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface UsuariosClientProps {
  usuariosInitial: any[];
  roles: any[];
}

export default function UsuariosClient({ usuariosInitial, roles }: UsuariosClientProps) {
  const [usuarios, setUsuarios] = useState(usuariosInitial);
  const [filtro, setFiltro] = useState("");
  const [usuarioEditar, setUsuarioEditar] = useState<any>(null);
  const [nuevoRolId, setNuevoRolId] = useState("");
  const [cargando, setCargando] = useState(false);

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre_completo.toLowerCase().includes(filtro.toLowerCase()) || 
    u.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleUpdateRol = async () => {
    if (!usuarioEditar || !nuevoRolId) return;
    setCargando(true);
    
    // Using the action I created in permisos.ts
    // Need to import it correctly
    const { asignarRolUsuarioAction } = await import("@/app/actions/permisos");
    const res = await asignarRolUsuarioAction(usuarioEditar.id, nuevoRolId);
    
    setCargando(false);
    
    if (res.success) {
      sjmToast("¡Éxito!", `Rol de ${usuarioEditar.nombre_completo} actualizado.`, "success");
      // Actualizar localmente
      setUsuarios(prev => prev.map(u => u.id === usuarioEditar.id ? { ...u, rol_id: nuevoRolId, rol: roles.find(r => r.id === nuevoRolId) } : u));
      setUsuarioEditar(null);
    } else {
      sjmToast("Error", res.error || "No se pudo actualizar el rol.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1">Control de acceso y asignación de responsabilidades.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white dark:bg-[#1a1b26] border-slate-200 dark:border-[#2a2b3d]">
            Exportar Lista
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="Buscar por nombre o correo..." 
          className="pl-11 h-12 bg-white dark:bg-[#1a1b26] border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm focus:ring-[#00B4AA]"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* Grid de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuariosFiltrados.map((u) => (
          <div key={u.id} className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#00B4AA]/10 flex items-center justify-center text-[#00B4AA] font-black text-lg border border-[#00B4AA]/20">
                  {u.nombre_completo.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{u.nombre_completo}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8e8ea0] text-xs mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[140px]">{u.correo}</span>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter",
                u.rol?.es_admin_sistema ? "bg-red-50 text-red-600 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
              )}>
                {u.rol?.nombre || "Sin Rol"}
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-50 dark:border-white/5 pt-4 mb-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5 uppercase font-bold tracking-widest"><Calendar className="w-3 h-3" /> Registro</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {u.creado_en ? format(new Date(u.creado_en), "dd MMM yyyy", { locale: es }) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5 uppercase font-bold tracking-widest"><Shield className="w-3 h-3" /> Tipo Acceso</span>
                <span className="text-[#00B4AA] font-black">{u.google_id ? 'Google (SSO)' : 'Credenciales'}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                onClick={() => { setUsuarioEditar(u); setNuevoRolId(u.rol_id || ""); }}
                variant="outline" 
                size="sm" 
                className="flex-1 h-9 rounded-lg border-slate-200 dark:border-[#2a2b3d] text-xs font-black uppercase tracking-widest"
              >
                <UserCog className="w-3.5 h-3.5 mr-2" /> Gestionar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-9 h-9 p-0 rounded-lg border-slate-200 dark:border-[#2a2b3d] text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {usuariosFiltrados.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 dark:border-[#2a2b3d] rounded-2xl">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 italic">No se encontraron usuarios con ese criterio.</p>
          </div>
        )}
      </div>

      {/* Modal Editar Rol */}
      <Dialog open={!!usuarioEditar} onOpenChange={(open) => !open && setUsuarioEditar(null)}>
        <DialogContent className="max-w-sm rounded-2xl overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserCog className="w-5 h-5 text-[#00B4AA]" />
              Cambio de Rol
            </DialogTitle>
            <DialogDescription>
              Asigna un nuevo nivel de acceso para <b>{usuarioEditar?.nombre_completo}</b>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Rol</label>
            <Select value={nuevoRolId} onValueChange={setNuevoRolId}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-[#2a2b3d] bg-slate-50/50 dark:bg-white/5">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id} className="font-medium">
                    {r.nombre} {r.es_admin_sistema ? '(ADMIN)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 bg-[#00B4AA]/5 border border-[#00B4AA]/10 p-3 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
               <CheckCircle2 className="w-4 h-4 text-[#00B4AA] shrink-0" />
               <p>Los cambios surtirán efecto la próxima vez que el usuario inicie sesión o refresque su perfil.</p>
            </div>
          </div>

          <DialogFooter className="bg-slate-50 dark:bg-[#1f202b] p-6 -mx-6 -mb-6 flex gap-3">
            <Button variant="ghost" onClick={() => setUsuarioEditar(null)} className="flex-1 font-bold">Cancelar</Button>
            <Button 
               onClick={handleUpdateRol} 
               disabled={cargando}
               className="flex-1 bg-[#00B4AA] hover:bg-[#009a96] text-white font-bold shadow-lg shadow-[#00B4AA]/20 transition-all active:scale-95"
            >
              {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Cambio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
