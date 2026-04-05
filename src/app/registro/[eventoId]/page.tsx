import { RegistroForm } from "@/components/forms/RegistroForm";

export default function RegistroPage({ params }: { params: { eventoId: string } }) {
  // En producción, aquí validaríamos que el eventoId existe en Neon
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegistroForm eventoId={params.eventoId} />
    </div>
  );
}
