import { getSedes, getMinisterios, getCargos, getEstadosRepublica } from "@/app/actions/consultas";
import NuevoServidorForm from "@/components/forms/NuevoServidorForm";

export const dynamic = 'force-dynamic';

export default async function NuevaAltaServidor() {
  const [
    { data: sedes },
    { data: ministerios },
    { data: cargos },
    { data: estados }
  ] = await Promise.all([
    getSedes(),
    getMinisterios(),
    getCargos(),
    getEstadosRepublica()
  ]);

  return (
    <div className="py-6">
      <NuevoServidorForm 
        sedes={sedes || []} 
        ministerios={ministerios || []}
        cargos={cargos || []}
        estados={estados || []}
      />
    </div>
  );
}
