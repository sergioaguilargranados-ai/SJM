import { getUsuarioSesionOpcional } from "@/lib/sesion";
import { TopbarClient } from "./TopbarClient";

export async function AppTopbar() {
  const usuario = await getUsuarioSesionOpcional();
  
  return (
    <TopbarClient
      nombre={usuario?.nombre_completo || "Invitado"}
      correo={usuario?.correo || ""}
      foto={usuario?.foto || ""}
      rol={usuario?.rol_nombre || ""}
    />
  );
}
