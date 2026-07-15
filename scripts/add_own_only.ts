import { db } from "../src/lib/db";
import { funciones_sistema, acciones_sistema, roles_sistema, rol_permisos } from "../src/lib/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

async function main() {
  console.log("Iniciando migración de permisos: Solo Propio...");

  try {
    // 1. Obtener función servidores.padron
    const funcRes = await db.select().from(funciones_sistema).where(eq(funciones_sistema.clave, "servidores.padron"));
    
    if (funcRes.length === 0) {
      console.log("No se encontró la función servidores.padron");
      process.exit(1);
    }
    const funcionPadron = funcRes[0];
    console.log("Función encontrada:", funcionPadron.nombre);

    // 2. Verificar si la acción own_only ya existe
    const accionRes = await db.select().from(acciones_sistema).where(
      and(
        eq(acciones_sistema.clave, "own_only"),
        eq(acciones_sistema.funcion_id, funcionPadron.id)
      )
    );
    
    let accionId = "";
    if (accionRes.length > 0) {
      console.log("La acción own_only ya existe. ID:", accionRes[0].id);
      accionId = accionRes[0].id;
    } else {
      console.log("Creando acción own_only...");
      const nuevaAccion = await db.insert(acciones_sistema).values({
        id: uuidv4(),
        funcion_id: funcionPadron.id,
        nombre: "Solo propio",
        clave: "own_only"
      }).returning();
      accionId = nuevaAccion[0].id;
      console.log("Acción own_only creada con ID:", accionId);
    }

    // 3. Buscar rol "Servidor"
    const rolRes = await db.select().from(roles_sistema).where(eq(roles_sistema.nombre, "Servidor"));
    if (rolRes.length === 0) {
      console.log("No se encontró el rol Servidor");
      process.exit(1);
    }

    for (const rol of rolRes) {
      console.log(`\nProcesando Rol: ${rol.nombre} (ID: ${rol.id})`);
      
      // Buscar el permiso 'view' para servidores.padron
      const viewAccion = await db.select().from(acciones_sistema)
        .where(
          and(
            eq(acciones_sistema.clave, "view"),
            eq(acciones_sistema.funcion_id, funcionPadron.id)
          )
        );
        
      if (viewAccion.length > 0) {
        // Eliminar permiso 'view'
        console.log(`Eliminando permiso 'view' (ID: ${viewAccion[0].id}) del rol...`);
        await db.delete(rol_permisos)
          .where(
            and(
              eq(rol_permisos.rol_id, rol.id),
              eq(rol_permisos.accion_id, viewAccion[0].id)
            )
          );
      }

      // Asignar permiso 'own_only'
      const tieneOwn = await db.select().from(rol_permisos)
        .where(
          and(
            eq(rol_permisos.rol_id, rol.id),
            eq(rol_permisos.accion_id, accionId)
          )
        );
        
      if (tieneOwn.length === 0) {
        console.log("Asignando permiso 'own_only' al rol...");
        await db.insert(rol_permisos).values({
          id: uuidv4(),
          rol_id: rol.id,
          accion_id: accionId
        });
      } else {
        console.log("El rol ya tiene asignado el permiso 'own_only'.");
      }
    }

    console.log("\n¡Migración completada exitosamente!");
    process.exit(0);
  } catch (err) {
    console.error("Error en migración:", err);
    process.exit(1);
  }
}

main();
