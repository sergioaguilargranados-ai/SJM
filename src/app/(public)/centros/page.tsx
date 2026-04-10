import { Metadata } from "next";
import { MapPin, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Centros SJM | Servidores de Jesús por María",
  description: "Ubica el centro SJM más cercano a tu ciudad y contacta a su representante.",
};

const centros = [
  { ciudad: "Guadalajara, Jalisco", facebook: "https://www.facebook.com/servidoresdejesuspormariagdl" },
  { ciudad: "Toluca, Edo. de México", facebook: "https://www.facebook.com/Servidores-de-Jes%C3%BAs-por-Mar%C3%ADa-sede-Toluca-106918014279653/" },
  { ciudad: "Tuxtla Gutiérrez, Chiapas", facebook: "https://www.facebook.com/profile.php?id=100082487376380" },
  { ciudad: "Sombrerete, Zacatecas", facebook: "https://www.facebook.com/Servidores-de-Jesus-por-Maria-Sombrerete-Zacatecas-402383419877959" },
  { ciudad: "Aguascalientes", facebook: "https://www.facebook.com/SJM-Aguascalientes-101668509277274" },
  { ciudad: "Playa del Carmen, Q. Roo", facebook: "https://www.facebook.com/servidoresdejesuspormariaplayadelcarmen" },
  { ciudad: "Cancún, Q. Roo", facebook: "https://www.facebook.com/profile.php?id=100082223477231" },
  { ciudad: "Cozumel, Q. Roo", facebook: "https://www.facebook.com/profile.php?id=100082635480585" },
];

export default function CentrosPage() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-400 rounded-full blur-[180px] opacity-10" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <MapPin className="w-14 h-14 text-purple-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Centros SJM
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Ubica el centro más cercano a tu ciudad y contacta a su representante
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {centros.map((centro, idx) => (
            <a
              key={idx}
              href={centro.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-[#1a1b26] rounded-2xl p-6 border border-slate-200 dark:border-[#2a2b3d] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{centro.ciudad}</h3>
              <span className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 mt-2 font-medium group-hover:underline">
                <ExternalLink className="w-3 h-3" /> Facebook
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
