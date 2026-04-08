import { db } from "./db";
import { 
  sedes, organizaciones, tipos_eventos, casas_retiro, 
  clasificaciones_gasto, planes, modulos_sistema, funciones_sistema,
  plan_permisos, roles_sistema
} from "./schema";
import { eq } from "drizzle-orm";

async function seedPlanesYPermisos() {
  console.log("🛡️ Seeding Planes y Permisos...");

  // 1. Crear Planes
  const planesData = [
    { clave: "landing", nombre: "Modo Landing", descripcion: "Solo portal público y contacto" },
    { clave: "admin", nombre: "Modo Admin", descripcion: "Gestión completa de servidores y eventos" },
    { clave: "premium", nombre: "Modo Premium", descripcion: "Todo lo anterior más Finanzas y Documentos" },
  ];

  for (const p of planesData) {
    await db.insert(planes).values(p).onConflictDoNothing();
  }

  // 2. Crear Módulos Base
  const modulos = [
    { clave: "servidores", nombre: "Gestión de Servidores", icono: "Users" },
    { clave: "eventos", nombre: "Eventos y Retiros", icono: "CalendarDays" },
    { clave: "finanzas", nombre: "Control Financiero", icono: "Receipt" },
  ];

  for (const m of modulos) {
    await db.insert(modulos_sistema).values(m).onConflictDoNothing();
  }

  // 3. Crear Funciones (Ejemplos)
  const servidoresMod = await db.query.modulos_sistema.findFirst({ where: eq(modulos_sistema.clave, "servidores") });
  if (servidoresMod) {
    await db.insert(funciones_sistema).values([
      { modulo_id: servidoresMod.id, clave: "servidores.ver", nombre: "Ver Padrón" },
      { modulo_id: servidoresMod.id, clave: "servidores.editar", nombre: "Editar Servidores" },
    ]).onConflictDoNothing();
  }
}

async function seedBasics() {
  console.log("🌱 Seeding Basics...");
  
  const planAdmin = await db.query.planes.findFirst({ where: eq(planes.clave, "admin") });

  // 1. Organizacion Principal
  const orgId = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd";
  await db.insert(organizaciones).values({
    id: orgId,
    plan_id: planAdmin?.id,
    nombre: "Servidores de Jesús por María Nacional",
    lema: "Sirviendo con amor a la comunidad",
  }).onConflictDoUpdate({
    target: [organizaciones.id],
    set: { plan_id: planAdmin?.id }
  });

  // 2. Roles Base para la Org
  await db.insert(roles_sistema).values([
    { organizacion_id: orgId, nombre: "Super Administrador", es_admin_sistema: true },
    { organizacion_id: orgId, nombre: "Coordinador de Sede", es_admin_sistema: false },
  ]).onConflictDoNothing();

  // 3. Sedes principales
  const sedesNames = ["Nacional", "CDMX", "Monterrey", "Toluca", "Guadalajara", "Tuxtla", "Querétaro", "Chiapas", "Yucatán"];
  for (const s of sedesNames) {
    await db.insert(sedes).values({
      organizacion_id: orgId,
      nombre: s
    }).onConflictDoNothing();
  }
}

async function main() {
  try {
    await seedPlanesYPermisos();
    await seedBasics();
    console.log("✅ Seed v1.070 completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();

