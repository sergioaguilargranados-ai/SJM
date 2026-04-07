# 🗄️ Esquema Inicial de Base de Datos - Plataforma SJM

**Fecha:** 04 de Abril de 2026
**Propósito:** Definición inicial del esquema Entidad-Relación basado en el contexto histórico y la nueva arquitectura Multi-Tenant, utilizando nomenclatura 100% en ESPAÑOL.
**ORM propuesto:** Drizzle ORM (excelente compatibilidad con NEON y tipado estricto).

---

## 1. Módulo Core (Multi-Organización y Usuarios)

```typescript
// -------------------------------------------------------------
// Core y Multi-Tenant
// -------------------------------------------------------------

Tabla organizaciones {
  id: uuid [PK]
  nombre: string // ej. "Servidores de Jesús por María Nacional"
  dominio_tenant: string // para posibles subdominios
  creado_en: datetime
}

Tabla sedes {
  id: uuid [PK]
  organizacion_id: uuid [FK -> organizaciones.id]
  nombre: string // ej. "Sede CDMX", "Sede Monterrey"
  creado_en: datetime
}

Tabla roles_sistema {
  id: uuid [PK]
  nombre: string // SUPER_ADMIN, ADMIN_ORG, OPERATIVO_SEDE, SERVIDOR, APP_USER
}

Tabla usuarios {
  id: uuid [PK]
  organizacion_id: uuid [FK -> organizaciones.id]
  sede_id: uuid [FK -> sedes.id, null]
  rol_id: uuid [FK -> roles_sistema.id]
  correo: string [ÚNICO]
  celular: string [ÚNICO]
  contrasena_hash: string // opcional si se usa Google
  google_id: string 
  nombre_completo: string
  foto_perfil_url: string // Link a Cloudflare R2
  creado_en: datetime
}
```

## 2. Módulo Comunidad (Catálogos y Servidores)

```typescript
// -------------------------------------------------------------
// Catálogos auxiliares (Histórico SJM_ESTADOS, SJM_MINISTERIOS)
// -------------------------------------------------------------

Tabla estados_republica {
  id: uuid [PK]
  nombre: string
}

Tabla ministerios {
  id: uuid [PK]
  organizacion_id: uuid [FK -> organizaciones.id]
  nombre: string // ej. "Música", "Cocina", "Liturgia"
  descripcion: string
}

Tabla cargos {
  id: uuid [PK]
  nombre: string // ej. "Coordinador", "Subcoordinador", "Apoyo"
}

// -------------------------------------------------------------
// SJM_SERVIDORES (Manejo de Servidores/Comunidad)
// -------------------------------------------------------------

Tabla servidores {
  id: uuid [PK]
  usuario_id: uuid [FK -> usuarios.id] // Vinculado a Auth
  sede_id: uuid [FK -> sedes.id]
  ministerio_id: uuid [FK -> ministerios.id, null]
  cargo_id: uuid [FK -> cargos.id, null]
  
  // Datos Personales
  estado_civil: string
  fecha_nacimiento: date
  sexo: string
  domicilio_calle: string
  domicilio_colonia: string
  domicilio_cp: string
  estado_id: uuid [FK -> estados_republica.id]
  telefono_emergencia: string
  contacto_emergencia: string
  
  // Perfil del Servidor SJM
  fecha_ingreso: date
  fecha_baja: date [null]
  nombre_gafete: string
  avance_servidor: string // Nivel jerárquico o espiritual
  retiros_tomados: integer
  retiros_externos: integer
  observaciones: text
  estatus: boolean // activo/inactivo
}
```

## 3. Módulo Eventos y Retiros

```typescript
// -------------------------------------------------------------
// SJM_TIPOS_RETIROS y SJM_CASAS_RETIRO
// -------------------------------------------------------------

Tabla tipos_eventos {
  id: uuid [PK]
  organizacion_id: uuid [FK -> organizaciones.id]
  nombre: string // "Retiro de Iniciación", "Retiro Matrimonial", "Taller"
  es_matrimonial: boolean // Importante para pedir datos del cónyuge
}

Tabla casas_retiro {
  id: uuid [PK]
  nombre: string
  domicilio: string
  codigo_postal: string
  estado_id: uuid [FK -> estados_republica.id]
  latitud: decimal [null]
  longitud: decimal [null]
  encargado: string
  telefonos: string
  costo_persona: decimal
  capacidad: integer
  minimo_personas: integer
  estatus: boolean
}

// -------------------------------------------------------------
// SJM_RETIROS (Eventos creados)
// -------------------------------------------------------------

Tabla eventos {
  id: uuid [PK]
  sede_id: uuid [FK -> sedes.id]
  tipo_evento_id: uuid [FK -> tipos_eventos.id]
  casa_retiro_id: uuid [FK -> casas_retiro.id]
  
  fecha_inicio: datetime
  fecha_fin: datetime
  costo_publico: decimal
  costo_casa_por_persona: decimal
  cupo_maximo: integer
  estatus: string // "PLANEACION", "ABIERTO", "EN_CURSO", "FINALIZADO", "CANCELADO"
  
  recomendaciones: text
  politica_cancelacion: text
  link_minuta_evaluacion: string
}
```

