import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, MessageCircle, Globe, Users, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contáctanos | Servidores de Jesús por María",
  description: "Comunícate con nosotros. Teléfonos, WhatsApp, correo electrónico, ubicación y mapa.",
};

export default function ContactanosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[180px] opacity-10 dark:opacity-15" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Phone className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Contáctanos
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Queremos saber de ti. Estamos disponibles para escucharte y acompañarte.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-12">
        {/* Tarjetas de contacto principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Correo Electrónico</h3>
            <a href="mailto:sisepuede@serjema.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              sisepuede@serjema.com
            </a>
          </div>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">WhatsApp</h3>
            <a href="https://wa.me/523312345678" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 dark:text-green-400 hover:underline">
              Enviar mensaje por WhatsApp
            </a>
          </div>
          <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm text-center hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Ubicación</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Guadalajara, Jalisco, México</p>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 md:p-12 border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Envíanos un mensaje</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nombre completo</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B4AA] focus:border-transparent outline-none transition-all" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Correo electrónico</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B4AA] focus:border-transparent outline-none transition-all" placeholder="tu@correo.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Asunto</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B4AA] focus:border-transparent outline-none transition-all" placeholder="¿Sobre qué deseas escribir?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mensaje</label>
              <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#2a2b3d] bg-white dark:bg-[#0f1015] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#00B4AA] focus:border-transparent outline-none transition-all resize-none" placeholder="Escríbenos tu mensaje..." />
            </div>
            <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 text-sm font-bold transition-all hover:scale-105 shadow-lg">
              <Mail className="w-4 h-4" /> Enviar Mensaje
            </button>
          </form>
        </div>

        {/* Responsables */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 text-center">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1a1b26] rounded-2xl p-6 border border-slate-200 dark:border-[#2a2b3d] shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00B4AA] to-[#1E3A5F] flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                FC
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Fernando Casillas Gallardo</h3>
              <p className="text-sm text-[#00B4AA] font-medium">Director General</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed">
                &ldquo;Con el corazón de Jesús, al servicio de los más necesitados.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Síguenos en redes</h2>
          <div className="flex items-center justify-center gap-4">
            <a href="https://www.facebook.com/servidoresdejesuspormariagdl" target="_blank" rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </a>
            <a href="https://www.instagram.com/servidorespormaria/" target="_blank" rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <Globe className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
