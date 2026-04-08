import { getDocumentosInstitucionales } from "@/app/actions/catalogos";
import { validarAccesoPlan } from "@/lib/permisos";
import DocumentosClientView from "./DocumentosClientView";

export const dynamic = "force-dynamic";

export default async function DocumentosPage() {
  // 1. Validar acceso (Solo Premium)
  const { orgId } = await validarAccesoPlan("documentos");

  const docsRes = await getDocumentosInstitucionales();
  
  // Filtrar documentos por organización
  const docs = (docsRes.data || []).filter((d: any) => d.organizacion_id === orgId);

  return <DocumentosClientView datos={docs} organizacionId={orgId} />;
}

