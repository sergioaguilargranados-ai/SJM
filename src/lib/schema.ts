import { pgTable, uuid, varchar, text, timestamp, date, boolean, integer, decimal } from "drizzle-orm/pg-core";

// -------------------------------------------------------------
// Core y Multi-Tenant
// -------------------------------------------------------------

export const organizaciones = pgTable("organizaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  dominio_tenant: varchar("dominio_tenant", { length: 255 }),
  creado_en: timestamp("creado_en").defaultNow(),
});

export const sedes = pgTable("sedes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  creado_en: timestamp("creado_en").defaultNow(),
});

export const roles_sistema = pgTable("roles_sistema", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
});

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  sede_id: uuid("sede_id").references(() => sedes.id),
  rol_id: uuid("rol_id").references(() => roles_sistema.id),
  correo: varchar("correo", { length: 255 }).unique().notNull(),
  celular: varchar("celular", { length: 20 }).unique(),
  contrasena_hash: text("contrasena_hash"),
  google_id: varchar("google_id", { length: 255 }),
  nombre_completo: varchar("nombre_completo", { length: 255 }).notNull(),
  foto_perfil_url: text("foto_perfil_url"),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Catálogos auxiliares
// -------------------------------------------------------------

export const estados_republica = pgTable("estados_republica", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
});

export const ministerios = pgTable("ministerios", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  descripcion: text("descripcion"),
});

export const cargos = pgTable("cargos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
});

// -------------------------------------------------------------
// Manejo de Servidores
// -------------------------------------------------------------

export const servidores = pgTable("servidores", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuario_id: uuid("usuario_id").references(() => usuarios.id).notNull(),
  sede_id: uuid("sede_id").references(() => sedes.id).notNull(),
  ministerio_id: uuid("ministerio_id").references(() => ministerios.id),
  cargo_id: uuid("cargo_id").references(() => cargos.id),
  
  estado_civil: varchar("estado_civil", { length: 100 }),
  fecha_nacimiento: date("fecha_nacimiento"),
  sexo: varchar("sexo", { length: 20 }),
  domicilio_calle: text("domicilio_calle"),
  domicilio_colonia: varchar("domicilio_colonia", { length: 255 }),
  domicilio_cp: varchar("domicilio_cp", { length: 10 }),
  estado_id: uuid("estado_id").references(() => estados_republica.id),
  telefono_emergencia: varchar("telefono_emergencia", { length: 50 }),
  contacto_emergencia: varchar("contacto_emergencia", { length: 255 }),
  
  fecha_ingreso: date("fecha_ingreso"),
  fecha_baja: date("fecha_baja"),
  nombre_gafete: varchar("nombre_gafete", { length: 150 }),
  avance_servidor: varchar("avance_servidor", { length: 255 }),
  retiros_tomados: integer("retiros_tomados").default(0),
  retiros_externos: integer("retiros_externos").default(0),
  observaciones: text("observaciones"),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// Módulo Eventos y Retiros
// -------------------------------------------------------------

export const tipos_eventos = pgTable("tipos_eventos", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  es_matrimonial: boolean("es_matrimonial").default(false),
});

export const casas_retiro = pgTable("casas_retiro", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  domicilio: text("domicilio"),
  codigo_postal: varchar("codigo_postal", { length: 10 }),
  estado_id: uuid("estado_id").references(() => estados_republica.id),
  latitud: decimal("latitud"),
  longitud: decimal("longitud"),
  encargado: varchar("encargado", { length: 255 }),
  telefonos: varchar("telefonos", { length: 255 }),
  costo_persona: decimal("costo_persona"),
  capacidad: integer("capacidad"),
  minimo_personas: integer("minimo_personas"),
  estatus: boolean("estatus").default(true),
});

export const eventos = pgTable("eventos", {
  id: uuid("id").primaryKey().defaultRandom(),
  sede_id: uuid("sede_id").references(() => sedes.id).notNull(),
  tipo_evento_id: uuid("tipo_evento_id").references(() => tipos_eventos.id).notNull(),
  casa_retiro_id: uuid("casa_retiro_id").references(() => casas_retiro.id).notNull(),
  
  fecha_inicio: timestamp("fecha_inicio"),
  fecha_fin: timestamp("fecha_fin"),
  costo_publico: decimal("costo_publico"),
  costo_casa_por_persona: decimal("costo_casa_por_persona"),
  cupo_maximo: integer("cupo_maximo"),
  estatus: varchar("estatus", { length: 50 }).default('PLANEACION'),
  
  recomendaciones: text("recomendaciones"),
  politica_cancelacion: text("politica_cancelacion"),
  link_minuta_evaluacion: text("link_minuta_evaluacion"),
});

// -------------------------------------------------------------
// Público e Inscripciones
// -------------------------------------------------------------

