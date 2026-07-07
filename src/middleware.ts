import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Rutas protegidas del intranet — requieren sesión activa
const RUTAS_PROTEGIDAS = [
  "/dashboard",
  "/servidores",
  "/eventos",
  "/inscripciones",
  "/finanzas",
  "/documentos",
  "/equipo",
  "/evaluaciones",
  "/catalogos",
  "/configuracion",
  "/perfil",
];

// Rutas públicas que NO requieren sesión
const RUTAS_PUBLICAS = [
  "/",
  "/login",
  "/registro",
  "/recuperar",
  "/diplomado",
  "/api",
  "/nosotros",
  "/retiros-eventos",
  "/jovenes",
  "/matrimonios",
  "/sanacion-interior",
  "/mundo-infantil",
  "/llama-de-amor",
  "/contactanos",
  "/donativos",
  "/testimonios",
  "/centros",
  "/ayuda",
  "/crecimientos",
  "/formacion",
  "/media",
  "/tienda",
  "/blog",
];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  // Verificar si la ruta actual es protegida
  const esRutaProtegida = RUTAS_PROTEGIDAS.some((ruta) => path.startsWith(ruta));

  // Obtener permisos
  const permisos = (req.auth?.user as any)?.permisos || [];
  const tieneAccesoDashboard = permisos.includes("*") || permisos.includes("dashboard.view") || permisos.some((p: string) => p.startsWith("dashboard."));

  // Si es ruta protegida y no hay sesión, redirigir a login
  if (esRutaProtegida && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Si trata de entrar a /dashboard o rutas administrativas y no tiene permisos de dashboard
  if (esRutaProtegida && isLoggedIn && path.startsWith("/dashboard") && !tieneAccesoDashboard) {
    return NextResponse.redirect(new URL("/perfil", req.url));
  }

  // Si ya está logueado y visita /login, redirigir según permisos
  if (path === "/login" && isLoggedIn) {
    if (tieneAccesoDashboard) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/perfil", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)" ],
};
