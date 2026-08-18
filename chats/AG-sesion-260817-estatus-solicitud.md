# AG-sesion-260817-estatus-solicitud

## Resumen de Sesión - 17 de Agosto de 2026

**Objetivo Principal:**
1. Agregar el campo de `estatus_solicitud` en la pantalla principal (primer página o paso 1) durante la edición de la inscripción de un participante/servidor al evento, para que se puedan cancelar las solicitudes directamente.
2. Añadir botón de "Regresar al listado" en la cabecera cuando se está en modo de edición.
3. Añadir botones de guardado directo ("Guardar Cambios" / "Guardar Estatus") para no tener que avanzar todos los pasos del wizard para persistir cambios de estatus.
4. En las consultas de asistentes y de inscripciones, ocultar por defecto las solicitudes canceladas ("Solo Activos") y permitir mediante el filtro seleccionar "Ver Todos" o "Solo Cancelados".

**Tareas Realizadas:**
- **src/app/actions/inscripciones.ts:** 
  - Se modificaron las consultas en `buscarServidorPorInscripcionIdAction` y `buscarServidorPorNombreAction` para traer el campo `si.estatus_solicitud`.
  - Se actualizó `registrarSolicitudAction` y `registrarRenaseAction` para mapear el campo `estatus_solicitud` al realizar la creación (`insert`) y la actualización (`update`).
  - Se corrigió el bug de `registrarSolicitudAction` que sobreescribía siempre el estatus con "PENDIENTE_PAGO" ignorando el estatus actual de la solicitud en base de datos.
- **src/components/forms/RegistroRenaseClient.tsx:** 
  - Se añadió `estatus_solicitud` al schema y `defaultValues`.
  - Se integró el UI Select al inicio del formulario para los editores con botón directo "Guardar Estatus / Cambios".
  - Se añadió botón "Regresar al listado" y "Guardar Cambios" en la cabecera superior cuando existe `initialData` o `returnTo`.
- **src/components/forms/RegistroForm.tsx:** 
  - Se añadió el UI del Estatus en el paso 1 con botón directo "Guardar Estatus" si el formulario está en modo de edición (`initialData`).
  - Se añadió botón "Regresar al listado" y botón "Guardar Cambios" en la cabecera superior y en la barra de navegación de cada paso.
- **src/app/(dashboard)/eventos/[eventoId]/AsistentesEventoClientView.tsx:**
  - Se añadió el filtro `filtroEstatus` con valor predeterminado `"ACTIVOS"` (excluye registros cancelados por defecto).
  - Se añadieron opciones "Ver Todos (Incluir Cancelados)" y "Solo Cancelados".
  - Se agregó la columna "Estatus" con badges visuales para identificar el estado de cada solicitud.
- **src/app/(dashboard)/inscripciones/InscripcionesClientView.tsx:**
  - Se añadió el filtro `filtroEstatusSolicitud` para controlar la visualización de activos / cancelados / todos.
- **Versionamiento:** v1.215 compilado y documentado.
- **Pruebas de compilación**: Completadas exitosamente con `npx tsc --noEmit`.
