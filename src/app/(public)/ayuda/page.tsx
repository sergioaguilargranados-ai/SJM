import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ChevronDown, Phone, Mail, MessageCircle } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerFAQ, obtenerTelefonos } from "@/app/actions/contenido";

export const metadata: Metadata = {
  title: "Ayuda | Servidores de Jesús por María",
  description: "Preguntas frecuentes y medios de contacto de SJM.",
};

const faqDefault = [
  { pregunta: "¿Qué son los Servidores de Jesús por María?", respuesta: "Somos un Instituto Secular y Movimiento Nacional dedicado a la evangelización, sanación interior y caridad cristiana, con presencia en múltiples ciudades de México." },
  { pregunta: "¿Qué es un retiro de sanación interior?", respuesta: "Es un encuentro personal con Cristo Jesús a través de las verdades del evangelio, donde se busca sanar las heridas del alma que han sido causadas por la falta de amor, el rechazo, el abandono y otras experiencias dolorosas." },
  { pregunta: "¿Cómo puedo participar?", respuesta: "Puedes acercarte a cualquiera de nuestros centros o comunicarte con nosotros. No necesitas pertenecer a ningún grupo religioso, solo tener el deseo de sanar y crecer espiritualmente." },
  { pregunta: "¿Los retiros tienen costo?", respuesta: "Los retiros tienen una aportación sugerida que incluye alimentos y hospedaje. Nadie se queda sin participar por falta de recursos." },
];

export default async function AyudaPage() {
  const tenant = await resolverTenant();
  const orgId = tenant?.id;

  let faqCMS: any[] = [];
  let telefonos: any[] = [];
  if (orgId) {
    [faqCMS, telefonos] = await Promise.all([
      obtenerFAQ(orgId, "general"),
      obtenerTelefonos(orgId),
    ]);
  }

  const faq = faqCMS.length > 0
    ? faqCMS.map(f => ({ pregunta: f.pregunta, respuesta: f.respuesta }))
    : faqDefault;

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <HelpCircle className="w-14 h-14 text-sky-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">Ayuda</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">Preguntas frecuentes y cómo contactarnos</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faq.map((f, idx) => (
              <details key={idx} className="group bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-bold text-slate-900 dark:text-white hover:text-[#00B4AA] transition-colors">
                  {f.pregunta}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-[#2a2b3d] pt-4">
                  {f.respuesta}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Teléfonos de contacto dinámicos */}
        {telefonos.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Teléfonos de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {telefonos.map((t) => (
                <div key={t.id} className="bg-white dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d] p-5 flex items-start gap-4">
                  <Phone className="w-8 h-8 text-green-500 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.nombre_contacto || "Contacto"}</p>
                    {t.cargo && <p className="text-xs text-[#00B4AA] font-medium">{t.cargo}</p>}
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">📞 {t.telefono}</p>
                    {t.whatsapp && <p className="text-sm text-green-600 dark:text-green-400">💬 {t.whatsapp}</p>}
                    {t.horario && <p className="text-[10px] text-slate-400 mt-1">🕐 {t.horario}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacto rápido */}
        <div className="text-center bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 rounded-2xl p-8 border border-sky-200/50 dark:border-sky-800/30">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">¿No encontraste tu respuesta?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Escríbenos y con gusto te ayudaremos</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contactanos" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 text-white px-8 text-sm font-bold hover:scale-105 transition-all shadow-lg">
              <Mail className="w-4 h-4" /> Contáctanos
            </Link>
            {tenant?.whatsapp_contacto && (
              <a href={`https://wa.me/${tenant.whatsapp_contacto}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 text-white px-8 text-sm font-bold hover:scale-105 transition-all shadow-lg">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
