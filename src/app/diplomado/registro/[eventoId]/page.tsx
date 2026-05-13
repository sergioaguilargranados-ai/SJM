import { RegistroDiplomadoForm } from "@/components/forms/RegistroDiplomadoForm";
import { getEventoById } from "@/app/actions/consultas";
import { RegistroPublicoClient } from "@/components/forms/RegistroPublicoClient";
import { notFound } from "next/navigation";

export default async function DiplomadoRegistroPage({ params }: { params: Promise<{ eventoId: string }> }) {
  const { eventoId } = await params;
  const { data: evento } = await getEventoById(eventoId);

  if (!evento) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <RegistroPublicoClient evento={evento}>
        <RegistroDiplomadoForm eventoId={eventoId} />
      </RegistroPublicoClient>
    </div>
  );
}

