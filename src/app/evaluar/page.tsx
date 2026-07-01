import FormularioEvaluacionPublico from "./FormularioEvaluacionPublico";
import { getEventosRecientes } from "@/app/actions/consultas";

export const dynamic = "force-dynamic";

export default async function EvaluarPage() {
  const { data: eventos = [] } = await getEventosRecientes();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <FormularioEvaluacionPublico eventos={eventos} />
      </div>
    </div>
  );
}
