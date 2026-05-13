import { auth } from "@/lib/auth";
import { TopbarClient } from "./TopbarClient";

export async function AppTopbar() {
  const session = await auth();
  const usuario = session?.user;
  
  return (
    <TopbarClient
      nombre={usuario?.nombre_completo || usuario?.name || "Invitado"}
      correo={usuario?.email || ""}
      foto={usuario?.image || ""}
      rol={(usuario as any)?.rol_nombre || ""}
    />
  );
}

