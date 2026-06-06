# AG-sesion-260605-Setup-Chats-SJM

**Fecha:** 05 de Junio de 2026 - 18:24 CST  
**Versión al cerrar:** v1.185  
**Equipo:** Lenovo (c:\SJM\sjm-platform)  
**Estado:** ✅ Setup de carpeta chats/ completado

---

## ✅ Lo que se hizo esta sesión

- Creada carpeta `chats/` para continuidad multi-equipo
- Creado `AG-COMO-USAR-ESTA-CARPETA.md` con guía de uso
- Este es el primer resumen de sesión del proyecto SJM

---

## 📁 Archivos Creados Esta Sesión

- `chats/AG-COMO-USAR-ESTA-CARPETA.md` — [NUEVO] Guía de uso
- `chats/AG-sesion-260605-Setup-Chats-SJM.md` — [NUEVO] Este archivo

---

## 🗂️ Contexto del Proyecto SJM

- **Nombre:** Plataforma SJM — "Servidores de Jesús por María"
- **URL:** www.serjema.com.mx (migrando a serjema.com)
- **Ubicación:** `c:\SJM\sjm-platform\`
- **Stack:** Next.js 15 + TypeScript + Drizzle ORM + Neon PostgreSQL + Auth.js
- **Versión actual:** v1.185 (13 Mayo 2026)
- **Repo Git:** https://github.com/sergioaguilargranados-ai/SJM.git

---

## 📊 Estado del Proyecto (v1.185)

| Módulo | Estado |
|--------|--------|
| Autenticación (Google, Email, Celular) | ✅ Completo |
| Multi-tenant / Marca Blanca | ✅ Completo |
| RBAC (Triple Filtro Seguridad) | ✅ Completo |
| Landing Page pública | ✅ Completo (17 páginas) |
| Intranet / Dashboard | ✅ Completo |
| PWA (instalable en móvil) | ✅ Implementado v1.170 |
| Módulo de Finanzas y Gastos | ✅ Completo v1.185 |
| Admin CMS (Contenido, Tienda, Blog) | ✅ Completo |
| WhatsApp (Twilio) | ✅ Implementado |
| Emails (Resend) | ✅ Implementado |

---

## ⏭️ Próximos Pasos

> Retomar leyendo `docs/AG-Historico-Cambios.md` para ver el estado más reciente
> y preguntar al usuario qué necesita continuar.

---

## 🔧 Comandos para Retomar

```bash
# Entrar al proyecto
cd c:\SJM\sjm-platform

# Ver estado
git status
git log --oneline -5

# Iniciar servidor local
npm run dev
# o
yarn dev

# Migraciones DB (si aplica)
npx drizzle-kit push
```

**URL local:** http://localhost:3000  
**URL producción:** https://www.serjema.com.mx

---

## 🗒️ Convenciones del Proyecto SJM

- **Versiones:** Formato `v1.XXX` (ej: v1.186)
- **Zona horaria:** CST (Ciudad de México, UTC-6)
- **Idioma:** 100% español (código, BD, comunicación)
- **Archivos de versión:** `AppFooter.tsx`, `page.tsx` (landing), `login/page.tsx`, `AG-Historico-Cambios.md`
- **Tema:** Claro/Oscuro con `next-themes` — SIEMPRE usar prefijo `dark:` de Tailwind
