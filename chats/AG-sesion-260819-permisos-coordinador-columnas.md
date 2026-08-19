# AG-sesion-260819-permisos-coordinador-columnas

## Resumen de Sesión - 19 de Agosto de 2026

**Objetivos Solicitados:**
1. Validar y corregir por qué a los usuarios con rol de Coordinador no les aparecían las acciones de edición/eliminación de participantes en el detalle del evento.
2. Agregar la **Edad** (calculada dinámicamente si falta) y el **Estado Civil** a las columnas seleccionables en las consultas de asistentes e inscripciones.
3. Permitir la selección múltiple de columnas en el selector de columnas (sin que se cierre el menú en cada clic).

**Tareas Realizadas:**
- **src/app/(dashboard)/eventos/[eventoId]/page.tsx:**
  - Se corrigió la condición de `isAdmin` para verificar si el rol del usuario incluye `"coordinador"`, `"admin"`, `es_admin_sistema` o si cuenta con permisos de `"inscripciones.*"` / `"eventos.*"`.
- **src/app/actions/inscripciones.ts:**
  - Se actualizó `eliminarInscripcionAction` para permitir a coordinadores y roles autorizados eliminar inscripciones.
- **src/app/(dashboard)/eventos/[eventoId]/AsistentesEventoClientView.tsx & InscripcionesClientView.tsx:**
  - Se añadió cálculo dinámico de `edad` a partir de `fecha_nacimiento` si `edad` viene vacío.
  - Se añadieron las columnas opcionales **"Estado Civil"** y **"Fecha Nacimiento"** a las tablas de consulta.
- **src/components/TablaConsulta.tsx:**
  - Se previno el cierre automático del menú al hacer clic en las opciones (`onSelect={(e) => e.preventDefault()}`).
  - Se agregaron botones de acción rápida **"Mostrar todas"** y **"Restablecer"** en la cabecera del menú.
  - Se añadió scroll automático (`max-h-80 overflow-y-auto`) para listas largas de columnas.
- **Versionamiento:** v1.216 compilado, documentado y probado con `npx tsc --noEmit`.
