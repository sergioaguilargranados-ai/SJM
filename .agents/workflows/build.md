---
description: Compilar y verificar el proyecto SJM Platform
---

# Build - Compilación y Verificación

## Información del Proyecto
- **Directorio raíz:** `c:\SJM\sjm-platform`
- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4

## Pasos

// turbo
1. Ejecutar el build de producción:
```
npm run build
```
Directorio de trabajo: `c:\SJM\sjm-platform`

2. Verificar que NO haya errores de TypeScript en la salida. Si hay errores:
   - Leer el error completo
   - Corregir el archivo indicado
   - Repetir el paso 1

3. Verificar que el número de rutas generadas sea >= 28 (cantidad mínima actual).

## Resultado Esperado
- ✅ Build exitoso sin errores TypeScript
- ✅ Todas las rutas estáticas y dinámicas generadas correctamente
- ✅ Mensaje final: `✓ Generating static pages`

## Notas
- El build SIEMPRE debe pasar antes de hacer push a Git
- Si hay warnings de ESLint, son aceptables. Solo errores de TS son bloqueantes.
