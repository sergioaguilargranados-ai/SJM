import { getEstadosRepublica } from "@/app/actions/catalogos";
import EstadosClientView from "./EstadosClientView";

export const dynamic = "force-dynamic";

export default async function EstadosPage() {
  const res = await getEstadosRepublica();
  return <EstadosClientView datos={res.data || []} />;
}
