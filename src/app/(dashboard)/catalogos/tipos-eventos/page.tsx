import { getTiposEventosCompleto } from "@/app/actions/catalogos";
import { getUsuarioSesion } from "@/lib/sesion";
import TiposEventosClientView from "./TiposEventosClientView";

export const dynamic = "force-dynamic";

export default async function TiposEventosPage() {
  const usuario = await getUsuarioSesion();
  const res = await getTiposEventosCompleto();
  
  const datos = (res.data || []).filter(
    (t: any) => t.organizacion_id === usuario.organizacion_id
  );

  return <TiposEventosClientView datos={datos} organizacionId={usuario.organizacion_id} />;
}
