import Link from "next/link";
import { ShoppingBag, ArrowRight, Heart, Star, Package } from "lucide-react";

export const metadata = {
  title: "Tienda SJM | Materiales y Recursos",
  description: "Libros, materiales de formación y productos de la comunidad Servidores de Jesús por María.",
};

const productos = [
  {
    nombre: "Manual del Servidor — Edición 2026",
    precio: 250,
    descripcion: "Guía completa de formación para servidores de nuevo ingreso.",
    emoji: "📘",
    categoria: "Libros",
  },
  {
    nombre: "Camiseta SJM Oficial",
    precio: 180,
    descripcion: "Playera tipo polo con bordado del logo SJM. Disponible en azul y blanco.",
    emoji: "👕",
    categoria: "Vestimenta",
  },
  {
    nombre: "Kit de Liturgia Personal",
    precio: 350,
    descripcion: "Rosario, libro de oraciones, estampas y tarjeta de compromisos espirituales.",
    emoji: "✝️",
    categoria: "Liturgia",
  },
  {
    nombre: "Cuaderno de Retiro",
    precio: 120,
    descripcion: "Cuaderno temático para tomar notas durante retiros y talleres.",
    emoji: "📓",
    categoria: "Materiales",
  },
  {
    nombre: "USB — Pláticas Formativas",
    precio: 200,
    descripcion: "Colección de 20 pláticas de formación en audio digital.",
    emoji: "💿",
    categoria: "Digital",
  },
  {
    nombre: "Pin SJM Conmemorativo",
    precio: 80,
    descripcion: "Pin metálico con el escudo de la comunidad. Edición aniversario.",
    emoji: "📌",
    categoria: "Artículos",
  },
];

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1015]">
      {/* Nav */}
      <nav className="border-b border-slate-100 dark:border-slate-900 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="font-black text-xl text-slate-900 dark:text-white tracking-tight">SJM</Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link>
          <Link href="/tienda" className="text-blue-600 dark:text-blue-400 font-bold">Tienda</Link>
          <Link href="/donativos" className="hover:text-slate-900 dark:hover:text-white transition-colors">Donativos</Link>
          <Link href="/login" className="ml-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs hover:opacity-90">Acceso Admin</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" /> Tienda Oficial
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Materiales y Recursos
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Libros, vestimenta y herramientas de formación para servidores y participantes.
          </p>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((prod, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-6 hover:shadow-xl transition-shadow group relative"
            >
              {/* Emoji como imagen */}
              <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#151621] flex items-center justify-center text-3xl mb-4">
                {prod.emoji}
              </div>
              <span className="inline-block bg-slate-100 dark:bg-[#2a2b3d] text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                {prod.categoria}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{prod.nombre}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{prod.descripcion}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${prod.precio}</span>
                <button className="px-4 py-2 bg-blue-600 dark:bg-[#e11d48] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" /> Agregar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Nota */}
        <div className="mt-16 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-8 text-center">
          <Package className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Envíos Nacionales</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Realizamos envíos a toda la República Mexicana. Los productos se entregan en 3-5 días hábiles.
            Para pedidos de retiros, contacta a tu coordinador de sede.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-900 py-10 text-center">
        <p className="text-sm text-slate-400">© 2026 Servidores de Jesús por María • Tienda Oficial</p>
      </footer>
    </div>
  );
}
