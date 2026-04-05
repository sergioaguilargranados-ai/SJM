import { getSedes, getCasasRetiro, getTiposEventos } from "@/app/actions/consultas";
import NuevoEventoForm from "@/components/forms/NuevoEventoForm";

export const dynamic = 'force-dynamic';

export default async function NuevoEventoPage() {
  const [sedesRes, casasRes, tiposRes] = await Promise.all([
    getSedes(),
    getCasasRetiro(),
    getTiposEventos()
  ]);

  return (
    <div className="py-6 min-h-screen">
      <NuevoEventoForm 
        sedes={sedesRes.data || []} 
        casas={casasRes.data || []} 
        tipos={tiposRes.data || []} 
      />
    </div>
  );
}
