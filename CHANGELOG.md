# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-07-16
### Agregado
- Nuevas columnas exportables en la vista de **Asistentes Registrados** (Dashboard Eventos):
  - **Llegada y Salida:** Fechas, lugares y medios de transporte.
  - **Logística:** Equipo asignado, número de cuarto, acompañantes de cuarto, participación en paseos.
  - **Médico:** Consideraciones de escaleras y consultas médicas.
- Formato específico para campos booleanos exportados (convertidos automáticamente a "SÍ" y "NO" para simplificar la lectura en reportes Excel/PDF).

### Cambiado
- Todas las nuevas columnas logísticas y médicas están configuradas con `ocultarEnUI: true` por defecto para preservar la legibilidad de la tabla en pantalla, quedando disponibles mediante el selector de "Columnas".

## [0.1.0] - 2026-07-16
### Agregado
- Versión base inicial del sistema SJM Platform.
- Gestión de Usuarios y Roles.
- Gestión de Eventos y Catálogos.
- Inscripciones y Hospedaje.
