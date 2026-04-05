import { RegistroDiplomadoForm } from "@/components/forms/RegistroDiplomadoForm";

export default function DiplomadoRegistroPage({ params }: { params: { eventoId: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <RegistroDiplomadoForm eventoId={params.eventoId} />
    </div>
  );
}
