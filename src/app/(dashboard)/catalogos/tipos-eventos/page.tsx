import { getTiposEventosCompleto } from "@/app/actions/catalogos";
import { validarAccesoPlan } from "@/lib/permisos";
import TiposEventosClientView from "./TiposEventosClientView";

export const dynamic = "force-dynamic";

export default async function TiposEventosPage() {
  const { orgId } = await validarAccesoPlan("tipos-eventos");
  const res = await getTiposEventosCompleto();
  
  const datos = (res.data || []).filter(
    (t: any) => t.organizacion_id === orgId
  );

  return <TiposEventosClientView datos={datos} organizacionId={orgId} />;
}

