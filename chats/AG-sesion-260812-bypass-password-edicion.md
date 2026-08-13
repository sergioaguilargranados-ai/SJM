# Resumen de Sesión — v1.207 (12 de Agosto de 2026)

**Versión alcanzada:** v1.207  
**Compilación:** 12-08-2026 20:56 (CDMX)  
**Asistente:** AntiGravity AI Assistant  

---

## 🎯 Trabajo Realizado

### 🚀 Acceso Directo a Edición de Asistentes para Administradores (Omisión de Contraseña)
- **Bypass de Contraseña en Edición**: Se actualizó `src/app/registro/[eventoId]/page.tsx` para que cuando se ingrese a editar desde la Intranet/Asistentes (mediante `?editId=...`), el parámetro `bypassPassword` se active automáticamente en `RegistroPublicoClient`, **omitiendo la pantalla de contraseña e ingresando directamente al formulario de edición**.
- **Soporte de Asistentes Directos (`solicitudes_inscripcion`)**: Se actualizó la Server Action `buscarServidorPorInscripcionIdAction` en `src/app/actions/inscripciones.ts` cambiando `INNER JOIN` por `LEFT JOIN` a la tabla `usuarios` y aplicando `COALESCE` para extraer `nombre_asistente`, `correo`, `telefono_celular`, `sexo`, `edad`, etc., de la tabla `solicitudes_inscripcion`. Esto garantiza precargar la información de cualquier asistente registrado sin requerir que tenga una cuenta de usuario vinculada previamente.

---

## 🔢 Archivos Actualizados (Protocolo v1.207)
1. `src/app/registro/[eventoId]/page.tsx` — Activar `bypassPassword` al editar desde la intranet (`editId`).
2. `src/app/actions/inscripciones.ts` — `LEFT JOIN` y `COALESCE` en `buscarServidorPorInscripcionIdAction`.
3. `docs/AG-Historico-Cambios.md` — Entrada v1.207 en el historial.
4. `src/components/layout/AppFooter.tsx` — Actualización de `appVersion` y `buildTime`.
5. `src/app/page.tsx` — Actualización de `appVersion`.
6. `src/app/login/page.tsx` — Actualización de leyenda de versión.

---

## 🚀 Despliegue Git
- Commit y push a `origin/main` para auto-despliegue en Vercel.
