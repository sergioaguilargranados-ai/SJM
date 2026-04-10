import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { resolverTenant } from "@/lib/tenant";
import { obtenerSeccionesPagina } from "@/app/actions/contenido";

export const metadata: Metadata = {
  title: "Nosotros | Servidores de Jesús por María",
  description: "Instituto Secular, Movimiento Nacional, Nuestra Misión, Carisma, Medios de Evangelización, Programas y Apostolados de SJM.",
};

// ============================================================
// CONTENIDO ESTÁTICO DE RESPALDO — Se usa si no hay datos del CMS
// Extraído de www.serjema.com.mx
// ============================================================

const tarjetasMenuDefault = [
  { id: "instituto", titulo: "Instituto Secular", lema: "Para hombres y mujeres a imitación de Jesús Servidor", icono: "✝️" },
  { id: "movimiento", titulo: "Movimiento Nacional", lema: "Presencia en todo México y más allá", icono: "🌍" },
  { id: "mision", titulo: "Nuestra Misión", lema: "Llevar a los hombres a una verdadera entrega personal a Cristo", icono: "⚡" },
  { id: "carisma", titulo: "Nuestro Carisma", lema: "Configurados con Cristo compasivo y misericordioso", icono: "🔥" },
  { id: "ministerios", titulo: "Medios de Evangelización", lema: "Ministerios al servicio de Dios", icono: "📖" },
  { id: "programas", titulo: "Programas y Apostolados", lema: "Caminos de sanación y conversión", icono: "🕊️" },
  { id: "fundador", titulo: "Nuestro Fundador", lema: "Fernando Casillas Gallardo, Director General", icono: "👤" },
  { id: "historia", titulo: "Nuestra Historia", lema: "Un Don del Espíritu Santo en nuestro tiempo", icono: "📜" },
];

