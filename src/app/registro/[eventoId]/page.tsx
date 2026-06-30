import { RegistroForm } from "@/components/forms/RegistroForm";
import { getEventoById, getSedes } from "@/app/actions/consultas";
import { RegistroPublicoClient } from "@/components/forms/RegistroPublicoClient";
import { RegistroRenaseClient } from "@/components/forms/RegistroRenaseClient";
import { notFound } from "next/navigation";

export default async function RegistroPage({ params }: { params: Promise<{ eventoId: string }> }) {
  const { eventoId } = await params;
  const { data: evento } = await getEventoById(eventoId);
  
  // Obtener sedes para el flujo RENASE
  const { data: sedesRes } = await getSedes();
  const sedes = sedesRes || [];

  if (!evento) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <RegistroPublicoClient evento={evento}>
        {evento.es_evento_servidores ? (
          <RegistroRenaseClient evento={evento} sedes={sedes} />
        ) : (
          <RegistroForm eventoId={eventoId} esMatrimonial={evento.es_matrimonial ?? false} />
        )}
      </RegistroPublicoClient>
    </div>
  );
}

