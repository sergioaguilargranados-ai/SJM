import { getSedes } from "@/app/actions/consultas";
import NuevoServidorForm from "@/components/forms/NuevoServidorForm";

export const dynamic = 'force-dynamic';

export default async function NuevaAltaServidor() {
  const { data: sedes } = await getSedes();

  return (
    <div className="py-6">
      <NuevoServidorForm sedes={sedes || []} />
    </div>
  );
}
