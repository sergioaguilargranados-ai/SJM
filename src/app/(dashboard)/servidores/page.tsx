import { getServidores } from "@/app/actions/consultas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, Search, Plus, UserCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Forzamos la consulta dinámica (SSR) 
export const dynamic = 'force-dynamic';

export default async function CatalogoServidores() {
  const { data: servidores, success } = await getServidores();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Mapeo Horizontal ERPCubox Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 dark:bg-[#1a1b26] p-4 rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm items-center w-full">
           <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-[#e11d48]" /> 
                 Catálogo Directivo de Servidores
              </h1>
              <p className="text-sm text-slate-500 dark:text-[#8e8ea0] mt-1">Organización y administración del capital humano de la comunidad.</p>
           </div>
           
           <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-[#2a2b3d]">
              <div className="text-right">
                 <p className="text-xs text-slate-500 dark:text-[#8e8ea0] font-medium uppercase tracking-wider">Total Activos</p>
                 <p className="text-xl font-bold text-slate-900 dark:text-white">{servidores?.length || 0}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Barra de Filtros ERPCubox */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1a1b26] p-4 rounded-xl border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
        <div className="flex gap-2">
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
             <input type="text" placeholder="Buscar servidor por nombre, correo..." className="pl-9 h-9 w-full md:w-80 rounded-md border border-slate-300 dark:border-[#3b3c54] bg-white dark:bg-[#0f1015] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-[#e11d48] text-slate-900 dark:text-white transition-colors" />
           </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#2a2b3d]/50 dark:hover:bg-[#2a2b3d] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#3b3c54] px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Excel
          </button>
          <Link href="/servidores/nuevo" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Añadir Servidor
          </Link>
        </div>
      </div>

      {/* ERPCubox Table Container */}
      <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#151621] text-slate-800 dark:text-slate-200 font-semibold text-xs border-b border-slate-200 dark:border-[#2a2b3d]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Gafete / Identidad</th>
                <th className="px-5 py-3.5 font-semibold">Contacto Directo</th>
                <th className="px-5 py-3.5 font-semibold">Sede / Ingreso</th>
                <th className="px-5 py-3.5 font-semibold text-center">Estatus</th>
                <th className="px-5 py-3.5 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2b3d]">
              {!success || !servidores || servidores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <UserCircle className="w-12 h-12 text-slate-300 dark:text-[#3b3c54] mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-base">Aún no hay servidores registrados</p>
                    <p className="text-slate-500 dark:text-[#8e8ea0] text-sm mt-1">Usa el botón "Añadir Servidor" para comenzar el padrón.</p>
                  </td>
                </tr>
              ) : (
                servidores.map((srv: any) => (
                  <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-[#2a2b3d]/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 dark:bg-[#2a2b3d] dark:text-slate-300 flex items-center justify-center font-bold shadow-inner">
                            {srv.nombre_completo?.charAt(0) || "U"}
                         </div>
                         <div>
                            <div className="font-bold text-slate-900 dark:text-white leading-none">{srv.nombre_completo || "Usuario Sin Nombre"}</div>
                            <div className="text-[11px] font-mono text-slate-500 dark:text-[#8e8ea0] mt-1">ID: {srv.id.substring(0,8)}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{srv.celular || "Sin teléfono"}</div>
                      <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5">{srv.correo}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{srv.sede}</div>
                      <div className="text-xs text-slate-500 dark:text-[#8e8ea0] mt-0.5 w-32 truncate">
                         Ingreso: {srv.fecha_ingreso ? format(new Date(srv.fecha_ingreso), "dd MMM yyyy", { locale: es }) : "No Especificado"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                       {srv.estatus ? (
                         <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Baja
                         </span>
                       )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                       <button className="text-blue-600 hover:text-blue-800 dark:text-[#8e8ea0] dark:hover:text-[#e11d48] text-sm font-medium transition-colors">
                         Administrar
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
