# Resumen de Sesión — v1.218 (22 de Agosto de 2026)

**Versión alcanzada:** v1.218  
**Compilación:** 22-08-22 13:19 (CDMX)  
**Asistente:** AntiGravity AI Assistant  

---

## 🎯 Trabajo Realizado

### 🚀 Corrección de Inclusión y Visualización del Campo `expectativas`
- **Diagnóstico:** En la Server Action `getInscripcionesCompleto()` (`src/app/actions/catalogos.ts`), la consulta SQL seleccionaba columnas explícitas pero **omitía `expectativas`** (así como `enfermedades_alergias`, `comparte_cuarto_con`, `parroquia_procedencia`, etc.). Por este motivo, la vista `/inscripciones` recibía un valor `undefined` para `expectativas` a pesar de estar correctamente capturado en la base de datos.
- **Solución Implementada:**
  1. **Actualización de Server Action**: Se actualizó `getInscripcionesCompleto()` en `src/app/actions/catalogos.ts` para extraer explícitamente el campo `expectativas` y todos los campos de perfil del participante de `solicitudes_inscripcion`.
  2. **Inclusión de Columnas y Filtro**: Se agregaron las columnas `Expectativas`, `Alergias / Anotaciones Médicas`, `Compartir Habitación Con`, `Parroquia` y `Contactos de Emergencia` en `src/app/(dashboard)/inscripciones/InscripcionesClientView.tsx`, además de incluirlos en el buscador general y en la exportación de reportes PDF y Excel.

---

## 🔢 Archivos Actualizados (Protocolo v1.218)
1. `src/app/actions/catalogos.ts` — Inclusión de `expectativas` y campos completos en `getInscripcionesCompleto()`.
2. `src/app/(dashboard)/inscripciones/InscripcionesClientView.tsx` — Inclusión de columnas y camposFiltro en la vista de inscripciones.
3. `docs/AG-Historico-Cambios.md` — Entrada v1.218 en el historial.
4. `src/components/layout/AppFooter.tsx` — Actualización de `appVersion` y `buildTime`.
5. `src/app/page.tsx` — Actualización de `appVersion`.
6. `src/app/login/page.tsx` — Actualización de leyenda de versión.

---

## 🚀 Despliegue Git
- Commit y push a `origin/main` para auto-despliegue en Vercel.
