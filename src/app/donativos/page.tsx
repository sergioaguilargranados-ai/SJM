import Link from "next/link";
import { Heart, DollarSign, Globe, Phone, ArrowRight, ShieldCheck, Users, BookOpen } from "lucide-react";

export const metadata = {
  title: "Donativos SJM | Apoya la Obra",
  description: "Tu donativo hace posible la evangelización, formación y los retiros espirituales de Servidores de Jesús por María.",
};

const formasDonar = [
  {
    titulo: "Transferencia Bancaria",
    descripcion: "Envía tu aportación directamente a nuestra cuenta institucional.",
    datos: "Banco: BBVA\nNombre: Servidores de Jesús por María A.R.\nCuenta: 0118 2032 7834\nCLABE: 012180 0118 2032 7834 7",
    icono: DollarSign,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    titulo: "Donativo en Línea",
    descripcion: "Próximamente podrás donar con tarjeta de crédito o débito desde esta misma página.",
    datos: "Integración con pasarela de pagos en desarrollo.",
    icono: Globe,
    color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    titulo: "Contacto Directo",
    descripcion: "Comunícate con nosotros para donativos en especie o programas de apadrinamiento.",
    datos: "WhatsApp: +52 722 000 0000\nCorreo: donativos@sjm.org.mx",
    icono: Phone,
    color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
];

const impactos = [
  { numero: "350+", texto: "Servidores formados", icono: Users },
  { numero: "12", texto: "Retiros al año", icono: BookOpen },
  { numero: "5", texto: "Sedes activas", icono: Globe },
  { numero: "100%", texto: "Transparencia", icono: ShieldCheck },
];

export default function DonativosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1015]">
      {/* Nav */}
      <nav className="border-b border-slate-100 dark:border-slate-900 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="font-black text-xl text-slate-900 dark:text-white tracking-tight">SJM</Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link>
          <Link href="/tienda" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tienda</Link>
          <Link href="/donativos" className="text-rose-600 dark:text-rose-400 font-bold">Donativos</Link>
          <Link href="/login" className="ml-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs hover:opacity-90">Acceso Admin</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" /> Apoya la Obra
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Tu Aportación<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500 dark:from-rose-400 dark:to-orange-300">
              Transforma Vidas
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Cada donativo hace posible que más personas vivan la experiencia de un retiro espiritual,
            reciban formación cristiana y se integren a una comunidad de fe.
          </p>
        </div>

        {/* Impacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {impactos.map((item, idx) => (
            <div key={idx} className="text-center p-6 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d]">
              <item.icono className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-slate-900 dark:text-white">{item.numero}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{item.texto}</p>
            </div>
          ))}
        </div>

        {/* Formas de Donar */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">¿Cómo puedo donar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {formasDonar.map((forma, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${forma.color} flex items-center justify-center mb-4`}>
                <forma.icono className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{forma.titulo}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{forma.descripcion}</p>
              <pre className="text-xs bg-slate-50 dark:bg-[#151621] p-3 rounded-lg text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-mono">
                {forma.datos}
              </pre>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-rose-600 to-orange-500 p-12 rounded-3xl text-white">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black mb-2">Cada Aportación Cuenta</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            No importa el monto 🕊️ Tu generosidad permite que la obra siga creciendo.
          </p>
          <Link
            href="https://wa.me/527220000000?text=Hola,%20me%20gustaría%20hacer%20un%20donativo"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Phone className="w-4 h-4" /> Contáctanos por WhatsApp
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-900 py-10 text-center">
        <p className="text-sm text-slate-400">© 2026 Servidores de Jesús por María • Donativos</p>
      </footer>
    </div>
  );
}
