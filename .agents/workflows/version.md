---
description: Actualizar la versión del proyecto SJM antes de cada commit/deploy
---

# Versionamiento SJM

## Formato de Versión
- **Formato:** `v1.XXX` (tres dígitos con padding de ceros)
- **Zona Horaria:** CST (CDMX) — UTC-6
- **Formato de fecha:** `DD de Mes de AAAA - HH:MM CST`

## Archivos a Actualizar (TODOS son obligatorios)

### 1. Histórico de Cambios
**Archivo:** `docs/AG-Historico-Cambios.md`
- Agregar nueva entrada al INICIO del archivo (después del header)
- Formato:
```markdown
### vX.XXX - DD de Mes de AAAA - HH:MM CST
- **[Título del cambio]:** Descripción concisa de lo realizado.
```
- Actualizar la línea `**Última actualización:**` en el header

### 2. Footer del Root Layout
**Archivo:** `src/app/layout.tsx`
- Buscar: `Build: v1.XXX`
- Reemplazar con nueva versión y fecha CDMX

### 3. Footer de Landing Page
**Archivo:** `src/app/page.tsx`
- Buscar: `Plataforma SJM v1.XXX`
- Reemplazar con nueva versión

### 4. Footer de Login
**Archivo:** `src/app/login/page.tsx`
- Buscar: `© 2026 Admin SJM Nacional v1.XXX`
- Reemplazar con nueva versión

## Ejemplo Completo
Si la versión actual es v1.055 y el nuevo cambio es:

```
Versión nueva: v1.060
Fecha CDMX: 07 de Abril de 2026 - 16:45 CST

layout.tsx → Build: v1.060 - Master Production (CDMX: 07-04-26 16:45)
page.tsx → Plataforma SJM v1.060
login/page.tsx → © 2026 Admin SJM Nacional v1.060
```

## Notas
- La versión SIEMPRE se incrementa, nunca se decrementa
- Cada sesión de trabajo debe generar al menos una versión nueva
- El histórico es acumulativo y nunca se borran entradas anteriores
