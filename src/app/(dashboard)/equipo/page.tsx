import { getEquipoEventos, getEventosCompleto, getServidoresCompleto } from "@/app/actions/catalogos";
import EquipoClientView from "./EquipoClientView";

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const [res, eventosRes, servidoresRes] = await Promise.all([
    getEquipoEventos(),
    getEventosCompleto(),
    getServidoresCompleto()
  ]);
  
  return <EquipoClientView 
    datos={res.data || []} 
    eventos={eventosRes.data || []}
    servidores={servidoresRes.data || []}
  />;
}
