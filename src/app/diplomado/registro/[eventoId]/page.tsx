import { RegistroDiplomadoForm } from "@/components/forms/RegistroDiplomadoForm";

export default async function DiplomadoRegistroPage({ params }: { params: Promise<{ eventoId: string }> }) {
  const { eventoId } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <RegistroDiplomadoForm eventoId={eventoId} />
    </div>
  );
}
