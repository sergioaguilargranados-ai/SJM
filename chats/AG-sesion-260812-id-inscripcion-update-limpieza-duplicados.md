# Resumen de Sesión — v1.212 (12 de Agosto de 2026)

**Versión alcanzada:** v1.212  
**Compilación:** 12-08-2026 21:56 (CDMX)  
**Asistente:** AntiGravity AI Assistant  

---

## 🎯 Trabajo Realizado

### 🚀 Diagnóstico y Solución de Duplicación al Editar
- **Diagnóstico del Problema:** Al enviar la edición de un participante desde `RegistroForm.tsx`, el formulario invocaba `registrarSolicitudAction({ ...values, eventoId, editId: initialData?.id })`. Sin embargo, en `buscarServidorPorInscripcionIdAction` (`inscripciones.ts`), la consulta SQL seleccionaba columnas pero **omitía explícitamente `si.id as id`**. Por tal motivo, `initialData?.id` retornaba `undefined` en tiempo de ejecución. Al recibir `editId: undefined`, `registrarSolicitudAction` evaluaba la condición como `false` y creaba una **nueva fila duplicada con `INSERT`** en lugar de actualizar el registro existente (`UPDATE`).
- **Soluciones Aplicadas:**
  1. **Retorno de Clave Primaria SQL**: Se actualizó `buscarServidorPorInscripcionIdAction` en `src/app/actions/inscripciones.ts` añadiendo `si.id as id` y `si.id as inscripcion_id` al `SELECT`.
  2. **Garantía de `editId` en Formulario**: Se actualizó `onSubmit` en `src/components/forms/RegistroForm.tsx` para usar `targetEditId = initialData?.id || initialData?.inscripcion_id`, garantizando que siempre se ejecute un `UPDATE`.
  3. **Depuración de Base de Datos**: Se ejecutó depuración directa en la base de datos Neon eliminando las 2 filas duplicadas históricas acumuladas durante las pruebas de edición previas.

---

## 🔢 Archivos Actualizados (Protocolo v1.212)
1. `src/app/actions/inscripciones.ts` — Inclusión de `si.id as id` en `SELECT` de `buscarServidorPorInscripcionIdAction`.
2. `src/components/forms/RegistroForm.tsx` — Paso garantizado de `targetEditId` en `onSubmit`.
3. `docs/AG-Historico-Cambios.md` — Entrada v1.212 en el historial.
4. `src/components/layout/AppFooter.tsx` — Actualización de `appVersion` y `buildTime`.
5. `src/app/page.tsx` — Actualización de `appVersion`.
6. `src/app/login/page.tsx` — Actualización de leyenda de versión.

---

## 🚀 Despliegue Git
- Commit y push a `origin/main` para auto-despliegue en Vercel.
