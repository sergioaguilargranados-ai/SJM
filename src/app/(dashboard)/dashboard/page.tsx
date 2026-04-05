export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de Control SJM</h1>
        <p className="text-slate-500 dark:text-slate-400">Bienvenido a la administración de tu sede. Selecciona una opción del menú lateral.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Servidores Activos</h3>
          <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">142</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Próximos Eventos</h3>
          <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">3</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Nuevas Inscripciones</h3>
          <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">+18</p>
        </div>
      </div>
    </div>
  );
}
