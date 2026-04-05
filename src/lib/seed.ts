import { db } from "./db";
import { sedes, organizaciones, tipos_eventos, casas_retiro, clasificaciones_gasto, estados_republica } from "./schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";

// Datos de apoyo (Sedes y Org) si no existen
async function seedBasics() {
  console.log("🌱 Seeding Basics...");
  
  // 1. Organizacion Principal
  const orgId = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd";
  const [org] = await db.insert(organizaciones).values({
    id: orgId,
    nombre: "Servidores de Jesús por María Nacional",
    lema: "Sirviendo con amor a la comunidad",
  }).onConflictDoNothing().returning();

  // 2. Sedes principales
  const sedesNames = ["Nacional", "CDMX", "Monterrey", "Toluca", "Guadalajara", "Tuxtla", "Querétaro", "Chiapas", "Yucatán"];
  for (const s of sedesNames) {
    await db.insert(sedes).values({
      organizacion_id: orgId,
      nombre: s
    }).onConflictDoNothing();
  }

  // 3. Clasificaciones de Gasto
  const gastos = ["Estipendios", "Comida", "Casa de Retiro", "Papelería", "Cafetería", "Otros"];
  for (const g of gastos) {
    await db.insert(clasificaciones_gasto).values({
      nombre: g
    }).onConflictDoNothing();
  }
}

async function seedCasas() {
  console.log("🏠 Seeding Casas de Retiro...");
  // Basados en el dump del Excel que vimos
  const casas = [
    { nombre: "Texcoco - Monasterio de nuestra Sra. de los Ángeles", domicilio: "Purificación Tepetitla. Texcoco Estado Méx", cp: "0" },
    { nombre: "SALON DE EVENTOS RANCHO LINDAVISTA", domicilio: "AV. JUAREZ, RUMBO A LA GASERA", cp: "" },
    { nombre: "Casa Seglar San Marcos", domicilio: "Carretera Club Campestre # 984, Tuxtla Gutiérrez, Chiapas", cp: "0" },
    { nombre: "ON-LINE", domicilio: "VIA ZOOM", cp: "" },
    { nombre: "Casa de retiros San José del Carmen CDMX", domicilio: "Lago de Texcoco núm.9, Col. Anáhuac", cp: "11320" },
    { nombre: "Casa de Retiros Misioneros Pasionistas, Qro.", domicilio: "Fray Nicolás de Zamora No. 18, El pueblito", cp: "76900" },
    { nombre: "Casa de retiros OASIS DE LA CRUZ, TUXTLA", domicilio: "Carretera a Chicoasén Km. 13.5 San Fernando, Chiapas", cp: "" },
  ];

  for (const c of casas) {
    await db.insert(casas_retiro).values({
      nombre: c.nombre,
      domicilio: c.domicilio,
      codigo_postal: c.cp,
      estatus: true
    }).onConflictDoNothing();
  }
}

async function seedTiposRetiros() {
  console.log("🎭 Seeding Tipos de Retiro...");
  const orgId = "6fb191cc-a477-4632-9cb1-c30c33a9f9bd";
  const tipos = [
    { nombre: "RENACER * ADOLESCENTE", mat: false },
    { nombre: "HOMBRE Y MUJER EN PLENITUD", mat: true },
    { nombre: "RETO JOVEN", mat: false },
    { nombre: "RENACER ESPIRITUAL - Evangelizarte para Salvarte", mat: false },
  ];

  for (const t of tipos) {
    await db.insert(tipos_eventos).values({
      organizacion_id: orgId,
      nombre: t.nombre,
      es_matrimonial: t.mat
    }).onConflictDoNothing();
  }
}

async function main() {
  try {
    await seedBasics();
    await seedCasas();
    await seedTiposRetiros();
    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

main();
