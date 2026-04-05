CREATE TABLE "cargos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(150) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "casas_retiro" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"domicilio" text,
	"codigo_postal" varchar(10),
	"estado_id" uuid,
	"latitud" numeric,
	"longitud" numeric,
	"encargado" varchar(255),
	"telefonos" varchar(255),
	"costo_persona" numeric,
	"capacidad" integer,
	"minimo_personas" integer,
	"estatus" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "clasificaciones_gasto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(150) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documentos_institucionales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"descripcion" text,
	"url_archivo" text NOT NULL,
	"nivel_acceso_rol" varchar(50),
	"fecha_subida" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipo_evento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evento_id" uuid NOT NULL,
	"servidor_id" uuid NOT NULL,
	"cargo_evento_id" uuid,
	"asignaciones" text,
	"aportacion_economica" numeric DEFAULT '0',
	"estatus" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "estados_republica" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(150) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluaciones_evento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evento_id" uuid NOT NULL,
	"solicitud_id" uuid,
	"cumplio_expectativas" boolean,
	"calificacion_instalaciones" integer,
	"calificacion_alimentos" integer,
	"calificacion_organizacion" integer,
	"te_confesaste" boolean,
	"tema_mas_gusto" varchar(255),
	"oracion_mas_gusto" varchar(255),
	"comentarios_sugerencias" text,
	"gustas_integrarte" boolean,
	"gustas_apoyar_economicamente" boolean,
	"oficio_profesion" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sede_id" uuid NOT NULL,
	"tipo_evento_id" uuid NOT NULL,
	"casa_retiro_id" uuid NOT NULL,
	"fecha_inicio" timestamp,
	"fecha_fin" timestamp,
	"costo_publico" numeric,
	"costo_casa_por_persona" numeric,
	"cupo_maximo" integer,
	"estatus" varchar(50) DEFAULT 'PLANEACION',
	"recomendaciones" text,
	"politica_cancelacion" text,
	"link_minuta_evaluacion" text
);
--> statement-breakpoint
CREATE TABLE "gastos_evento" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evento_id" uuid NOT NULL,
	"clasificacion_id" uuid NOT NULL,
	"monto" numeric NOT NULL,
	"descripcion" text,
	"url_comprobante" text,
	"fecha_gasto" date,
	"registrado_por" uuid
);
--> statement-breakpoint
CREATE TABLE "ministerios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" text
);
--> statement-breakpoint
CREATE TABLE "organizaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"dominio_tenant" varchar(255),
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roles_sistema" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sedes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "servidores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"sede_id" uuid NOT NULL,
	"ministerio_id" uuid,
	"cargo_id" uuid,
	"estado_civil" varchar(100),
	"fecha_nacimiento" date,
	"sexo" varchar(20),
	"domicilio_calle" text,
	"domicilio_colonia" varchar(255),
	"domicilio_cp" varchar(10),
	"estado_id" uuid,
	"telefono_emergencia" varchar(50),
	"contacto_emergencia" varchar(255),
	"fecha_ingreso" date,
	"fecha_baja" date,
	"nombre_gafete" varchar(150),
	"avance_servidor" varchar(255),
	"retiros_tomados" integer DEFAULT 0,
	"retiros_externos" integer DEFAULT 0,
	"observaciones" text,
	"estatus" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "solicitudes_inscripcion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evento_id" uuid NOT NULL,
	"usuario_id" uuid,
	"nombre_asistente" varchar(255) NOT NULL,
	"fecha_nacimiento" date,
	"edad" integer,
	"sexo" varchar(20),
	"estado_civil" varchar(100),
	"telefono_celular" varchar(50),
	"correo" varchar(255),
	"nombre_gafete" varchar(150),
	"es_primera_vez" boolean DEFAULT true,
	"parroquia_procedencia" varchar(255),
	"medicinas_requeridas" text,
	"dificultad_escaleras" boolean DEFAULT false,
	"usa_estacionamiento" boolean DEFAULT false,
	"comparte_cuarto_con" varchar(255),
	"esposo_a_nombre" varchar(255),
	"esposo_a_edad" integer,
	"esposo_a_fecha_nacimiento" date,
	"esposo_a_celular" varchar(50),
	"fecha_boda" date,
	"casados_por_iglesia" boolean DEFAULT false,
	"nombre_edades_hijos" text,
	"quien_invito" varchar(255),
	"expectativas" text,
	"otros_retiros_tomados" text,
	"observaciones" text,
	"estatus_solicitud" varchar(50) DEFAULT 'PENDIENTE_PAGO',
	"pago_deposito" numeric DEFAULT '0',
	"pago_efectivo" numeric DEFAULT '0',
	"monto_beca" numeric DEFAULT '0',
	"url_comprobante_pago" text,
	"creado_en" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tipos_eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"es_matrimonial" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"sede_id" uuid,
	"rol_id" uuid,
	"correo" varchar(255) NOT NULL,
	"celular" varchar(20),
	"contrasena_hash" text,
	"google_id" varchar(255),
	"nombre_completo" varchar(255) NOT NULL,
	"foto_perfil_url" text,
	"creado_en" timestamp DEFAULT now(),
	CONSTRAINT "usuarios_correo_unique" UNIQUE("correo"),
	CONSTRAINT "usuarios_celular_unique" UNIQUE("celular")
);
--> statement-breakpoint
ALTER TABLE "casas_retiro" ADD CONSTRAINT "casas_retiro_estado_id_estados_republica_id_fk" FOREIGN KEY ("estado_id") REFERENCES "public"."estados_republica"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_institucionales" ADD CONSTRAINT "documentos_institucionales_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipo_evento" ADD CONSTRAINT "equipo_evento_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipo_evento" ADD CONSTRAINT "equipo_evento_servidor_id_servidores_id_fk" FOREIGN KEY ("servidor_id") REFERENCES "public"."servidores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipo_evento" ADD CONSTRAINT "equipo_evento_cargo_evento_id_cargos_id_fk" FOREIGN KEY ("cargo_evento_id") REFERENCES "public"."cargos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluaciones_evento" ADD CONSTRAINT "evaluaciones_evento_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluaciones_evento" ADD CONSTRAINT "evaluaciones_evento_solicitud_id_solicitudes_inscripcion_id_fk" FOREIGN KEY ("solicitud_id") REFERENCES "public"."solicitudes_inscripcion"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_sede_id_sedes_id_fk" FOREIGN KEY ("sede_id") REFERENCES "public"."sedes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_tipo_evento_id_tipos_eventos_id_fk" FOREIGN KEY ("tipo_evento_id") REFERENCES "public"."tipos_eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_casa_retiro_id_casas_retiro_id_fk" FOREIGN KEY ("casa_retiro_id") REFERENCES "public"."casas_retiro"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gastos_evento" ADD CONSTRAINT "gastos_evento_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gastos_evento" ADD CONSTRAINT "gastos_evento_clasificacion_id_clasificaciones_gasto_id_fk" FOREIGN KEY ("clasificacion_id") REFERENCES "public"."clasificaciones_gasto"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gastos_evento" ADD CONSTRAINT "gastos_evento_registrado_por_usuarios_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ministerios" ADD CONSTRAINT "ministerios_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sedes" ADD CONSTRAINT "sedes_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_sede_id_sedes_id_fk" FOREIGN KEY ("sede_id") REFERENCES "public"."sedes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_ministerio_id_ministerios_id_fk" FOREIGN KEY ("ministerio_id") REFERENCES "public"."ministerios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_cargo_id_cargos_id_fk" FOREIGN KEY ("cargo_id") REFERENCES "public"."cargos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_estado_id_estados_republica_id_fk" FOREIGN KEY ("estado_id") REFERENCES "public"."estados_republica"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitudes_inscripcion" ADD CONSTRAINT "solicitudes_inscripcion_evento_id_eventos_id_fk" FOREIGN KEY ("evento_id") REFERENCES "public"."eventos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitudes_inscripcion" ADD CONSTRAINT "solicitudes_inscripcion_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tipos_eventos" ADD CONSTRAINT "tipos_eventos_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_sede_id_sedes_id_fk" FOREIGN KEY ("sede_id") REFERENCES "public"."sedes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_roles_sistema_id_fk" FOREIGN KEY ("rol_id") REFERENCES "public"."roles_sistema"("id") ON DELETE no action ON UPDATE no action;