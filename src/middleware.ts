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
];

// Rutas públicas que NO requieren sesión
const RUTAS_PUBLICAS = [
  "/",
  "/login",
  "/registro",
  "/diplomado",
  "/api",
];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  // Verificar si la ruta actual es protegida
  const esRutaProtegida = RUTAS_PROTEGIDAS.some((ruta) => path.startsWith(ruta));

  // Si es ruta protegida y no hay sesión, redirigir a login
  if (esRutaProtegida && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Si ya está logueado y visita /login, redirigir al dashboard
  if (path === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)" ],
};
