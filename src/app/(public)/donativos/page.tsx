import { Metadata } from "next";
import Link from "next/link";
import { Heart, DollarSign, Globe, Phone, ArrowRight, ShieldCheck, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
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
    datos: "Correo: sisepuede@serjema.com",
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/5 to-orange-500/5 dark:from-rose-900/10 dark:to-orange-900/10" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
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
            &ldquo;Dad y se os dará&rdquo; — Cada donativo hace posible que más personas vivan la experiencia de un retiro espiritual,
            reciban formación cristiana y se integren a una comunidad de fe.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Impacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {impactos.map((item, idx) => (
            <div key={idx} className="text-center p-6 bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] hover:shadow-lg transition-shadow">
              <item.icono className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-3xl font-black text-slate-900 dark:text-white">{item.numero}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{item.texto}</p>
            </div>
          ))}
        </div>

        {/* Formas de donar */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-8">¿Cómo puedo donar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {formasDonar.map((forma, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
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
            href="/contactanos"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <Phone className="w-4 h-4" /> Contáctanos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
