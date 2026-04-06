import { getInscripcionesCompleto } from "@/app/actions/catalogos";
import InscripcionesClientView from "./InscripcionesClientView";

export const dynamic = "force-dynamic";

export default async function InscripcionesPage() {
  const res = await getInscripcionesCompleto();
  return <InscripcionesClientView datos={res.data || []} />;
}
