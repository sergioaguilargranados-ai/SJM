import { getClasificacionesGastoCompleto } from "@/app/actions/catalogos";
import ClasificacionesGastoClientView from "./ClasificacionesGastoClientView";

export const dynamic = "force-dynamic";

export default async function ClasificacionesGastoPage() {
  const res = await getClasificacionesGastoCompleto();
  return <ClasificacionesGastoClientView datos={res.data || []} />;
}
