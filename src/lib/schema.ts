import { pgTable, uuid, varchar, text, timestamp, date, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -------------------------------------------------------------
// Core y Multi-Tenant (Control de Acceso y Planes)
// -------------------------------------------------------------

export const planes = pgTable("planes", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 100 }).notNull(), // Landing, Admin, Premium
  clave: varchar("clave", { length: 50 }).unique().notNull(), // landing, admin, premium
  descripcion: text("descripcion"),
  limite_servidores: integer("limite_servidores").default(0),
  limite_eventos: integer("limite_eventos").default(0),
  precio_mensual: decimal("precio_mensual").default("0"),
  estatus: boolean("estatus").default(true),
});

export const organizaciones = pgTable("organizaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  plan_id: uuid("plan_id").references(() => planes.id), // Vinculación con Plan de Contratación
  nombre: varchar("nombre", { length: 255 }).notNull(),
  lema: varchar("lema", { length: 255 }),
  logo_url: text("logo_url"),
  // Contacto Expandido
  telefono_contacto: varchar("telefono_contacto", { length: 50 }),
  whatsapp_contacto: varchar("whatsapp_contacto", { length: 50 }),
  correo_contacto: varchar("correo_contacto", { length: 255 }),
  direccion_completa: text("direccion_completa"),
  ubicacion_url: text("ubicacion_url"),
  horarios_atencion: varchar("horarios_atencion", { length: 255 }),

  // Redes Sociales
  facebook_url: varchar("facebook_url", { length: 255 }),
  instagram_url: varchar("instagram_url", { length: 255 }),
  youtube_url: varchar("youtube_url", { length: 255 }),

  // Marca Blanca — Colores
  color_primario: varchar("color_primario", { length: 7 }).default("#00B4AA"),
  color_secundario: varchar("color_secundario", { length: 7 }).default("#1E3A5F"),
  color_terciario: varchar("color_terciario", { length: 7 }).default("#FFFFFF"),

  // Multi-Dominio / Marca Blanca
  dominio_tenant: varchar("dominio_tenant", { length: 255 }),
  dominio_aliases: text("dominio_aliases"), 

  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Ramas Funcionales y Acciones (RBAC Granular)
// -------------------------------------------------------------

export const modulos_sistema = pgTable("modulos_sistema", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 100 }).notNull(), // ej: "Gestión de Servidores"
  clave: varchar("clave", { length: 50 }).unique().notNull(), // ej: "servidores"
  icono: varchar("icono", { length: 50 }),
});

export const funciones_sistema = pgTable("funciones_sistema", {
  id: uuid("id").primaryKey().defaultRandom(),
  modulo_id: uuid("modulo_id").references(() => modulos_sistema.id).notNull(),
  nombre: varchar("nombre", { length: 150 }).notNull(), // ej: "Padron de Servidores"
  clave: varchar("clave", { length: 100 }).unique().notNull(), // ej: "servidores.padron"
  descripcion: text("descripcion"),
});

export const acciones_sistema = pgTable("acciones_sistema", {
  id: uuid("id").primaryKey().defaultRandom(),
  funcion_id: uuid("funcion_id").references(() => funciones_sistema.id).notNull(),
  nombre: varchar("nombre", { length: 100 }).notNull(), // ej: "Crear", "Eliminar", "Ver"
  clave: varchar("clave", { length: 100 }).notNull(), // ej: "create", "delete", "view"
});

// -------------------------------------------------------------
// Vinculación de Permisos (Planes y Roles)
// -------------------------------------------------------------

export const plan_permisos = pgTable("plan_permisos", {
  id: uuid("id").primaryKey().defaultRandom(),
  plan_id: uuid("plan_id").references(() => planes.id).notNull(),
  funcion_id: uuid("funcion_id").references(() => funciones_sistema.id).notNull(),
});

export const roles_sistema = pgTable("roles_sistema", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  es_admin_sistema: boolean("es_admin_sistema").default(false),
});

export const rol_permisos = pgTable("rol_permisos", {
  id: uuid("id").primaryKey().defaultRandom(),
  rol_id: uuid("rol_id").references(() => roles_sistema.id).notNull(),
  accion_id: uuid("accion_id").references(() => acciones_sistema.id).notNull(),
});

