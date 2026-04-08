import { getSedesCompleto } from "@/app/actions/catalogos";
import { validarAccesoPlan } from "@/lib/permisos";
import { SedesClientView } from "./SedesClientView";

export const dynamic = "force-dynamic";

export default async function SedesPage() {
  const { orgId } = await validarAccesoPlan("sedes");
  const sedesRes = await getSedesCompleto();
  
  // Filtrar sedes por organización
  const sedes = (sedesRes.data || []).filter(
    (s: any) => s.organizacion_id === orgId
  );

  return <SedesClientView datos={sedes} organizacionId={orgId} />;
}

