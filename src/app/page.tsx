import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Heart, BookOpen, ShoppingBag, Users, Calendar, MapPin, Phone,
  Mail, MessageCircle, ChevronDown, Star, Globe, Shield, Cross, ShieldCheck,
  Music, HelpCircle, ExternalLink, Sparkles, Church
} from "lucide-react";

export const metadata = {
  title: "Servidores de Jesús por María | Un Don del Espíritu Santo en nuestro tiempo",
  description: "Evangelización, retiros de sanación interior, formación cristiana y acompañamiento espiritual. Configurados con Cristo compasivo y misericordioso.",
};

// ============================================================
// DATOS REALES extraídos de www.serjema.com.mx
// ============================================================

const ministerios = [
  {
    nombre: "Evangelización",
    descripcion: "Anunciar la Buena Nueva haciendo presente la misericordia de Dios y su redención a los más necesitados.",
    icono: "✝️",
    color: "from-blue-500 to-blue-700",
  },
  {
    nombre: "Pastoral de la Salud",
    descripcion: "Acompañamiento presente y activo en pérdidas y carencias: espirituales, económicas y del medio ambiente.",
    icono: "💚",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    nombre: "Caridad y Asistencia",
    descripcion: "Servicio que se traduce en hacer presente a la Iglesia Familia que no Abandona.",
    icono: "🤝",
    color: "from-amber-500 to-amber-700",
  },
  {
    nombre: "ComunicArte",
    descripcion: "A través del arte transmitir sentimientos y valores del evangelio: letras, música, luz, movimiento y color.",
    icono: "🎨",
    color: "from-purple-500 to-purple-700",
  },
];

const programas = [
  {
    nombre: "CreeSer",
    subtitulo: "Camino, Verdad y Vida",
    descripcion: "Grupo de autoayuda Cristocéntrico. Acogida, escucha y acompañamiento personal para lograr la salud del alma dañada por las heridas de la vida.",
    icono: "🕊️",
  },
  {
    nombre: "Magnificat",
    subtitulo: "Curación de Amor al Rescate",
    descripcion: "Encuentro personal con Cristo Jesús — EVANGELIZARTE PARA SANARTE. Retiros de Sanación Interior a través de las verdades del Evangelio.",
    icono: "🔥",
  },
  {
    nombre: "ELEMÁ",
    subtitulo: "El Ejército del Más Amado",
    descripcion: "Llevar a los hombres a una verdadera entrega personal a Cristo. Fe Plena, Esperanza Firme y Ardiente Caridad.",
    icono: "⚔️",
  },
  {
    nombre: "Agitadores de Agua",
    subtitulo: "Ministerio de Oración por Intercesión",
    descripcion: "Hombres y mujeres que con su oración interceden ante Dios para pedir Gracia y Bendición. La oración es la llave que abre el corazón de Dios.",
    icono: "🙏",
  },
  {
    nombre: "Plenitud Financiera",
    subtitulo: "Mayordomía Cristiana",
    descripcion: "Temas humanos de actualidad dirigidos a todo público con soporte bíblico sobre finanzas y administración bajo principios del Evangelio.",
    icono: "💫",
  },
];

const centrosSJM = [
  { ciudad: "Guadalajara, Jalisco", fb: "https://www.facebook.com/servidoresdejesuspormariagdl" },
  { ciudad: "Toluca, Edo. de México", fb: "https://www.facebook.com/Servidores-de-Jes%C3%BAs-por-Mar%C3%ADa-sede-Toluca-106918014279653/" },
  { ciudad: "Tuxtla Gutiérrez, Chiapas", fb: "https://www.facebook.com/profile.php?id=100082487376380" },
  { ciudad: "Sombrerete, Zacatecas", fb: "https://www.facebook.com/Servidores-de-Jesus-por-Maria-Sombrerete-Zacatecas-402383419877959" },
  { ciudad: "Aguascalientes", fb: "https://www.facebook.com/SJM-Aguascalientes-101668509277274" },
  { ciudad: "Playa del Carmen, Q. Roo", fb: "https://www.facebook.com/servidoresdejesuspormariaplayadelcarmen" },
  { ciudad: "Cancún, Q. Roo", fb: "https://www.facebook.com/profile.php?id=100082223477231" },
  { ciudad: "Cozumel, Q. Roo", fb: "https://www.facebook.com/profile.php?id=100082635480585" },
];