export const sedes = pgTable("sedes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  creado_en: timestamp("creado_en").defaultNow(),
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
  fecha_nacimiento: date("fecha_nacimiento"),
  es_servidor: boolean("es_servidor").default(false),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Tokens de Recuperación de Contraseña
// -------------------------------------------------------------

export const tokens_recuperacion = pgTable("tokens_recuperacion", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuario_id: uuid("usuario_id").references(() => usuarios.id).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expira_en: timestamp("expira_en").notNull(),
  usado: boolean("usado").default(false),
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
  
  // Campos Especiales para Diplomados u Otros Eventos
  pais_ciudad: varchar("pais_ciudad", { length: 255 }),
  ministerio_actual: varchar("ministerio_actual", { length: 255 }),
  compromiso_pago_99usd: boolean("compromiso_pago_99usd").default(false),
  
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

// -------------------------------------------------------------
// CMS — Parámetros Landing (Marca Blanca Parametrizada)
// -------------------------------------------------------------

export const parametros_landing = pgTable("parametros_landing", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  // Colores con clave descriptiva
  color_primario_clave: varchar("color_primario_clave", { length: 50 }),
  color_primario_hex: varchar("color_primario_hex", { length: 7 }).default("#1E3A5F"),
  color_secundario_clave: varchar("color_secundario_clave", { length: 50 }),
  color_secundario_hex: varchar("color_secundario_hex", { length: 7 }).default("#00B4AA"),
  color_terciario_clave: varchar("color_terciario_clave", { length: 50 }),
  color_terciario_hex: varchar("color_terciario_hex", { length: 7 }).default("#FFFFFF"),
  // Cenefa
  cenefa_transparencia: integer("cenefa_transparencia").default(70),
  // Footer degradado
  footer_color_inicio: varchar("footer_color_inicio", { length: 7 }).default("#000000"),
  footer_color_fin: varchar("footer_color_fin", { length: 7 }).default("#4B5563"),
  footer_telefonos: text("footer_telefonos"), // JSON array
  footer_ubicacion: text("footer_ubicacion"),
  // Carrusel principal (hasta 4 imágenes)
  carrusel_imagenes: text("carrusel_imagenes"), // JSON [{url, nota_pie, orden}]
  // Videos generales
  videos_principales: text("videos_principales"), // JSON [{url, titulo, nota_pie}]
  // WhatsApp
  whatsapp_qr_url: text("whatsapp_qr_url"),
  whatsapp_numero: varchar("whatsapp_numero", { length: 20 }),
  // Google Maps
  mapa_embed_url: text("mapa_embed_url"),
  mapa_latitud: decimal("mapa_latitud"),
  mapa_longitud: decimal("mapa_longitud"),
  // Orden de secciones landing principal (JSON array)
  orden_secciones: text("orden_secciones"),
  creado_en: timestamp("creado_en").defaultNow(),
  actualizado_en: timestamp("actualizado_en").defaultNow(),
});

// -------------------------------------------------------------
// CMS — Secciones de Contenido (para todas las páginas)
// -------------------------------------------------------------

export const secciones_contenido = pgTable("secciones_contenido", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  pagina_clave: varchar("pagina_clave", { length: 100 }).notNull(), // "nosotros", "mundo_infantil", etc.
  tipo: varchar("tipo", { length: 50 }).default("seccion"), // "menu_tarjeta", "seccion", "video_principal"
  orden: integer("orden").default(0),
  // Contenido
  titulo: varchar("titulo", { length: 255 }),
  subtitulo: varchar("subtitulo", { length: 255 }),
  contenido: text("contenido"),
  autoria: varchar("autoria", { length: 255 }),
  // Multimedia
  imagen_url: text("imagen_url"),
  imagen_nota_pie: varchar("imagen_nota_pie", { length: 255 }),
  video_url: text("video_url"),
  video_nota_pie: varchar("video_nota_pie", { length: 255 }),
  // Menú tarjeta
  lema_tarjeta: varchar("lema_tarjeta", { length: 255 }),
  imagen_tarjeta_url: text("imagen_tarjeta_url"),
  // Estado
  visible: boolean("visible").default(true),
  funcion_id: uuid("funcion_id").references(() => funciones_sistema.id),
  estatus: boolean("estatus").default(true),
  creado_en: timestamp("creado_en").defaultNow(),
  actualizado_en: timestamp("actualizado_en").defaultNow(),
});

// -------------------------------------------------------------
// CMS — Teléfonos de Emergencia y Contacto
// -------------------------------------------------------------

