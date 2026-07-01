import { getOrganizaciones } from "@/app/actions/configuracion";
import OrganizacionesClient from "./OrganizacionesClient";
import { getPermisosUsuario } from "@/lib/permisos";
import { redirect } from "next/navigation";

export default async function OrganizacionesPage() {
  const permisos = await getPermisosUsuario();
  
  if (permisos.rol !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const { data = [] } = await getOrganizaciones();

  return <OrganizacionesClient datos={data || []} />;
}
