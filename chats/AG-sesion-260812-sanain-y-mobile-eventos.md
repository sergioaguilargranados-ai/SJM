# Resumen de Sesión — v1.204 (12 de Agosto de 2026)

**Versión alcanzada:** v1.204  
**Compilación:** 12-08-2026 18:35 (CDMX)  
**Asistente:** AntiGravity AI Assistant  

---

## 🎯 Trabajo Realizado

### 1. Visibilidad y Edición Táctil en Móviles (Retiros/Eventos y Servidores)
- **Problema:** En dispositivos móviles táctiles (celulares y tablets), los botones de acción para "Editar" y "Eliminar" tarjetas no aparecían debido a que dependían de la pseudo-clase `:hover` (`opacity-0 group-hover:opacity-100`).
- **Solución Implementada:** 
  - Se actualizó el contenedor de botones de acción en `EventosClientView.tsx` y `ServidoresClientView.tsx` a `opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10`.
  - Se agregó `e.stopPropagation()` a los manejadores `onClick` para evitar que el clic táctil active de forma indeseada la redirección o modal de nivel superior.

### 2. Investigación de Registros Desaparecidos (Sanaín / Sanación Interior)
- **Investigación:** Se realizó una auditoría directa a la base de datos de producción Neon DB.
- **Hallazgos:**
  - **Ningún registro fue eliminado ni sufrió rollback**. Las 93 solicitudes registradas en el evento de Sanaín se encuentran 100% preservadas en Postgres.
  - **Causa Raíz:** `getInscripcionesCompleto` (`catalogos.ts`) y `getInscripcionesByEvento` (`consultas.ts`) aplicaban un filtro JavaScript destructivo que agrupaba solicitudes por correo/teléfono o `evento_nombre` creyendo deduplicar clics dobles.
  - Esto provocaba que si familiares o personas compartían el mismo correo o teléfono de contacto (ej. hermanas, matrimonios o padres e hijos), **el sistema descartaba a la 2ª persona y posteriores de las pantallas y reportes PDF/Excel**.
- **Solución Implementada:**
  - Se eliminaron los filtros deduplicadores destructivos en ambos Server Actions.
  - Ahora se retornan el 100% de los registros registrados por su `id` único (`solicitudes_inscripcion.id`).

---

## 🔢 Archivos Actualizados (Protocolo v1.204)
1. `docs/AG-Historico-Cambios.md` — Entrada v1.204 detallando mejoras táctiles y resolución en Sanaín.
2. `src/components/layout/AppFooter.tsx` — Actualización de `appVersion` y `buildTime`.
3. `src/app/page.tsx` — Actualización de `appVersion`.
4. `src/app/login/page.tsx` — Actualización de la leyenda de compilación en el footer de login.
5. `src/app/(dashboard)/eventos/EventosClientView.tsx` — Ajuste táctil de botones de acción en tarjetas.
6. `src/app/(dashboard)/servidores/ServidoresClientView.tsx` — Ajuste táctil de botones de acción en tarjetas.
7. `src/app/actions/catalogos.ts` — Eliminación de deduplicación destructiva.
8. `src/app/actions/consultas.ts` — Eliminación de deduplicación destructiva.

---

## 📌 Próximos Pasos Recomendados
1. Probar la consulta y exportación de reportes de Sanaín en la intranet para confirmar la visualización completa de los 93 asistentes.
2. Realizar un `git commit` y `git push origin main` para desplegar automáticamente a Vercel.
