import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { funciones_sistema, acciones_sistema, roles_sistema, rol_permisos } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const logs = [];
    logs.push("Iniciando migración de permisos: Solo Propio...");

    const funcRes = await db.select().from(funciones_sistema).where(eq(funciones_sistema.clave, "servidores"));
    let funcionPadron = funcRes[0];
    if (!funcionPadron) {
       logs.push("Intentando buscar 'servidores' como clave...");
       // The clave in DB might be "servidores" or something else. Let's list all:
       const allFunc = await db.select().from(funciones_sistema);
       funcionPadron = allFunc.find(f => f.clave.includes("servidores"));
       if(!funcionPadron) {
          return NextResponse.json({ error: "No se encontró función de servidores", logs, allFunc });
       }
    }
    
    logs.push(`Función encontrada: ${funcionPadron.nombre} (ID: ${funcionPadron.id})`);

    const accionRes = await db.select().from(acciones_sistema).where(
      and(
        eq(acciones_sistema.clave, "own_only"),
        eq(acciones_sistema.funcion_id, funcionPadron.id)
      )
    );
    
    let accionId = "";
    if (accionRes.length > 0) {
      logs.push(`La acción own_only ya existe. ID: ${accionRes[0].id}`);
      accionId = accionRes[0].id;
    } else {
      logs.push("Creando acción own_only...");
      const nuevaAccion = await db.insert(acciones_sistema).values({
        id: uuidv4(),
        funcion_id: funcionPadron.id,
        nombre: "Solo propio",
        clave: "own_only"
      }).returning();
      accionId = nuevaAccion[0].id;
      logs.push(`Acción own_only creada con ID: ${accionId}`);
    }

    const rolRes = await db.select().from(roles_sistema).where(eq(roles_sistema.nombre, "Servidor"));
    if (rolRes.length === 0) {
      return NextResponse.json({ error: "No se encontró el rol Servidor", logs });
    }

    for (const rol of rolRes) {
      logs.push(`Procesando Rol: ${rol.nombre} (ID: ${rol.id})`);
      
      const viewAccion = await db.select().from(acciones_sistema).where(
        and(eq(acciones_sistema.clave, "view"), eq(acciones_sistema.funcion_id, funcionPadron.id))
      );
        
      if (viewAccion.length > 0) {
        logs.push(`Eliminando permiso 'view' (ID: ${viewAccion[0].id}) del rol...`);
        await db.delete(rol_permisos).where(
          and(eq(rol_permisos.rol_id, rol.id), eq(rol_permisos.accion_id, viewAccion[0].id))
        );
      }

      const tieneOwn = await db.select().from(rol_permisos).where(
        and(eq(rol_permisos.rol_id, rol.id), eq(rol_permisos.accion_id, accionId))
      );
        
      if (tieneOwn.length === 0) {
        logs.push("Asignando permiso 'own_only' al rol...");
        await db.insert(rol_permisos).values({
          id: uuidv4(),
          rol_id: rol.id,
          accion_id: accionId
        });
      } else {
        logs.push("El rol ya tiene asignado el permiso 'own_only'.");
      }
    }

    logs.push("Migración completada exitosamente");
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