const seccionesDefault = [
  {
    id: "instituto", titulo: "Instituto Secular", subtitulo: "Para Hombres y Mujeres",
    contenido: `Sus dos ramas plasman el espíritu a imitación de Jesús Servidor y al estilo de la Santísima Virgen María.\n\nLos Servidores de Jesús por María, tienen como fin la gloria de Dios y la santificación que nace en el mismo corazón de Dios, en el seno de la Adorable Trinidad: Dios es Amor, en donde reside el origen de todo.\n\nOptando por los pobres de entre los más pobres y enfermos. Practicando la caridad a imagen del Divino Jesucristo.`,
    autoria: "\"Ser un testimonio vivo para los hombres de esta generación\" — Sto. Cura de Ars", icono: "✝️",
  },
  {
    id: "movimiento", titulo: "Movimiento Nacional", subtitulo: "Presencia de las Fraternidades",
    contenido: `La fraternidad se hará presente donde haya corazones rotos y urja la caridad de Cristo para solucionar los males que afectan.\n\n"Entonces les dijo: Vayan por todo el mundo, anuncien la Buena Noticia a toda la creación."\n\nServidores de Jesús por María tiene presencia en: Guadalajara, Toluca, Tuxtla Gutiérrez, Sombrerete, Aguascalientes, Playa del Carmen, Cancún y Cozumel.`,
    autoria: "Marcos 16, 15", icono: "🌍",
  },
  {
    id: "mision", titulo: "La Misión de SJM en el Mundo de Hoy", subtitulo: "Nuestra Misión",
    contenido: `La obra de la Evangelización es llevar a los hombres a una verdadera entrega personal a Cristo, y es la primera necesidad en la Iglesia actual.\n\nLos Servidores de Jesús por María, desean poner todo el esfuerzo y dedicación para dar respuesta a esta necesidad, permaneciendo abiertos a la acción creativa e imprevisible del Espíritu Santo.\n\n"…si Dios les ha dado el Don de comunicar su mensaje, háganlo según la fe que tienen…"`,
    autoria: "Rom. 12, 7-8 · 1 Pe. 4, 11", icono: "⚡",
  },
  {
    id: "carisma", titulo: "Nuestro Carisma", subtitulo: "La otra opción cuando lo has intentado todo",
    contenido: `Configurados con Cristo compasivo y misericordioso, anunciar la Buena Nueva, haciendo presente la misericordia de Dios y su redención a los más necesitados.\n\nLograr la salud del alma que ha sido dañada por las heridas de la vida, especialmente por la falta de amor. Llevar la vida de la persona a la gracia del Señor en el poder del Espíritu Santo.\n\nCuración Interior y liberación integral, es vendar corazones rotos, liberar al cautivo, abrir ojos a ciegos.`,
    autoria: "Lc. 4, 18 · Is. 61, 1", icono: "🔥",
  },
  {
    id: "ministerios", titulo: "Medios para la Evangelización", subtitulo: "Ministerios de Servidores de Jesús por María",
    contenido: `MINISTERIO DE EVANGELIZACIÓN\nTodos los seres humanos necesitamos de la sobreabundante riqueza de las gracias del Señor Jesús.\n\nMINISTERIO PASTORAL DE LA SALUD\nAcompañamiento presente y activo en pérdidas y carencias: espirituales, económicas y del medio ambiente.\n\nMINISTERIO DE CARIDAD Y ASISTENCIA\nLa caridad en acción, es servicio que se traduce en hacer presente a la "Iglesia Familia que no Abandona".\n\nMINISTERIO COMUNICARTE\nA través del arte transmitir sentimientos y valores del evangelio: letras, música, luz, movimiento y color.`,
    autoria: "Cfr. Ef. 2, 10", icono: "📖",
  },
  {
    id: "programas", titulo: "Programas y Apostolados", subtitulo: "Respondiendo al llamado de San Juan Pablo II",
    contenido: `CREESER — Camino, Verdad y Vida\nGrupo de autoayuda Cristocéntrico. Acogida, escucha y acompañamiento personal.\n\nMAGNIFICAT — Curación de Amor al Rescate\nEncuentro personal con Cristo Jesús. Retiros de Sanación Interior.\n\nELEMÁ — El Ejército del Más Amado\nFe Plena, Esperanza Firme y Ardiente Caridad.\n\nAGITADORES DE AGUA — Ministerio de Oración por Intercesión\nHombres y mujeres que con su oración interceden ante Dios.\n\nPLENITUD FINANCIERA — Mayordomía Cristiana\nTemas de actualidad con soporte bíblico sobre finanzas y administración.`,
    autoria: "Fuente: serjema.com.mx", icono: "🕊️",
  },
  {
    id: "fundador", titulo: "Nuestro Fundador", subtitulo: "Fernando Casillas Gallardo",
    contenido: `Fernando Casillas Gallardo, Director General de Servidores de Jesús por María, ha dedicado su vida a la evangelización y a la sanación interior de las personas heridas.\n\nBajo su liderazgo, SJM ha crecido desde sus inicios en Guadalajara, Jalisco, hasta convertirse en un movimiento de alcance nacional.`,
    autoria: "Contacto: sisepuede@serjema.com", icono: "👤",
  },
  {
    id: "historia", titulo: "Nuestra Historia", subtitulo: "Un Don del Espíritu Santo en nuestro tiempo",
    contenido: `"Vuestro celo nace de haber descubierto la belleza de Cristo, de su modo único de amar, encontrar, sanar la vida, alegrarla, confortarla."\n\nLos Servidores de Jesús por María nacieron como respuesta al llamado de evangelización en un mundo que cada vez más necesita la luz de Cristo.\n\nPara el comienzo de una gran Historia cuando lo has intentado todo. En los momentos difíciles lo último que se pierde es la esperanza… SJM es la otra opción.`,
    autoria: "BENEDICTO XVI, Discurso a los Institutos Seculares, 2007", icono: "📜",
  },
];

