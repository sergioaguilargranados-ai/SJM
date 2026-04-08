import { getMinisteriosCompleto } from "@/app/actions/catalogos";
import { validarAccesoPlan } from "@/lib/permisos";
import MinisteriosClientView from "./MinisteriosClientView";

export const dynamic = "force-dynamic";

export default async function MinisteriosPage() {
  const { orgId } = await validarAccesoPlan("ministerios");
  const res = await getMinisteriosCompleto();
  
  const datos = (res.data || []).filter(
    (m: any) => m.organizacion_id === orgId
  );

  return <MinisteriosClientView datos={datos} organizacionId={orgId} />;
}

