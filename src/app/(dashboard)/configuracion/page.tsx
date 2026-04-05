"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Settings2, Image as ImageIcon, MapPin, Phone, Mail, Palette } from "lucide-react";

export default function ConfiguracionOrganizacion() {
  const [cargando, setCargando] = useState(false);

  // Valores mock simulados que llegarán de la base de datos
  const [formData, setFormData] = useState({
    nombre: "Servidores de Jesús por María",
    lema: "Sirviendo con amor a la comunidad",
    logo_url: "https://ejemplo.com/logo.png",
    telefono_contacto: "+52 555 123 4567",
    correo_contacto: "contacto@sjm.org",
    ubicacion_url: "https://maps.google.com/...",
    color_primario: "#2563eb",
    color_secundario: "#1e3a8a",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    // Simulación de guardado
    setTimeout(() => {
      setCargando(false);
      alert("Configuración de Organización Actualizada (Simulación)");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Configuración de Organización</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Parametriza los datos públicos, la identidad gráfica y el esquema de colores de la intranet y portal web.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identidad Gráfica */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"><ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Identidad Gráfica</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-200">Nombre Oficial de la Organización</Label>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-slate-200">Lema del Movimiento</Label>
              <Input name="lema" value={formData.lema} onChange={handleChange} className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="dark:text-slate-200">URL del Logotipo</Label>
              <Input name="logo_url" value={formData.logo_url} onChange={handleChange} placeholder="https://..." className="dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Parametrización de Colores */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg"><Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Esquema de Colores</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Estos colores se aplicarán automáticamente a los botones y elementos principales de la aplicación para esta Organización.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="dark:text-slate-200">Color Primario (Botones y Destaques)</Label>
              <div className="flex items-center gap-3">
                <input type="color" name="color_primario" value={formData.color_primario} onChange={handleChange} className="h-10 w-16 cursor-pointer rounded bg-transparent border-0" />
                <Input name="color_primario" value={formData.color_primario} onChange={handleChange} className="w-32 dark:bg-slate-950 dark:border-slate-800 dark:text-white uppercase font-mono" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="dark:text-slate-200">Color Secundario (Cenefas y Fondos)</Label>
              <div className="flex items-center gap-3">
                <input type="color" name="color_secundario" value={formData.color_secundario} onChange={handleChange} className="h-10 w-16 cursor-pointer rounded bg-transparent border-0" />
                <Input name="color_secundario" value={formData.color_secundario} onChange={handleChange} className="w-32 dark:bg-slate-950 dark:border-slate-800 dark:text-white uppercase font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* Contacto Público */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg"><Phone className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Contacto y Redes (Para QRs públicos)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="dark:text-slate-200">Teléfono Oficial (WhatsApp)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} className="pl-10 dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="dark:text-slate-200">Correo Electrónico (Información)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input name="correo_contacto" value={formData.correo_contacto} onChange={handleChange} className="pl-10 dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="dark:text-slate-200">URL Ubicación en Google Maps</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input name="ubicacion_url" value={formData.ubicacion_url} onChange={handleChange} className="pl-10 dark:bg-slate-950 dark:border-slate-800 dark:text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button disabled={cargando} type="submit" size="lg" className="w-full md:w-auto rounded-xl px-10 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none">
            {cargando ? "Guardando Valores..." : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Guardar Configuración
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