export default async function NosotrosPage() {
  // Resolver tenant → datos dinámicos del CMS
  const tenant = await resolverTenant();
  const orgId = tenant?.id;
  
  let seccionesCMS: any[] = [];
  if (orgId) {
    seccionesCMS = await obtenerSeccionesPagina(orgId, "nosotros");
  }

  // Usar datos del CMS si existen, si no, usar defaults estáticos
  const tieneContenidoCMS = seccionesCMS.length > 0;
  const secciones = tieneContenidoCMS
    ? seccionesCMS.map((s) => ({ id: s.id, titulo: s.titulo || "", subtitulo: s.subtitulo || "", contenido: s.contenido || "", autoria: s.autoria || "", icono: "📄", imagen_url: s.imagen_url }))
    : seccionesDefault;

  return (
    <div className="min-h-screen">
      {/* Hero de la página */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[180px] opacity-10 dark:opacity-15" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-400 rounded-full blur-[180px] opacity-10 dark:opacity-15" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" /> Conócenos
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
              Servidores de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 dark:from-blue-400 dark:via-purple-400 dark:to-rose-400">
                Jesús por María
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
              Un Don del Espíritu Santo en nuestro tiempo
            </p>
          </div>

          {/* Tarjetas de menú */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {(tieneContenidoCMS ? seccionesCMS.slice(0, 8).map(s => ({ id: s.id, titulo: s.titulo, lema: s.subtitulo || s.lema_tarjeta, icono: "📄" })) : tarjetasMenuDefault).map((tarjeta, idx) => (
              <a
                key={tarjeta.id}
                href={`#sec-${idx}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-[#2a2b3d]/60 bg-white/80 dark:bg-[#1a1b26]/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] p-4"
              >
                <div className="text-3xl mb-3">{tarjeta.icono}</div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight group-hover:text-[#00B4AA] transition-colors leading-snug">
                  {tarjeta.titulo}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium italic">
                  {tarjeta.lema}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#00B4AA] transition-colors">
                  <span className="w-4 h-0.5 bg-current rounded-full group-hover:w-6 transition-all" />
                  Ver más
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Secciones de contenido */}
      <div className="max-w-6xl mx-auto px-6 space-y-20 md:space-y-28 pb-20">
        {secciones.map((seccion, idx) => (
          <section key={seccion.id} id={`sec-${idx}`} className="scroll-mt-24">
            <div className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-start`}>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{seccion.icono}</span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      {seccion.titulo}
                    </h2>
                    <p className="text-sm font-bold text-[#00B4AA] uppercase tracking-wider mt-0.5">
                      {seccion.subtitulo}
                    </p>
                  </div>
                </div>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px] whitespace-pre-line mt-4">
                  {seccion.contenido}
                </div>
                {seccion.autoria && (
                  <p className="mt-4 text-[11px] text-slate-400 dark:text-[#5e5e72] italic font-medium">
                    — {seccion.autoria}
                  </p>
                )}
              </div>

              {/* Columna decorativa / imagen del CMS */}
              <div className="flex-shrink-0 w-full lg:w-80">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1a1b26] dark:to-[#151621] aspect-[4/3] flex items-center justify-center shadow-lg">
                  {(seccion as any).imagen_url ? (
                    <img src={(seccion as any).imagen_url} alt={seccion.titulo} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <span className="text-7xl opacity-20">{seccion.icono}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </div>
            </div>

            {idx < secciones.length - 1 && (
              <div className="mt-16 flex justify-center">
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* CTA final */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-800 dark:from-slate-900 dark:to-[#0f1015]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            ¿Quieres ser parte de esta misión?
          </h2>
          <p className="text-white/70 mt-4 text-lg max-w-xl mx-auto">
            Únete a los Servidores de Jesús por María y descubre el plan que Dios tiene para tu vida.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/contactanos" className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-white text-blue-700 px-10 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
              Contáctanos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/retiros-eventos" className="h-14 flex items-center justify-center gap-2 text-white border-2 border-white/30 rounded-2xl px-10 text-lg font-bold hover:bg-white/10 transition-colors">
              Ver Retiros
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
