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
      {/* 
        Layout Renovado:
        1. Cenefa Superior (AppTopbar) que abarca el 100% del ancho.
        2. AppSidebar debajo de la cenefa (pt-16 o top-20).
      */}
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f1015] transition-colors">
        <AppTopbar />
        
        <div className="flex flex-1 pt-20">
          <AppSidebar permisos={permisos} />
          
          <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
            <main className="flex-1 p-4 lg:p-8 w-full mx-auto">
              {children}
            </main>
            <AppFooter />
          </div>
        </div>
      </div>
    </TenantProvider>
  );
}