## 4. Módulo de Inscripciones e Ingresos

```typescript
// -------------------------------------------------------------
// SJM_SOLICITUDES (Público general que se inscribe a un evento)
// -------------------------------------------------------------

Tabla solicitudes_inscripcion {
  id: uuid [PK]
  evento_id: uuid [FK -> eventos.id]
  usuario_id: uuid [FK -> usuarios.id, null] // Null si lo captura un admin manual
  
  // Datos Generales
  nombre_asistente: string
  fecha_nacimiento: date
  edad: integer
  sexo: string
  estado_civil: string
  telefono_celular: string
  correo: string
  nombre_gafete: string
  
  // Salud y Logística
  es_primera_vez: boolean
  parroquia_procedencia: string
  medicinas_requeridas: text
  dificultad_escaleras: boolean
  usa_estacionamiento: boolean
  comparte_cuarto_con: string
  
  // Datos Cónyuge (si tipo_evento.es_matrimonial == true)
  esposo_a_nombre: string
  esposo_a_edad: integer
  esposo_a_fecha_nacimiento: date
  esposo_a_celular: string
  fecha_boda: date [null]
  casados_por_iglesia: boolean
  nombre_edades_hijos: text
  
  // Seguimiento SJM
  quien_invito: string
  expectativas: text
  otros_retiros_tomados: text
  observaciones: text
  
  // Estatus y Control Financiero
  estatus_solicitud: string // "PENDIENTE_PAGO", "CONFIRMADO", "CANCELADO", "ASISTIO"
  pago_deposito: decimal
  pago_efectivo: decimal
  monto_beca: decimal
  url_comprobante_pago: string // R2 Cloudflare
  
  creado_en: datetime
}
```

## 5. Módulo Control Operativo y Financiero de Retiros

```typescript
// -------------------------------------------------------------
// SJM_EQUIPO_RET (Servidores asignados a trabajar en el retiro)
// -------------------------------------------------------------

Tabla equipo_evento {
  id: uuid [PK]
  evento_id: uuid [FK -> eventos.id]
  servidor_id: uuid [FK -> servidores.id]
  cargo_evento_id: uuid [FK -> cargos.id]
  asignaciones: text
  aportacion_economica: decimal // Cuánto aportó el servidor
  estatus: boolean
}

// -------------------------------------------------------------
// GASTOS POR EVENTO (Para tu control financiero)
// -------------------------------------------------------------

Tabla clasificaciones_gasto {
  id: uuid [PK]
  nombre: string // "Papelería", "Estipendios", "Despensa"
}

Tabla gastos_evento {
  id: uuid [PK]
  evento_id: uuid [FK -> eventos.id]
  clasificacion_id: uuid [FK -> clasificaciones_gasto.id]
  monto: decimal
  descripcion: text
  url_comprobante: string // Ticket foto en R2
  fecha_gasto: date
  registrado_por: uuid [FK -> usuarios.id]
}
```

## 6. Gestor Documental y Evaluaciones

```typescript
// -------------------------------------------------------------
// Archivos institucionales (Manuales, políticas)
// -------------------------------------------------------------

Tabla documentos_institucionales {
  id: uuid [PK]
  organizacion_id: uuid [FK -> organizaciones.id]
  nombre: string
  descripcion: text
  url_archivo: string // R2
  nivel_acceso_rol: string // MIN_ROLE requiered para ver
  fecha_subida: datetime
}

// -------------------------------------------------------------
// SJM_EVALUACIONES (Encuestas post-evento)
// -------------------------------------------------------------

Tabla evaluaciones_evento {
  id: uuid [PK]
  evento_id: uuid [FK -> eventos.id]
  solicitud_id: uuid [FK -> solicitudes_inscripcion.id, null] // Puede ser anónima
  
  cumplio_expectativas: boolean
  calificacion_instalaciones: integer
  calificacion_alimentos: integer
  calificacion_organizacion: integer
  te_confesaste: boolean
  tema_mas_gusto: string
  oracion_mas_gusto: string
  comentarios_sugerencias: text
  
  gustas_integrarte: boolean
  gustas_apoyar_economicamente: boolean
  oficio_profesion: string // Útil si quieren ser servidores
}
```
---
**Nota para el cliente:** Revisa esta estructura. Está diseñada para cubrir todos los campos históricos (como `SOL_USA_ESTACIONAMIENTO`, `SOL_HAZ_VIVIDO_EN_PAREJA` encapsulados lógicamente) pero usando una nomenclatura pura que Drizzle transfiere limpiamente a Neon. ¿Te parece correcta para empezar con el código?
