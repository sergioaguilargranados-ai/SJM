ALTER TABLE "organizaciones" ADD COLUMN "lema" varchar(255);--> statement-breakpoint
ALTER TABLE "organizaciones" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "organizaciones" ADD COLUMN "telefono_contacto" varchar(50);--> statement-breakpoint
ALTER TABLE "organizaciones" ADD COLUMN "correo_contacto" varchar(255);--> statement-breakpoint
ALTER TABLE "organizaciones" ADD COLUMN "ubicacion_url" text;--> statement-breakpoint
ALTER TABLE "solicitudes_inscripcion" ADD COLUMN "pais_ciudad" varchar(255);--> statement-breakpoint
ALTER TABLE "solicitudes_inscripcion" ADD COLUMN "ministerio_actual" varchar(255);--> statement-breakpoint
ALTER TABLE "solicitudes_inscripcion" ADD COLUMN "compromiso_pago_99usd" boolean DEFAULT false;