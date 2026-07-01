import FormularioEvaluacionPublico from "./FormularioEvaluacionPublico";
import { getEventosCompleto } from "@/app/actions/catalogos";

export const dynamic = "force-dynamic";

export default async function EvaluarPage() {
  const { data: eventos = [] } = await getEventosCompleto();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <FormularioEvaluacionPublico eventos={eventos} />
      </div>
    </div>
  );
}