export const telefonos_emergencia = pgTable("telefonos_emergencia", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  tipo: varchar("tipo", { length: 50 }).default("emergencia"), // "emergencia", "administracion"
  nombre_contacto: varchar("nombre_contacto", { length: 255 }),
  telefono: varchar("telefono", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  whatsapp_qr_url: text("whatsapp_qr_url"),
  cargo: varchar("cargo", { length: 255 }),
  horario: varchar("horario", { length: 100 }),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// CMS — Responsables de la Organización (directivos con foto)
// -------------------------------------------------------------

export const responsables_organizacion = pgTable("responsables_organizacion", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  cargo: varchar("cargo", { length: 255 }),
  foto_url: text("foto_url"),
  correo: varchar("correo", { length: 255 }),
  telefono: varchar("telefono", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  mensaje_saludo: text("mensaje_saludo"),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// CMS — Testimonios Parametrizados
// -------------------------------------------------------------

export const testimonios = pgTable("testimonios", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre_autor: varchar("nombre_autor", { length: 255 }),
  es_anonimo: boolean("es_anonimo").default(false),
  texto: text("texto").notNull(),
  calificacion: integer("calificacion").default(5),
  foto_url: text("foto_url"),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  aprobado: boolean("aprobado").default(false),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// CMS — Preguntas Frecuentes Parametrizadas
// -------------------------------------------------------------

export const preguntas_frecuentes = pgTable("preguntas_frecuentes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  pagina_clave: varchar("pagina_clave", { length: 100 }).default("general"),
  pregunta: text("pregunta").notNull(),
  respuesta: text("respuesta").notNull(),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// CMS — Galería de Fotos (cintas/collages por página)
// -------------------------------------------------------------

export const galeria_fotos = pgTable("galeria_fotos", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  pagina_clave: varchar("pagina_clave", { length: 100 }).notNull(),
  imagen_url: text("imagen_url").notNull(),
  titulo: varchar("titulo", { length: 255 }),
  descripcion: text("descripcion"),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// CMS — Letreros Especiales Parametrizados
// (ELEMA KIDS, ELEMÁ, Plenitud Matrimonial, Magnificat)
// -------------------------------------------------------------

export const letreros_especiales = pgTable("letreros_especiales", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  pagina_clave: varchar("pagina_clave", { length: 100 }).notNull(),
  texto_principal: varchar("texto_principal", { length: 255 }).notNull(),
  texto_subtitulo: varchar("texto_subtitulo", { length: 255 }),
  fuente_especial: varchar("fuente_especial", { length: 100 }),
  color_texto: varchar("color_texto", { length: 7 }),
  estilo: varchar("estilo", { length: 50 }).default("elegante"),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// Tienda Online — Categorías de Producto
// -------------------------------------------------------------

export const categorias_producto = pgTable("categorias_producto", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  imagen_url: text("imagen_url"),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// Tienda Online — Productos
// -------------------------------------------------------------

export const productos_tienda = pgTable("productos_tienda", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  precio: decimal("precio").notNull(),
  precio_anterior: decimal("precio_anterior"),
  categoria_id: uuid("categoria_id").references(() => categorias_producto.id),
  imagen_principal_url: text("imagen_principal_url"),
  imagenes_adicionales: text("imagenes_adicionales"), // JSON array
  sku: varchar("sku", { length: 50 }),
  stock: integer("stock").default(0),
  peso: decimal("peso"),
  destacado: boolean("destacado").default(false),
  estatus: boolean("estatus").default(true),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Tienda Online — Pedidos Web
// -------------------------------------------------------------

export const pedidos_web = pgTable("pedidos_web", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  usuario_id: uuid("usuario_id").references(() => usuarios.id),
  folio: varchar("folio", { length: 50 }),
  // Datos cliente
  nombre_cliente: varchar("nombre_cliente", { length: 255 }).notNull(),
  correo_cliente: varchar("correo_cliente", { length: 255 }),
  telefono_cliente: varchar("telefono_cliente", { length: 50 }),
  direccion_envio: text("direccion_envio"),
  // Financiero
  subtotal: decimal("subtotal").default("0"),
  impuestos: decimal("impuestos").default("0"),
  costo_envio: decimal("costo_envio").default("0"),
  total: decimal("total").default("0"),
  metodo_pago: varchar("metodo_pago", { length: 50 }),
  referencia_pago: varchar("referencia_pago", { length: 255 }),
  // Entrega
  forma_entrega: varchar("forma_entrega", { length: 50 }),
  sede_recoger_id: uuid("sede_recoger_id").references(() => sedes.id),
  // Estado
  estatus: varchar("estatus", { length: 50 }).default("PENDIENTE"),
  notas: text("notas"),
  creado_en: timestamp("creado_en").defaultNow(),
  actualizado_en: timestamp("actualizado_en").defaultNow(),
});

// -------------------------------------------------------------
// Tienda Online — Detalle de Pedido
// -------------------------------------------------------------

export const detalle_pedido = pgTable("detalle_pedido", {
  id: uuid("id").primaryKey().defaultRandom(),
  pedido_id: uuid("pedido_id").references(() => pedidos_web.id).notNull(),
  producto_id: uuid("producto_id").references(() => productos_tienda.id).notNull(),
  cantidad: integer("cantidad").notNull(),
  precio_unitario: decimal("precio_unitario").notNull(),
  subtotal: decimal("subtotal").notNull(),
});

// -------------------------------------------------------------
// Tienda Online — Formas de Entrega
// -------------------------------------------------------------

export const formas_entrega = pgTable("formas_entrega", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  costo: decimal("costo").default("0"),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// Tienda Online — Textos Medios de Pago
// -------------------------------------------------------------

export const textos_medios_pago = pgTable("textos_medios_pago", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  contenido: text("contenido"),
  tipo: varchar("tipo", { length: 50 }),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// Tienda Online — Notificaciones
// -------------------------------------------------------------

export const notificaciones_tienda = pgTable("notificaciones_tienda", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  tipo: varchar("tipo", { length: 50 }),
  asunto: varchar("asunto", { length: 255 }),
  cuerpo_html: text("cuerpo_html"),
  estatus: boolean("estatus").default(true),
});

// -------------------------------------------------------------
// Agenda de Retiros (calendario público y gestión intranet)
// -------------------------------------------------------------

export const agenda_retiros = pgTable("agenda_retiros", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  tipo_evento_id: uuid("tipo_evento_id").references(() => tipos_eventos.id).notNull(),
  sede_id: uuid("sede_id").references(() => sedes.id),
  casa_retiro_id: uuid("casa_retiro_id").references(() => casas_retiro.id),
  nombre_evento: varchar("nombre_evento", { length: 255 }).notNull(),
  fecha_inicio: timestamp("fecha_inicio"),
  fecha_fin: timestamp("fecha_fin"),
  hora_entrada: varchar("hora_entrada", { length: 10 }),
  hora_salida: varchar("hora_salida", { length: 10 }),
  cupo_maximo: integer("cupo_maximo"),
  costo: decimal("costo"),
  descripcion: text("descripcion"),
  estatus: varchar("estatus", { length: 50 }).default("PROXIMA"),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Blog — Artículos (Crecimientos, Formación)
// -------------------------------------------------------------

export const articulos_blog = pgTable("articulos_blog", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  blog_clave: varchar("blog_clave", { length: 50 }).default("crecimientos"),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  extracto: text("extracto"),
  contenido: text("contenido"),
  imagen_portada_url: text("imagen_portada_url"),
  autor_id: uuid("autor_id").references(() => usuarios.id),
  categoria: varchar("categoria", { length: 100 }),
  etiquetas: text("etiquetas"), // JSON array
  publicado: boolean("publicado").default(false),
  fecha_publicacion: timestamp("fecha_publicacion"),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Media — Música, Podcast, Videos
// -------------------------------------------------------------

export const media_contenido = pgTable("media_contenido", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizacion_id: uuid("organizacion_id").references(() => organizaciones.id).notNull(),
  tipo: varchar("tipo", { length: 50 }).notNull(), // "musica", "podcast", "video"
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  url_contenido: text("url_contenido").notNull(),
  imagen_miniatura_url: text("imagen_miniatura_url"),
  duracion: varchar("duracion", { length: 20 }),
  artista_autor: varchar("artista_autor", { length: 255 }),
  categoria: varchar("categoria", { length: 100 }),
  orden: integer("orden").default(0),
  estatus: boolean("estatus").default(true),
  creado_en: timestamp("creado_en").defaultNow(),
});

// -------------------------------------------------------------
// Relaciones (Relations) — ORM Drizzle
// -------------------------------------------------------------

export const modulosRelations = relations(modulos_sistema, ({ many }) => ({
 funciones: many(funciones_sistema),
}));

export const funcionesRelations = relations(funciones_sistema, ({ one, many }) => ({
 modulo: one(modulos_sistema, { fields: [funciones_sistema.modulo_id], references: [modulos_sistema.id] }),
 acciones: many(acciones_sistema),
}));

export const accionesRelations = relations(acciones_sistema, ({ one, many }) => ({
 funcion: one(funciones_sistema, { fields: [acciones_sistema.funcion_id], references: [funciones_sistema.id] }),
 rolesPermitidos: many(rol_permisos),
}));

export const rolesRelations = relations(roles_sistema, ({ many }) => ({
 permisos: many(rol_permisos),
 usuarios: many(usuarios),
}));

export const rolPermisosRelations = relations(rol_permisos, ({ one }) => ({
 rol: one(roles_sistema, { fields: [rol_permisos.rol_id], references: [roles_sistema.id] }),
 accion: one(acciones_sistema, { fields: [rol_permisos.accion_id], references: [acciones_sistema.id] }),
}));

export const usuariosRelations = relations(usuarios, ({ one }) => ({
 rol: one(roles_sistema, { fields: [usuarios.rol_id], references: [roles_sistema.id] }),
 organizacion: one(organizaciones, { fields: [usuarios.organizacion_id], references: [organizaciones.id] }),
}));

export const organizacionesRelations = relations(organizaciones, ({ one, many }) => ({
 plan: one(planes, { fields: [organizaciones.plan_id], references: [planes.id] }),
 usuarios: many(usuarios),
}));

