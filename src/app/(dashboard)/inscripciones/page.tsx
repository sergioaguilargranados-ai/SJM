import { getInscripcionesCompleto } from "@/app/actions/catalogos";
import { getSedes, getMinisterios } from "@/app/actions/consultas";
import InscripcionesClientView from "./InscripcionesClientView";

export const dynamic = "force-dynamic";

export default async function InscripcionesPage() {
  const [resInscripciones, resSedes, resMinisterios] = await Promise.all([
    getInscripcionesCompleto(),
    getSedes(),
    getMinisterios()
  ]);
  
  return <InscripcionesClientView 
    datos={resInscripciones.data || []} 
    catalogoSedes={resSedes.data || []}
    catalogoMinisterios={resMinisterios.data || []}
  />;
}
