# 📂 CARPETA CHATS — Guía de Uso

**Propósito:** Permitir retomar el trabajo con agentes AntiGravity desde cualquier equipo,
sin perder el contexto de lo que se estaba haciendo.

---

## 🧠 ¿Por qué esta carpeta?

Cada sesión de trabajo con un agente queda guardada localmente en la máquina donde se trabajó.
Al cambiar de equipo, el agente no sabe en qué punto quedaron las tareas.

Esta carpeta resuelve eso: al terminar cada sesión, el agente escribe un **resumen estructurado**
que puede leer en la siguiente sesión (desde cualquier máquina) para retomar exactamente donde quedó.

---

## 📋 Convención de Nombres

```
AG-sesion-YYMMDD-[tema].md
```

**Ejemplos:**
- `AG-sesion-260605-Setup-Inicial.md`
- `AG-sesion-260610-Modulo-Finanzas.md`
- `AG-sesion-260615-Fix-Auth.md`

---

## 🚀 Cómo Iniciar una Sesión Nueva

Al comenzar trabajo en cualquier equipo, dile al agente:

> **"Lee el último archivo en chats/ y retoma desde donde quedamos"**

---

## ✍️ Cómo Terminar una Sesión

Al terminar una sesión de trabajo, dile al agente:

> **"Guarda el resumen de esta sesión en chats/"**

---

## 📝 Formato del Resumen de Sesión

```markdown
# AG-sesion-YYMMDD-[tema]

**Fecha:** DD de MES de AAAA - HH:MM CST
**Versión al cerrar:** vX.XXX
**Equipo:** [nombre del equipo]
**Estado:** ✅ Completado / 🔄 En progreso / ⏸️ Pausado

## ✅ Lo que se hizo esta sesión
## 📁 Archivos Modificados
## ⏭️ Próximos pasos
## ⚠️ Pendientes / Bloqueadores
## 🔧 Comandos para retomar
```

---

> 📌 **Esta carpeta está en Git** — disponible en todos tus equipos tras `git pull`.
> ⚠️ **NUNCA pongas API keys ni contraseñas** en estos archivos.
