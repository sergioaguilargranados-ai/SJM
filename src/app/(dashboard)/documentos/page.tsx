import { getDocumentosInstitucionales } from "@/app/actions/catalogos";
import { getUsuarioSesion } from "@/lib/sesion";
import DocumentosClientView from "./DocumentosClientView";

export const dynamic = "force-dynamic";

export default async function DocumentosPage() {
  const usuario = await getUsuarioSesion();
  const docsRes = await getDocumentosInstitucionales();

  return <DocumentosClientView datos={docsRes.data || []} organizacionId={usuario.organizacion_id} />;
}
