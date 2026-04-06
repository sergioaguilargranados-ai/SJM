import { getGastosEventos, getClasificacionesGastoCompleto } from "@/app/actions/catalogos";
import { getEventosRecientes } from "@/app/actions/consultas";
import FinanzasClientView from "./FinanzasClientView";

export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  const [gastosRes, eventosRes, clasificacionesRes] = await Promise.all([
    getGastosEventos(),
    getEventosRecientes(),
    getClasificacionesGastoCompleto(),
  ]);

  return (
    <FinanzasClientView
      gastos={gastosRes.data || []}
      eventos={eventosRes.data || []}
      clasificaciones={clasificacionesRes.data || []}
    />
  );
}
