"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wrapper de SessionProvider para proveer el estado de sesión
 * a todos los componentes cliente de la aplicación.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
