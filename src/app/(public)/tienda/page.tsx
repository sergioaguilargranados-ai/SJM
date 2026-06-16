import { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Package } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerProductos, obtenerCategorias } from "@/app/actions/tienda";

export const metadata: Metadata = {
  title: "Tienda | Servidores de Jesús por María",
  description: "Artículos religiosos, libros, música y más de SJM.",
};

export default async function TiendaPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let productos: any[] = [];
  let categorias: any[] = [];
  if (orgId) {
    [productos, categorias] = await Promise.all([
      obtenerProductos(orgId),
      obtenerCategorias(orgId),
    ]);
  }

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ShoppingBag className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Tienda Online
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Artículos religiosos, libros, música y más
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Filtro de categorías */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-emerald-600 text-white">Todos</span>
            {categorias.map((c) => (
              <span key={c.id} className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#2a2b3d] hover:bg-slate-200 dark:hover:bg-[#3a3b4d] cursor-pointer transition-colors">
                {c.nombre}
              </span>
            ))}
          </div>
        )}

        {productos.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-dashed border-slate-300 dark:border-[#2a2b3d]">
            <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400">Próximamente</h2>
            <p className="text-slate-400 mt-2">Estamos preparando nuestro catálogo de productos. ¡Muy pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((p) => (
              <div key={p.id} className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden hover:shadow-xl transition-all group">
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2a2b3d] dark:to-[#1a1b26] flex items-center justify-center overflow-hidden">
                  {p.imagen_principal_url ? (
                    <img src={p.imagen_principal_url} alt={p.nombre} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Package className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <div className="p-5">
                  {p.categoria && <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{p.categoria}</span>}
                  <h3 className="font-bold text-slate-900 dark:text-white mt-1">{p.nombre}</h3>
                  {p.descripcion && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.descripcion}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xl font-black text-emerald-600">${p.precio}</span>
                    {p.precio_anterior && <span className="text-sm text-slate-400 line-through">${p.precio_anterior}</span>}
                  </div>
                  {p.stock !== null && p.stock <= 5 && p.stock > 0 && (
                    <p className="text-[10px] text-orange-500 font-bold mt-1">¡Últimas {p.stock} piezas!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
