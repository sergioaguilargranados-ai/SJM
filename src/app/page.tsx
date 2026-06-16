import Image from "next/image";
import Link from "next/link";
import { 
  Menu, User, Briefcase, CalendarDays, Building2, MapPin, 
  ArrowRight, ShieldCheck, HeartHandshake, Globe, Gem,
  Settings, Plane, Calendar
} from "lucide-react";
import { FooterPublico } from "@/components/landing/FooterPublico";

export const metadata = {
  title: "AS Operadora de Viajes y Eventos",
  description: "Viajes y eventos diseñados para inspirar, conectar y crecer. Soluciones para viajeros, agencias de viajes, agencias de eventos y empresas.",
};

export default function LandingAsOperadora() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-[var(--background)] text-[var(--foreground)] selection:bg-[#000000] selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-black tracking-tighter">AS</span>
            <div className="flex flex-col border-l border-gray-300 dark:border-gray-700 pl-3 ml-2">
              <span className="text-[10px] font-bold tracking-widest uppercase leading-tight">Operadora de</span>
              <span className="text-[10px] font-bold tracking-widest uppercase leading-tight">Viajes y Eventos</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/registro"
              className="hidden md:flex items-center justify-center h-10 px-6 bg-[#000000] dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-none hover:opacity-80 transition-opacity"
            >
              Regístrate
            </Link>
            <button className="md:hidden p-2 text-[var(--foreground)]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO PRINCIPAL */}
      <section className="relative w-full bg-[var(--surface)] overflow-hidden border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight max-w-2xl text-[#000000] dark:text-white">
              Viajes y eventos diseñados para inspirar, conectar y crecer.
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              Soluciones para viajeros, agencias de viajes, agencias de eventos y empresas con atención personalizada y experiencias memorables en cada destino.
            </p>
            
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-3xl">
              <Link href="/registro?tipo=viajero" className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:border-black dark:hover:border-white transition-colors group">
                <User className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                <span>Soy viajero</span>
              </Link>
              <Link href="/registro?tipo=agencia_viajes" className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:border-black dark:hover:border-white transition-colors group">
                <Plane className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                <span>Soy agencia de viajes</span>
              </Link>
              <Link href="/registro?tipo=agencia_eventos" className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:border-black dark:hover:border-white transition-colors group">
                <Calendar className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                <span>Soy agencia de eventos</span>
              </Link>
              <Link href="/registro?tipo=empresa" className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium hover:border-black dark:hover:border-white transition-colors group">
                <Building2 className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white" />
                <span>Soy empresa</span>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full relative min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
            {/* TODO: Reemplazar por imagen 14 de Santorini (R2/Public) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
          </div>
        </div>
      </section>

      {/* 3. ¿CÓMO PODEMOS AYUDARTE? */}
      <section className="py-20 md:py-28 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">¿Cómo podemos ayudarte?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Viajeros */}
            <div className="group bg-[var(--surface)] p-8 rounded-xl flex flex-col h-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-sm mb-6">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Viajeros</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">Viajes para cada estilo de vida y presupuesto.</p>
              <ul className="text-sm space-y-2 mb-8 text-gray-500">
                <li>• Paquetes personalizados</li>
                <li>• Viajes grupales</li>
                <li>• Cruceros</li>
              </ul>
              <Link href="/registro?tipo=viajero" className="inline-flex items-center text-sm font-semibold hover:underline">
                Explorar viajes <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Agencias de Viajes */}
            <div className="group bg-[var(--surface)] p-8 rounded-xl flex flex-col h-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-sm mb-6">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Agencias de Viajes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">Tu mejor aliado para hacer crecer tu negocio.</p>
              <ul className="text-sm space-y-2 mb-8 text-gray-500">
                <li>• Tarifas preferenciales</li>
                <li>• Creación de grupos</li>
                <li>• Soporte especializado 24/7</li>
              </ul>
              <Link href="/registro?tipo=agencia_viajes" className="inline-flex items-center text-sm font-semibold hover:underline">
                Afiliar mi agencia <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Agencias de Eventos */}
            <div className="group bg-[var(--surface)] p-8 rounded-xl flex flex-col h-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-sm mb-6">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Agencias de Eventos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">Soluciones completas para eventos únicos.</p>
              <ul className="text-sm space-y-2 mb-8 text-gray-500">
                <li>• Organización integral</li>
                <li>• Logística y producción</li>
                <li>• Proveedores especializados</li>
              </ul>
              <Link href="/registro?tipo=agencia_eventos" className="inline-flex items-center text-sm font-semibold hover:underline">
                Conocer más <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {/* Empresas */}
            <div className="group bg-[var(--surface)] p-8 rounded-xl flex flex-col h-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-[#111] rounded-full flex items-center justify-center shadow-sm mb-6">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">Empresas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow">Soluciones para viajes y eventos corporativos.</p>
              <ul className="text-sm space-y-2 mb-8 text-gray-500">
                <li>• Viajes de incentivo</li>
                <li>• Congresos y ferias</li>
                <li>• Integración de equipos</li>
              </ul>
              <Link href="/registro?tipo=empresa" className="inline-flex items-center text-sm font-semibold hover:underline">
                Solicitar propuesta <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINOS QUE TE ESPERAN */}
      <section className="py-20 md:py-28 bg-[var(--surface)] border-y border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Destinos que te esperan</h2>
            <h3 className="font-serif text-4xl md:text-5xl font-bold mb-4">Descubre el mundo</h3>
            <p className="text-gray-600 dark:text-gray-400">Cada continente, experiencias únicas y momentos que recordarás siempre.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { nombre: "América", desc: "Naturaleza, cultura y aventura.", img: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?q=80&w=800&auto=format&fit=crop" },
              { nombre: "Europa", desc: "Historia, arte y elegancia.", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop" },
              { nombre: "África", desc: "Vida salvaje y paisajes únicos.", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop" },
              { nombre: "Asia", desc: "Tradición, modernidad e inspiración.", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop" },
              { nombre: "Oceanía", desc: "Playas, ciudades y naturaleza excepcional.", img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop" },
            ].map((destino) => (
              <div key={destino.nombre} className="group cursor-pointer">
                <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-4">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${destino.img}')` }}
                  ></div>
                </div>
                <h4 className="font-serif font-bold text-lg">{destino.nombre}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{destino.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NUESTROS SERVICIOS */}
      <section className="py-20 md:py-28 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-4">Nuestros Servicios</h2>
            <h3 className="font-serif text-4xl md:text-5xl font-bold">Soluciones para cada necesidad</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Viajes Vacacionales", desc: "Experiencias diseñadas para disfrutar, descansar y crear recuerdos inolvidables.", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" },
              { title: "Grupos y Convenciones", desc: "Organizamos eventos y viajes que conectan, motivan y generan impacto.", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop" },
              { title: "Operación para Agencias", desc: "Herramientas, tarifas competitivas y acompañamiento experto.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" },
            ].map((servicio, i) => (
              <div key={i} className="flex flex-col">
                <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${servicio.img}')` }}
                  ></div>
                </div>
                <h4 className="font-serif text-xl font-bold mb-2">{servicio.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">{servicio.desc}</p>
                <Link href="/registro" className="inline-flex items-center text-sm font-semibold hover:underline">
                  Conoce más <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BENEFICIOS */}
      <section className="py-12 border-t border-[var(--card-border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <Gem className="w-8 h-8 text-black dark:text-white shrink-0" strokeWidth={1} />
              <div>
                <h4 className="font-bold text-sm mb-1">Experiencias memorables</h4>
                <p className="text-xs text-gray-500">Diseñamos viajes cuidadosamente para cada necesidad y presupuesto.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <User className="w-8 h-8 text-black dark:text-white shrink-0" strokeWidth={1} />
              <div>
                <h4 className="font-bold text-sm mb-1">Atención personalizada</h4>
                <p className="text-xs text-gray-500">Un asesor te acompaña antes, durante y después de tu viaje.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Globe className="w-8 h-8 text-black dark:text-white shrink-0" strokeWidth={1} />
              <div>
                <h4 className="font-bold text-sm mb-1">Destinos selectos</h4>
                <p className="text-xs text-gray-500">Opciones nacionales e internacionales para cada tipo de viajero y empresa.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-black dark:text-white shrink-0" strokeWidth={1} />
              <div>
                <h4 className="font-bold text-sm mb-1">Protección de datos</h4>
                <p className="text-xs text-gray-500">Tu información está segura con tecnología y procesos certificados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECCIÓN ESPECIAL PARA AGENCIAS DE VIAJES */}
      <section className="py-20 md:py-28 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/10 text-xs font-bold tracking-widest uppercase rounded-sm mb-6">Para Agencias de Viajes</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Tu aliado de negocios</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl">
                Trabajamos juntos para que tu agencia crezca más, con la tranquilidad de tener un equipo que te respalda.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Settings className="w-6 h-6 text-white shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Herramientas</h4>
                    <p className="text-sm text-gray-400">Plataforma fácil de usar para cotizar, reservar y administrar.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Gem className="w-6 h-6 text-white shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Tarifas competitivas</h4>
                    <p className="text-sm text-gray-400">Acceso a tarifas preferenciales y promociones exclusivas para tu agencia.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <HeartHandshake className="w-6 h-6 text-white shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Acompañamiento experto</h4>
                    <p className="text-sm text-gray-400">Soporte y capacitación constante para impulsar tu crecimiento.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/registro?tipo=agencia_viajes" className="inline-flex items-center justify-center h-12 px-8 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                  Conocer más
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full relative min-h-[400px] lg:min-h-[500px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-24 md:py-32 bg-[var(--background)] text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-12">Tu próximo viaje comienza aquí.</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/registro?tipo=viajero" className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-[var(--surface)] transition-all">
              <User className="w-6 h-6 mb-3" />
              <span className="text-sm font-bold">Registrarme como viajero</span>
            </Link>
            <Link href="/registro?tipo=agencia_viajes" className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-[var(--surface)] transition-all">
              <Plane className="w-6 h-6 mb-3" />
              <span className="text-sm font-bold">Registrar mi agencia de viajes</span>
            </Link>
            <Link href="/registro?tipo=agencia_eventos" className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-[var(--surface)] transition-all">
              <CalendarDays className="w-6 h-6 mb-3" />
              <span className="text-sm font-bold">Registrar mi agencia de eventos</span>
            </Link>
            <Link href="/registro?tipo=empresa" className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-[var(--surface)] transition-all">
              <Building2 className="w-6 h-6 mb-3" />
              <span className="text-sm font-bold">Solicitar propuesta empresarial</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <FooterPublico 
        version="v1.190 - AS Operadora" 
        logoUrl="/logo-sjm-oficial.png" 
        organizacion="AS Operadora de Viajes y Eventos" 
      />
    </div>
  );
}
