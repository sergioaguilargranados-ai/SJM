import { getInscripciones } from "@/app/actions/consultas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download, Search, CheckCircle2, AlertCircle } from "lucide-react";

// Forzamos que la consulta sea dinámica y evite caché estático de Vercel
export const dynamic = 'force-dynamic';

export default async function ReporteInscripciones() {
  const { data: inscripciones, success } = await getInscripciones();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reporte de Inscripciones</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Revisión en tiempo real de los asistentes capturados. Base de datos NEON activa.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
             <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
             <input type="text" placeholder="Buscar participante..." className="pl-10 h-10 w-full md:w-64 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white" />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-100 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Asistente</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Evento / Lógica</th>
                <th className="px-6 py-4">Estatus</th>
                <th className="px-6 py-4">Fecha Captura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {!success || !inscripciones || inscripciones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Aún no hay inscripciones registradas. Llena el formulario público primero.
                  </td>
                </tr>
              ) : (
                inscripciones.map((inscripcion: any) => (
                  <tr key={inscripcion.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{inscripcion.nombre_asistente}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {inscripcion.edad} años • {inscripcion.sexo === "M" ? "H" : "M"} • {inscripcion.estado_civil}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{inscripcion.telefono_celular}</div>
                      <div className="text-xs text-slate-500">{inscripcion.correo}</div>
                    </td>
                    <td className="px-6 py-4">
                      {inscripcion.es_primera_vez ? (
                         <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                           Primera vez
                         </span>
                      ) : (
                         <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                           Recurrente
                         </span>
                      )}
                      {inscripcion.pais_ciudad && (
                        <div className="text-xs text-slate-500 mt-1">{inscripcion.pais_ciudad}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                         {inscripcion.estatus_solicitud === "PENDIENTE_PAGO" ? (
                           <AlertCircle className="w-4 h-4 text-amber-500" />
                         ) : (
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                         )}
                         <span className="font-medium text-slate-700 dark:text-slate-300">
                            {inscripcion.estatus_solicitud}
                         </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {inscripcion.creado_en ? format(new Date(inscripcion.creado_en), "dd MMM yyyy, p", { locale: es }) : "N/A"}
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
