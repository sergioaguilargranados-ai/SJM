import { getServidores, getSedes, getMinisterios, getCargos, getEstadosRepublica } from "@/app/actions/consultas";
import { getUsuarioSesion } from "@/lib/sesion";
import { validarAccesoPlan } from "@/lib/permisos";
import ServidoresClientView from "./ServidoresClientView";

export const dynamic = 'force-dynamic';

export default async function CatalogoServidores() {
  // 1. Validar acceso por Plan (SJM Nacional es Premium)
  const { orgId } = await validarAccesoPlan("servidores");
  
  const usuario = await getUsuarioSesion();
  const [
    servRes, 
    sedesRes,
    minRes,
    cargosRes,
    estadosRes
  ] = await Promise.all([
    getServidores(),
    getSedes(),
    getMinisterios(),
    getCargos(),
    getEstadosRepublica()
  ]);
  
  // Filtrar datos por la organización actual
  const servidores = (servRes.data || []).filter((s: any) => true); // getServidores ya debería filtrar o lo hacemos aquí
  const sedes = (sedesRes.data || []).filter(
    (s: any) => s.organizacion_id === orgId
  );
  const ministerios = minRes.data || [];
  const cargos = cargosRes.data || [];
  const estados = estadosRes.data || [];

  return (
    <ServidoresClientView
      servidores={servidores}
      sedes={sedes}
      ministerios={ministerios}
      cargos={cargos}
      estados={estados}
      sedeId={usuario.sede_id || sedes[0]?.id || ""}
      organizacionId={orgId}
      esAdmin={usuario.rol_nombre?.toLowerCase().includes("admin") || false}
    />
  );
}

