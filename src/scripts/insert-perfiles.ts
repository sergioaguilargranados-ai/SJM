import { db } from "../lib/db";
import { modulos_sistema, funciones_sistema, acciones_sistema, roles_sistema, rol_permisos } from "../lib/schema";
import { eq, and } from "drizzle-orm";

const ORG_NACIONAL_ID = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd";

async function main() {
  console.log("Creando módulos mi_perfil y mis_compras...");

  // 1. Modulo Mi Perfil
  let [moduloPerfil] = await db.insert(modulos_sistema).values({
    nombre: "Mi Perfil",
    clave: "mi_perfil",
    icono: "User",
  }).onConflictDoNothing().returning({ id: modulos_sistema.id });

  if (!moduloPerfil) {
    const res = await db.query.modulos_sistema.findFirst({ where: eq(modulos_sistema.clave, "mi_perfil") });
    if (res) moduloPerfil = { id: res.id };
  }

  // Funcion y accion mi_perfil
  let [funcionPerfil] = await db.insert(funciones_sistema).values({
    modulo_id: moduloPerfil.id,
    nombre: "Ver Mi Perfil",
    clave: "mi_perfil",
  }).onConflictDoNothing().returning({ id: funciones_sistema.id });
  
  if (!funcionPerfil) {
    const res = await db.query.funciones_sistema.findFirst({ where: eq(funciones_sistema.clave, "mi_perfil") });
    if (res) funcionPerfil = { id: res.id };
  }

  let [accionPerfilView] = await db.insert(acciones_sistema).values({
    funcion_id: funcionPerfil.id,
    nombre: "Ver",
    clave: "view",
  }).returning({ id: acciones_sistema.id });

  // 2. Modulo Mis Compras
  let [moduloCompras] = await db.insert(modulos_sistema).values({
    nombre: "Mis Compras",
    clave: "mis_compras",
    icono: "ShoppingBag",
  }).onConflictDoNothing().returning({ id: modulos_sistema.id });

  if (!moduloCompras) {
    const res = await db.query.modulos_sistema.findFirst({ where: eq(modulos_sistema.clave, "mis_compras") });
    if (res) moduloCompras = { id: res.id };
  }

  let [funcionCompras] = await db.insert(funciones_sistema).values({
    modulo_id: moduloCompras.id,
    nombre: "Ver Mis Compras",
    clave: "mis_compras",
  }).onConflictDoNothing().returning({ id: funciones_sistema.id });
  
  if (!funcionCompras) {
    const res = await db.query.funciones_sistema.findFirst({ where: eq(funciones_sistema.clave, "mis_compras") });
    if (res) funcionCompras = { id: res.id };
  }

  let [accionComprasView] = await db.insert(acciones_sistema).values({
    funcion_id: funcionCompras.id,
    nombre: "Ver",
    clave: "view",
  }).returning({ id: acciones_sistema.id });

  // 3. Crear roles "Servidor" y "Usuario Tienda"
  let [rolServidor] = await db.insert(roles_sistema).values({
    organizacion_id: ORG_NACIONAL_ID,
    nombre: "Servidor",
    es_admin_sistema: false,
  }).onConflictDoNothing().returning({ id: roles_sistema.id });

  if (!rolServidor) {
    const res = await db.query.roles_sistema.findFirst({ where: and(eq(roles_sistema.nombre, "Servidor"), eq(roles_sistema.organizacion_id, ORG_NACIONAL_ID)) });
    if (res) rolServidor = { id: res.id };
  }

  let [rolUsuarioTienda] = await db.insert(roles_sistema).values({
    organizacion_id: ORG_NACIONAL_ID,
    nombre: "Usuario Tienda",
    es_admin_sistema: false,
  }).onConflictDoNothing().returning({ id: roles_sistema.id });

  if (!rolUsuarioTienda) {
    const res = await db.query.roles_sistema.findFirst({ where: and(eq(roles_sistema.nombre, "Usuario Tienda"), eq(roles_sistema.organizacion_id, ORG_NACIONAL_ID)) });
    if (res) rolUsuarioTienda = { id: res.id };
  }

  // 4. Asignar permisos a roles
  await db.insert(rol_permisos).values({
    rol_id: rolServidor.id,
    accion_id: accionPerfilView.id
  }).onConflictDoNothing();

  await db.insert(rol_permisos).values({
    rol_id: rolUsuarioTienda.id,
    accion_id: accionComprasView.id
  }).onConflictDoNothing();

  console.log("✅ Perfiles de Servidor y Usuario Tienda creados exitosamente!");
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
