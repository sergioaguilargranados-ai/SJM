import { getServidores, getSedes } from "@/app/actions/consultas";
import { getUsuarioSesion } from "@/lib/sesion";
import ServidoresClientView from "./ServidoresClientView";

export const dynamic = 'force-dynamic';

export default async function CatalogoServidores() {
  const usuario = await getUsuarioSesion();
  const [servRes, sedesRes] = await Promise.all([
    getServidores(),
    getSedes()
  ]);
  
  const servidores = servRes.data || [];
  const sedes = (sedesRes.data || []).filter(
    (s: any) => s.organizacion_id === usuario.organizacion_id
  );

  return (
    <ServidoresClientView
      servidores={servidores}
      sedes={sedes}
      sedeId={usuario.sede_id || sedes[0]?.id || ""}
      organizacionId={usuario.organizacion_id}
    />
  );
}
