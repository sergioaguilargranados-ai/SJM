# AG-sesion-260722-estudios

## Resumen de Sesión - 22 de Julio de 2026

**Objetivo Principal:**
Agregar un nuevo campo al formulario de captura de solicitudes de retiro (RENASE) en la sección "Quiero consulta médica", que permita a los servidores marcar la opción "Ya tengo los estudios" mediante un checkbox.

**Tareas Realizadas:**
- **Base de Datos (Schema):** Se agregó la columna `ya_tengo_estudios_medicos` (booleano, por defecto `false`) en la tabla `solicitudes_inscripcion` (`src/lib/schema.ts`).
- **Migración de Base de Datos:** Se ejecutó `drizzle-kit push` para actualizar el esquema en la base de datos de producción/desarrollo de manera inmediata.
- **Frontend (UI & Zod):** Se actualizó el esquema de validación (`RegistroRenaseClient.tsx`) y se agregó el componente Checkbox debajo de la sección de "Quiero consulta médica".
- **Backend (Server Action):** Se modificó el archivo `src/app/actions/inscripciones.ts` para leer y guardar el valor `ya_tengo_estudios_medicos` cuando se inserta o actualiza una solicitud.
- **Panel Intranet (Tabla):** Se añadió la columna "Ya Tiene Estudios" oculta por defecto en el panel de `AsistentesEventoClientView.tsx` para que pueda ser visualizada y exportada a Excel junto con "Consulta Médica".
- **Versionado:** Subida la versión del sistema de SJM Core Engine a **v1.201**.

**Próximos Pasos (si aplica):**
- Validar visualmente en el formulario de inscripción que el nuevo campo se muestre correctamente.
