import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { TenantProvider } from "@/components/TenantProvider";
import { getUsuarioSesionOpcional } from "@/lib/sesion";
import { obtenerOrganizacionPorId } from "@/lib/tenant";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener la organización del usuario autenticado
  const usuario = await getUsuarioSesionOpcional();
  const tenant = usuario?.organizacion_id
    ? await obtenerOrganizacionPorId(usuario.organizacion_id)
    : null;

  return (
    <TenantProvider tenant={tenant}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] transition-colors">
        <AppSidebar />
        <AppTopbar />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <main className="flex-1 p-6 lg:p-8 pt-24 lg:pt-24 w-full mx-auto">
            {children}
          </main>
          <AppFooter />
        </div>
      </div>
    </TenantProvider>
  );
}

