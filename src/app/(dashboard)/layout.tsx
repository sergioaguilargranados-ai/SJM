import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { TenantProvider } from "@/components/TenantProvider";
import { getUsuarioSesionOpcional } from "@/lib/sesion";
import { obtenerOrganizacionPorId } from "@/lib/tenant";
import { getPermisosUsuario } from "@/lib/permisos";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await getUsuarioSesionOpcional();
  const [tenant, permisos] = await Promise.all([
    usuario?.organizacion_id ? obtenerOrganizacionPorId(usuario.organizacion_id) : null,
    getPermisosUsuario()
  ]);

  return (
    <TenantProvider tenant={tenant}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1015] transition-colors">
        <AppSidebar permisos={permisos} />
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


