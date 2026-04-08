"use client";

import { useState } from "react";
import { TablaConsulta } from "@/components/TablaConsulta";
import { ShieldCheck, Lock, UserPlus, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sjmToast } from "@/components/ui/SjmToast";

export default function PermisosPage({ rolesInitial, planesInitial }: { rolesInitial: any[], planesInitial: any[] }) {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Estructura de Permisos</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1">Gestión granular de roles, funciones y niveles de contratación.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => sjmToast("Función en Desarrollo", "Pronto podrás crear planes personalizados.", "info")} className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] text-slate-700 dark:text-white hover:bg-slate-50">
            <Fingerprint className="w-4 h-4 mr-2" />
            Auditoría
          </Button>
          <Button onClick={() => sjmToast("Acceso Denegado", "Solo el administrador del sistema puede crear nuevos roles globales.", "warning")} className="bg-[#00B4AA] hover:bg-[#009a96] text-white font-bold">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Rol
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-[#2a2b3d]">
        <button 
          onClick={() => setActiveTab("roles")}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === "roles" ? "border-b-2 border-[#00B4AA] text-[#00B4AA]" : "text-slate-400"}`}
        >
          Roles del Sistema
        </button>
        <button 
          onClick={() => setActiveTab("planes")}
          className={`pb-4 px-2 text-sm font-bold transition-all ${activeTab === "planes" ? "border-b-2 border-[#00B4AA] text-[#00B4AA]" : "text-slate-400"}`}
        >
          Planes de Contratación
        </button>
      </div>

      {activeTab === "roles" && (
        <TablaConsulta
          titulo="Roles de Organización"
          subtitulo="Define qué puede hacer cada integrante de tu equipo."
          icono={<ShieldCheck className="w-6 h-6 text-[#00B4AA]" />}
          datos={rolesInitial}
          columnas={[
            {
              header: "Nombre del Rol",
              accessorKey: "nombre",
              cell: (val: any) => (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00B4AA]" />
                  <span className="font-bold text-slate-900 dark:text-white">{val}</span>
                </div>
              )
            },
            {
              header: "Tipo",
              accessorKey: "es_admin_sistema",
              cell: (val: any) => val ? (
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-black uppercase">Admin Maestro</span>
              ) : (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase">Operativo</span>
              )
            },
            {
              header: "Permisos Habilitados",
              accessorKey: "id",
              cell: () => <span className="text-xs text-slate-400 italic">Habilitado por Plan Premium</span>
            }
          ]}
        />
      )}

      {activeTab === "planes" && (
        <TablaConsulta
          titulo="Niveles de Servicio"
          subtitulo="Configuración de ramas funcionales por nivel de membresía."
          icono={<Lock className="w-6 h-6 text-amber-500" />}
          datos={planesInitial}
          columnas={[
            {
              header: "Plan",
              accessorKey: "nombre",
              cell: (val: any) => <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{val}</span>
            },
            {
              header: "Claves",
              accessorKey: "clave",
              cell: (val: any) => <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-mono">{val}</code>
            },
            {
              header: "Precio Mensual",
              accessorKey: "precio_mensual",
              cell: (val: any) => <span className="font-bold text-emerald-600">${val || "0.00"}</span>
            }
          ]}
        />
      )}
    </div>
  );
}
