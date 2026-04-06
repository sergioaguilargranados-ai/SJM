import { getEquipoEventos } from "@/app/actions/catalogos";
import EquipoClientView from "./EquipoClientView";

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const res = await getEquipoEventos();
  return <EquipoClientView datos={res.data || []} />;
}
