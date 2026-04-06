import { getCargosCompleto } from "@/app/actions/catalogos";
import CargosClientView from "./CargosClientView";

export const dynamic = "force-dynamic";

export default async function CargosPage() {
  const res = await getCargosCompleto();
  return <CargosClientView datos={res.data || []} />;
}
