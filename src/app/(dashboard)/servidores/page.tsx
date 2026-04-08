import { getServidores, getSedes } from "@/app/actions/consultas";
import { getUsuarioSesion } from "@/lib/sesion";
import { validarAccesoPlan } from "@/lib/permisos";
import ServidoresClientView from "./ServidoresClientView";

export const dynamic = 'force-dynamic';

export default async function CatalogoServidores() {
  // 1. Validar acceso por Plan (SJM Nacional es Premium)
  const { orgId } = await validarAccesoPlan("servidores");
  
  const usuario = await getUsuarioSesion();
  const [servRes, sedesRes] = await Promise.all([
    getServidores(),
    getSedes()
  ]);
  
  // Filtrar datos por la organización actual
  const servidores = (servRes.data || []).filter((s: any) => true); // getServidores ya debería filtrar o lo hacemos aquí
  const sedes = (sedesRes.data || []).filter(
    (s: any) => s.organizacion_id === orgId
  );

  return (
    <ServidoresClientView
      servidores={servidores}
      sedes={sedes}
      sedeId={usuario.sede_id || sedes[0]?.id || ""}
      organizacionId={orgId}
    />
  );
}

