import { getEventosRecientes, getSedes, getCasasRetiro, getTiposEventos } from "@/app/actions/consultas";
import EventosClientView from "./EventosClientView";
import { getUsuarioSesion } from "@/lib/sesion";

export const dynamic = 'force-dynamic';

export default async function ReporteRetiros() {
  const session = await getUsuarioSesion();
  const isAdmin = session.rol_nombre?.toLowerCase().includes("admin") || false;

  const [evtRes, sedesRes, casasRes, tiposRes] = await Promise.all([
    getEventosRecientes(),
    getSedes(),
    getCasasRetiro(),
    getTiposEventos()
  ]);

  const eventos = evtRes.data || [];
  const sedes = sedesRes.data || [];
  const casas = casasRes.data || [];
  const tipos = tiposRes.data || [];

  return (
    <div className="w-full">
      <EventosClientView 
        eventos={eventos} 
        sedes={sedes} 
        casas={casas} 
        tipos={tipos}
        isAdmin={isAdmin}
      />
    </div>
  );
}