export const solicitudes_inscripcion = pgTable("solicitudes_inscripcion", {
  id: uuid("id").primaryKey().defaultRandom(),
  evento_id: uuid("evento_id").references(() => eventos.id).notNull(),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  
  nombre_asistente: varchar("nombre_asistente", { length: 255 }).notNull(),
  fecha_nacimiento: date("fecha_nacimiento"),
  edad: integer("edad"),
  sexo: varchar("sexo", { length: 20 }),
  estado_civil: varchar("estado_civil", { length: 100 }),
  telefono_celular: varchar("telefono_celular", { length: 50 }),
  correo: varchar("correo", { length: 255 }),
  nombre_gafete: varchar("nombre_gafete", { length: 150 }),
  
  es_primera_vez: boolean("es_primera_vez").default(true),
  parroquia_procedencia: varchar("parroquia_procedencia", { length: 255 }),
  medicinas_requeridas: text("medicinas_requeridas"),
  dificultad_escaleras: boolean("dificultad_escaleras").default(false),
  usa_estacionamiento: boolean("usa_estacionamiento").default(false),
  comparte_cuarto_con: varchar("comparte_cuarto_con", { length: 255 }),
  
  esposo_a_nombre: varchar("esposo_a_nombre", { length: 255 }),
  esposo_a_edad: integer("esposo_a_edad"),
  esposo_a_fecha_nacimiento: date("esposo_a_fecha_nacimiento"),
  esposo_a_celular: varchar("esposo_a_celular", { length: 50 }),
  fecha_boda: date("fecha_boda"),
  casados_por_iglesia: boolean("casados_por_iglesia").default(false),
  nombre_edades_hijos: text("nombre_edades_hijos"),
  
  quien_invito: varchar("quien_invito", { length: 255 }),
  expectativas: text("expectativas"),
  otros_retiros_tomados: text("otros_retiros_tomados"),
  observaciones: text("observaciones"),
  
  estatus_solicitud: varchar("estatus_solicitud", { length: 50 }).default('PENDIENTE_PAGO'),
  pago_deposito: decimal("pago_deposito").default('0'),
  pago_efectivo: decimal("pago_efectivo").default('0'),
  monto_beca: decimal("monto_beca").default('0'),
  url_comprobante_pago: text("url_comprobante_pago"),
  
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Control Operativo y Financiero
// -------------------------------------------------------------

export const equipo_evento = pgTable("equipo_evento", {
  id: uuid("id").primaryKey().defaultRandom(),
  evento_id: uuid("evento_id").references(() => eventos.id).notNull(),
  servidor_id: uuid("servidor_id").references(() => servidores.id).notNull(),
  cargo_evento_id: uuid("cargo_evento_id").references(() => cargos.id),
  asignaciones: text("asignaciones"),
  aportacion_economica: decimal("aportacion_economica").default('0'),
  estatus: boolean("estatus").default(true),
});

export const clasificaciones_gasto = pgTable("clasificaciones_gasto", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 150 }).notNull(),
});

export const gastos_evento = pgTable("gastos_evento", {
  id: uuid("id").primaryKey().defaultRandom(),
  evento_id: uuid("evento_id").references(() => eventos.id).notNull(),
  clasificacion_id: uuid("clasificacion_id").references(() => clasificaciones_gasto.id).notNull(),
  monto: decimal("monto").notNull(),
  descripcion: text("descripcion"),
  url_comprobante: text("url_comprobante"),
  fecha_gasto: date("fecha_gasto"),
  registrado_por: uuid("registrado_por").references(() => usuarios.id),
});

// -------------------------------------------------------------
// Documentos y Evaluaciones
// -------------------------------------------------------------

export const documentos_institucionales = pgTable("documentos_institucionales", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  url_archivo: text("url_archivo").notNull(),
  nivel_acceso_rol: varchar("nivel_acceso_rol", { length: 50 }),
  fecha_subida: timestamp("fecha_subida").defaultNow(),
});

export const evaluaciones_evento = pgTable("evaluaciones_evento", {
  id: uuid("id").primaryKey().defaultRandom(),
  evento_id: uuid("evento_id").references(() => eventos.id).notNull(),
  solicitud_id: uuid("solicitud_id").references(() => solicitudes_inscripcion.id),
  
  cumplio_expectativas: boolean("cumplio_expectativas"),
  calificacion_instalaciones: integer("calificacion_instalaciones"),
  calificacion_alimentos: integer("calificacion_alimentos"),
  calificacion_organizacion: integer("calificacion_organizacion"),
  te_confesaste: boolean("te_confesaste"),
  tema_mas_gusto: varchar("tema_mas_gusto", { length: 255 }),
  oracion_mas_gusto: varchar("oracion_mas_gusto", { length: 255 }),
  comentarios_sugerencias: text("comentarios_sugerencias"),
  
  gustas_integrarte: boolean("gustas_integrarte"),
  gustas_apoyar_economicamente: boolean("gustas_apoyar_economicamente"),
  oficio_profesion: varchar("oficio_profesion", { length: 255 }),
});
