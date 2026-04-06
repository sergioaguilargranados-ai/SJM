import { getSedesCompleto } from "@/app/actions/catalogos";
import { getUsuarioSesion } from "@/lib/sesion";
import { SedesClientView } from "./SedesClientView";

export const dynamic = "force-dynamic";

export default async function SedesPage() {
  const usuario = await getUsuarioSesion();
  const sedesRes = await getSedesCompleto();
  
  // Filtrar sedes por organización del usuario logueado
  const sedes = (sedesRes.data || []).filter(
    (s: any) => s.organizacion_id === usuario.organizacion_id
  );

  return <SedesClientView datos={sedes} organizacionId={usuario.organizacion_id} />;
}
