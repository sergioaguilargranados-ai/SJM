# AG-sesion-260817-estatus-solicitud

## Resumen de Sesión - 17 de Agosto de 2026

**Objetivo Principal:**
Agregar el campo de `estatus_solicitud` en la pantalla principal (primer página o paso 1) durante la edición de la inscripción de un participante/servidor al evento, para que se puedan cancelar las solicitudes directamente.

**Tareas Realizadas:**
- **src/app/actions/inscripciones.ts:** 
  - Se modificaron las consultas en `buscarServidorPorInscripcionIdAction` y `buscarServidorPorNombreAction` para traer el campo `si.estatus_solicitud`.
  - Se actualizó `registrarSolicitudAction` y `registrarRenaseAction` para mapear el campo `estatus_solicitud` al realizar la creación (`insert`) y la actualización (`update`).
  - Se corrigió el bug de `registrarSolicitudAction` que sobreescribía siempre el estatus con "PENDIENTE_PAGO" ignorando el estatus actual de la solicitud en base de datos.
- **src/components/forms/RegistroRenaseClient.tsx:** 
  - Se añadió `estatus_solicitud` al schema y `defaultValues`.
  - Se integró el UI Select al inicio del formulario para los editores, mapeado al campo de Zod.
- **src/components/forms/RegistroForm.tsx:** 
  - Se añadió también a la forma general (para personas no-servidoras) el UI del Estatus en el paso 1 si se encuentra el formulario en modo de edición (`initialData`).
- **Pruebas de compilación**: Completadas exitosamente usando `npx tsc --noEmit`.
