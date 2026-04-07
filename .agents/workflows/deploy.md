---
description: Hacer commit y push del proyecto SJM a GitHub (deploy automático a Vercel)
---

# Deploy - Git Push a Producción

## Información de Repositorio
- **Remote:** `origin` → `https://github.com/sergioaguilargranados-ai/SJM.git`
- **Branch:** `main`
- **Usuario Git:** `sergioaguilargranados-ai`
- **Hosting:** Vercel (auto-deploy desde GitHub push)
- **Directorio de trabajo:** `c:\SJM\sjm-platform`

## Pre-requisitos (OBLIGATORIOS antes de push)
1. ✅ Ejecutar workflow `/build` — build exitoso sin errores
2. ✅ Ejecutar workflow `/version` — versión actualizada en todos los archivos
3. ✅ Verificar que no hay archivos sensibles (.env.local) en el stage

## Pasos

// turbo
1. Verificar archivos modificados:
```
git status
```

// turbo
2. Agregar todos los cambios al stage:
```
git add -A
```

3. Crear el commit con mensaje descriptivo:
```
git commit -m "vX.XXX - [Descripción breve del cambio]"
```
- El mensaje SIEMPRE inicia con la versión
- Descripción en español
- Ejemplo: `git commit -m "v1.060 - Fix Dark Mode, Workflows de desarrollo"`

4. Push a producción:
```
git push origin main
```

## Post-Deploy
- Vercel detecta el push automáticamente e inicia el build
- El build de Vercel toma ~1-2 minutos
- Verificar en https://vercel.com que el deploy fue exitoso

## Archivos que NUNCA deben estar en Git
- `.env.local` (ya está en `.gitignore`)
- `node_modules/` (ya está en `.gitignore`)
- Cualquier archivo con credenciales o tokens

## Troubleshooting
- Si el push falla con "authentication", el usuario debe re-autenticar con GitHub CLI o token
- Si Vercel build falla, revisar logs en el dashboard de Vercel
