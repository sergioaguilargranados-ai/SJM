import { getEvaluacionesEventos } from "@/app/actions/catalogos";
import EvaluacionesClientView from "./EvaluacionesClientView";

export const dynamic = "force-dynamic";

export default async function EvaluacionesPage() {
  const res = await getEvaluacionesEventos();
  return <EvaluacionesClientView datos={res.data || []} />;
}
