import { getMinisteriosCompleto } from "@/app/actions/catalogos";
import { getUsuarioSesion } from "@/lib/sesion";
import MinisteriosClientView from "./MinisteriosClientView";

export const dynamic = "force-dynamic";

export default async function MinisteriosPage() {
  const usuario = await getUsuarioSesion();
  const res = await getMinisteriosCompleto();
  
  const datos = (res.data || []).filter(
    (m: any) => m.organizacion_id === usuario.organizacion_id
  );

  return <MinisteriosClientView datos={datos} organizacionId={usuario.organizacion_id} />;
}
