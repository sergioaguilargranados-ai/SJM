import { getEquipoEventos } from "@/app/actions/catalogos";
import { getEventosRecientes, getServidores } from "@/app/actions/consultas";
import EquipoClientView from "./EquipoClientView";

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const [res, eventosRes, servidoresRes] = await Promise.all([
    getEquipoEventos(),
    getEventosRecientes(),
    getServidores()
  ]);
  
  return <EquipoClientView 
    datos={res.data || []} 
    eventos={eventosRes.data || []}
    servidores={servidoresRes.data || []}
  />;
}