const testimonios = [
  {
    texto: "Llegué roto por dentro. Después del retiro de sanación interior, encontré la paz que había buscado toda mi vida. Jesús realmente sana las heridas del alma.",
    autor: "Servidor SJM, Guadalajara",
    estrellas: 5,
  },
  {
    texto: "CreeSer me devolvió la esperanza. El acompañamiento, la escucha y la fraternidad me ayudaron a entender que no estoy solo. Dios me ama tal como soy.",
    autor: "Participante CreeSer, Toluca",
    estrellas: 5,
  },
  {
    texto: "Magnificat fue un antes y un después en mi matrimonio. La sanación interior nos permitió perdonar y reconstruir nuestra relación desde el amor de Cristo.",
    autor: "Matrimonio SJM, Chiapas",
    estrellas: 5,
  },
];

const faqs = [
  {
    pregunta: "¿Qué es un Retiro de Sanación Interior?",
    respuesta: "Es un ENCUENTRO con CRISTO JESÚS para la curación de las etapas de la vida a través de las verdades fundamentales del Evangelio. Consiste en la recuperación de la espiritualidad de la autoestima como clave para la conversión.",
  },
  {
    pregunta: "¿Quiénes pueden participar?",
    respuesta: "Todos los hombres y mujeres de buena voluntad que estén en búsqueda de la verdad y la vida interior. No se requiere experiencia previa, solo el deseo de encuentro con Dios.",
  },
  {
    pregunta: "¿Cómo me inscribo a un retiro?",
    respuesta: "Ubica el centro SJM más cercano a tu ciudad y contacta a su representante para conocer las fechas. También puedes inscribirte directamente en nuestra plataforma en línea.",
  },
  {
    pregunta: "¿Los retiros tienen costo?",
    respuesta: "Se pide una aportación sugerida que cubre hospedaje y alimentación. Nadie se queda fuera por falta de recursos; existen becas disponibles.",
  },
  {
    pregunta: "¿Qué es el programa CreeSer?",
    respuesta: "Es un grupo de autoayuda Cristocéntrico que busca la salud del alma dañada por las heridas de la vida, especialmente por la falta de amor. Utiliza la palabra de Dios, acompañamiento personal y un programa de 8 pasos para la recuperación.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f1015] font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      
      {/* ============================================ */}
      {/* NAVBAR STICKY */}
      {/* ============================================ */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1015]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icon.png" alt="SJM" width={40} height={40} className="drop-shadow" />
            <div className="hidden sm:block">
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight block leading-none">SJM Nacional</span>
              <span className="text-[10px] text-slate-500 dark:text-[#8e8ea0] font-medium">Servidores de Jesús por María</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#carisma" className="hover:text-slate-900 dark:hover:text-white transition-colors">Carisma</a>
            <a href="#ministerios" className="hover:text-slate-900 dark:hover:text-white transition-colors">Ministerios</a>
            <a href="#programas" className="hover:text-slate-900 dark:hover:text-white transition-colors">Programas</a>
            <a href="#retiros" className="hover:text-slate-900 dark:hover:text-white transition-colors">Retiros</a>
            <a href="#testimonios" className="hover:text-slate-900 dark:hover:text-white transition-colors">Testimonios</a>
            <a href="#centros" className="hover:text-slate-900 dark:hover:text-white transition-colors">Centros</a>
            <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Blog</Link>
            <Link href="/tienda" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> Tienda</Link>
            <Link href="/donativos" className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> Donativos</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/donativos" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">
              <Heart className="w-3 h-3" /> Donar
            </Link>
            <Link href="/login" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">
              Acceso Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO — "Un Don del Espíritu Santo" */}
      {/* ============================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[150px] opacity-15 dark:opacity-20" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-400 rounded-full blur-[150px] opacity-15 dark:opacity-20" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <Image src="/icon.png" alt="SJM Logo" width={160} height={160} className="drop-shadow-2xl hover:scale-105 transition-transform" />
          </div>
          
          <p className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-4">
            Un Don del Espíritu Santo en nuestro tiempo
          </p>
          
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
            Servidores de<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 dark:from-blue-400 dark:via-purple-400 dark:to-rose-400">
              Jesús por María
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mt-6">
            Configurados con Cristo compasivo y misericordioso, anunciamos la Buena Nueva, 
            haciendo presente la misericordia de Dios y su redención a los más necesitados.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/registro/1" className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-200 dark:shadow-none">
              Inscríbete al Retiro <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#carisma" className="h-14 w-full sm:w-auto flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-10 text-lg font-bold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
              Conócenos
            </a>
          </div>

          {/* Cita de Benedicto XVI */}
          <div className="max-w-3xl mx-auto mt-16 p-6 bg-slate-50 dark:bg-[#1a1b26] rounded-2xl border border-slate-200 dark:border-[#2a2b3d]">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
              &ldquo;Vuestro celo nace de haber descubierto la belleza de Cristo, de su modo único de amar, encontrar, sanar la vida, 
              alegrarla, confortarla. Y esta belleza es la que vuestra vida quiere cantar.&rdquo;
            </p>
            <p className="text-xs text-slate-400 dark:text-[#8e8ea0] mt-3 font-bold">— BENEDICTO XVI, Discurso a los Institutos Seculares, 2007</p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CARISMA */}
      {/* ============================================ */}
      <section id="carisma" className="py-20 md:py-28 bg-slate-50 dark:bg-[#151621]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" /> Nuestro Carisma
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              La otra opción cuando<br />lo has intentado todo
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
              En los momentos difíciles, lo último que se pierde es la esperanza. SJM es la otra opción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#1a1b26] rounded-3xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                ✝️ Para Hombres y Mujeres
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Sus dos ramas plasman el espíritu a imitación de Jesús Servidor y al estilo de la Santísima Virgen María.
                Los Servidores de Jesús por María tienen como fin la gloria de Dios y la santificación que nace en el mismo corazón de Dios.
              </p>
              <blockquote className="mt-4 pl-4 border-l-2 border-blue-500 text-sm text-slate-500 dark:text-slate-400 italic">
                &ldquo;Porque para Dios nada es imposible&rdquo; — Lc. 1, 37
              </blockquote>
            </div>
            <div className="bg-white dark:bg-[#1a1b26] rounded-3xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                🌍 Nuestra Misión
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Curación Interior y liberación integral: vendar corazones rotos, liberar al cautivo, abrir ojos a ciegos, 
                con la Buena Nueva, con la gracia abundante del Señor Jesús.
              </p>
              <blockquote className="mt-4 pl-4 border-l-2 border-rose-500 text-sm text-slate-500 dark:text-slate-400 italic">
                &ldquo;El Hijo del Hombre no vino a ser servido, sino a servir y dar su vida en rescate de muchos&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MINISTERIOS */}
      {/* ============================================ */}
      <section id="ministerios" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Ministerios
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Medios para la Evangelización
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ministerios.map((min, idx) => (
              <div key={idx} className="group bg-white dark:bg-[#1a1b26] rounded-2xl p-6 border border-slate-200 dark:border-[#2a2b3d] hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-4">{min.icono}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{min.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{min.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROGRAMAS (CreeSer, Magnificat, ELEMÁ, etc.) */}
      {/* ============================================ */}
      <section id="programas" className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white dark:from-[#151621] dark:to-[#0f1015]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Programas y Apostolados
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Caminos de Sanación
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
              Respondiendo al llamado de San Juan Pablo II en Santo Domingo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programas.map((prog, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1b26] rounded-2xl p-6 border border-slate-200 dark:border-[#2a2b3d] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{prog.icono}</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{prog.nombre}</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{prog.subtitulo}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4">{prog.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* RETIROS — CTA */}
      {/* ============================================ */}
      <section id="retiros" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-800 dark:from-slate-900 dark:to-[#0f1015]" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Evangelizarte para Sanarte</span>
          <h2 className="text-3xl md:text-6xl font-black text-white mt-4 tracking-tight leading-[1.1]">
            Retiros de<br />Sanación Interior
          </h2>
          <p className="text-lg text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
            Un encuentro con Cristo Jesús para la curación de las etapas de la vida.
            Recupera la espiritualidad de la autoestima como clave para la conversión.
          </p>
          <p className="text-white/50 mt-4 italic text-sm">
            &ldquo;Vengan a mí todos los que están cargados y abrumados que yo les daré descanso&rdquo; — Jesús
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/registro/1" className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-white text-blue-700 px-10 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
              Inscribirme Ahora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#centros" className="h-14 flex items-center justify-center gap-2 text-white border-2 border-white/30 rounded-2xl px-10 text-lg font-bold hover:bg-white/10 transition-colors">
              <MapPin className="w-5 h-5" /> Ver Sedes
            </a>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIOS */}
      {/* ============================================ */}
      <section id="testimonios" className="py-20 md:py-28 bg-slate-50 dark:bg-[#151621]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <Star className="w-3.5 h-3.5" /> Testimonios
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Dios nos ama, Jesús vive<br />y es nuestro Salvador
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3">Tu testimonio es el mejor instrumento para proclamar la Gloria de Dios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonios.map((test, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1b26] rounded-2xl p-8 border border-slate-200 dark:border-[#2a2b3d] shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: test.estrellas }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">&ldquo;{test.texto}&rdquo;</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-4">{test.autor}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href="mailto:sisepuede@serjema.com" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
              <Mail className="w-4 h-4" /> Envíanos tu testimonio: sisepuede@serjema.com
            </a>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CENTROS SJM */}
      {/* ============================================ */}
      <section id="centros" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <MapPin className="w-3.5 h-3.5" /> Presencia Nacional
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Centros SJM
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Ubica el centro más cercano a tu ciudad y contacta a su representante.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {centrosSJM.map((centro, idx) => (
              <a key={idx} href={centro.fb} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{centro.ciudad}</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" /> Facebook
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PREGUNTAS FRECUENTES */}
      {/* ============================================ */}
      <section id="faq" className="py-20 md:py-28 bg-slate-50 dark:bg-[#151621]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              <HelpCircle className="w-3.5 h-3.5" /> Preguntas Frecuentes
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              ¿Tienes dudas?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#2a2b3d]/30 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white pr-4">{faq.pregunta}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.respuesta}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DONATIVOS CTA */}
      {/* ============================================ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-500" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Heart className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Tu aportación transforma vidas
          </h2>
          <p className="text-lg text-white/80 mt-4 max-w-xl mx-auto">
            &ldquo;Dad y se os dará&rdquo; — Cada donativo hace posible que más personas vivan la experiencia de un retiro de sanación interior.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/donativos" className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-white text-rose-600 px-10 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
              <Heart className="w-5 h-5" /> Quiero Donar
            </Link>
            <a href="mailto:sisepuede@serjema.com" className="h-14 flex items-center justify-center gap-2 text-white border-2 border-white/30 rounded-2xl px-10 text-lg font-bold hover:bg-white/10 transition-colors">
              <Mail className="w-5 h-5" /> Contactar
            </a>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONTACTO */}
      {/* ============================================ */}
      <section id="contacto" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Contáctanos</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Fernando Casillas Gallardo — Director General, Servidores de Jesús por María</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="mailto:sisepuede@serjema.com" className="flex items-center gap-4 p-6 bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"><Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
              <div><p className="text-sm font-bold text-slate-900 dark:text-white">Correo</p><p className="text-xs text-slate-500 dark:text-slate-400">sisepuede@serjema.com</p></div>
            </a>
            <a href="https://www.instagram.com/servidorespormaria/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center"><Globe className="w-6 h-6 text-pink-600 dark:text-pink-400" /></div>
              <div><p className="text-sm font-bold text-slate-900 dark:text-white">Instagram</p><p className="text-xs text-slate-500 dark:text-slate-400">@servidorespormaria</p></div>
            </a>
            <a href="https://www.facebook.com/servidoresdejesuspormariagdl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"><Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
              <div><p className="text-sm font-bold text-slate-900 dark:text-white">Facebook</p><p className="text-xs text-slate-500 dark:text-slate-400">SJM Guadalajara</p></div>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="bg-slate-900 dark:bg-[#0a0b12] text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/icon.png" alt="SJM" width={36} height={36} />
                <span className="text-white font-black text-lg">SJM Nacional</span>
              </div>
              <p className="text-sm leading-relaxed">
                Servidores de Jesús por María. Un Don del Espíritu Santo en nuestro tiempo.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Navegación</h4>
              <div className="space-y-2 text-sm">
                <a href="#carisma" className="block hover:text-white transition-colors">Carisma</a>
                <a href="#ministerios" className="block hover:text-white transition-colors">Ministerios</a>
                <a href="#programas" className="block hover:text-white transition-colors">Programas</a>
                <a href="#retiros" className="block hover:text-white transition-colors">Retiros</a>
                <a href="#testimonios" className="block hover:text-white transition-colors">Testimonios</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Recursos</h4>
              <div className="space-y-2 text-sm">
                <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
                <Link href="/tienda" className="block hover:text-white transition-colors">Tienda</Link>
                <Link href="/donativos" className="block hover:text-white transition-colors">Donativos</Link>
                <Link href="/dashboard" className="block hover:text-white transition-colors">Plataforma Admin</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contacto</h4>
              <div className="space-y-2 text-sm">
                <p>sisepuede@serjema.com</p>
                <p>www.serjema.com.mx</p>
                <div className="flex items-center gap-3 mt-4">
                  <a href="https://www.facebook.com/servidoresdejesuspormariagdl" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </a>
                  <a href="https://www.instagram.com/servidorespormaria/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                    <Globe className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© 2026 Servidores de Jesús por María — Todos los derechos reservados</p>
            <p className="text-slate-600">Plataforma SJM v1.065 • Para Gloria de Dios</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
