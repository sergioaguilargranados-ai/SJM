"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Building, Link as LinkIcon, Phone, Monitor, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateOrganizacionAction } from "@/app/actions/configuracion";
import { sjmToast } from "@/components/ui/SjmToast";

const TABS = [
  { id: "general", label: "General", icon: Building },
  { id: "dominio", label: "Dominio y Acceso", icon: LinkIcon },
  { id: "contacto", label: "Contacto", icon: Phone },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

export default function ConfiguracionClient({ organizacion }: { organizacion: any }) {
  const [cargando, setCargando] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    nombre: organizacion.nombre || "",
    lema: organizacion.lema || "",
    logo_url: organizacion.logo_url || "",
    telefono_contacto: organizacion.telefono_contacto || "",
    whatsapp_contacto: organizacion.whatsapp_contacto || "",
    correo_contacto: organizacion.correo_contacto || "",
    direccion_completa: organizacion.direccion_completa || "",
    ubicacion_url: organizacion.ubicacion_url || "",
    horarios_atencion: organizacion.horarios_atencion || "",
    facebook_url: organizacion.facebook_url || "",
    instagram_url: organizacion.instagram_url || "",
    color_primario: organizacion.color_primario || "#00B4AA",
    color_secundario: organizacion.color_secundario || "#1E3A5F",
    color_terciario: organizacion.color_terciario || "#FFFFFF",
    dominio_tenant: organizacion.dominio_tenant || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    const res = await updateOrganizacionAction(organizacion.id, formData);
    
    setCargando(false);
    
    if (res.success) {
      sjmToast(
        "¡Actualización Exitosa!",
        "La configuración de la organización se ha guardado correctamente.",
        "success"
      );
    } else {
      sjmToast(
        "Error al Guardar",
        res.error || "Ocurrió un problema inesperado.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Configuración de Organización</h1>
        <p className="text-slate-500 dark:text-[#8e8ea0] mt-1 text-sm">Gestiona la identidad visual, contacto y dominios de {organizacion.nombre}.</p>
      </div>

      <div className="bg-white dark:bg-[#1a1b26] border border-slate-200 dark:border-[#2a2b3d] rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        <div className="flex border-b border-slate-200 dark:border-[#2a2b3d] overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "text-[#00B4AA] border-b-2 border-[#00B4AA] bg-slate-50 dark:bg-[#2a2b3d]/30"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 border-b-2 border-transparent"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1">
          
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label>Nombre de la Organización</Label>
                   <Input name="nombre" value={formData.nombre} onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                   <Label>Lema Institucional</Label>
                   <Input name="lema" value={formData.lema} onChange={handleChange} />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label>URL logo (PNG/JPG)</Label>
                   <Input name="logo_url" value={formData.logo_url} onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                    <Label>Color Primario</Label>
                    <div className="flex gap-2">
                      <Input name="color_primario" value={formData.color_primario} onChange={handleChange} className="font-mono" />
                      <div className="w-10 h-10 rounded-md border border-slate-200" style={{ backgroundColor: formData.color_primario }} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label>Color Secundario</Label>
                    <div className="flex gap-2">
                      <Input name="color_secundario" value={formData.color_secundario} onChange={handleChange} className="font-mono" />
                      <div className="w-10 h-10 rounded-md border border-slate-200" style={{ backgroundColor: formData.color_secundario }} />
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === "dominio" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-lg flex gap-3 text-sm">
                  <span className="text-[#00B4AA]">💡</span>
                  <p className="text-slate-600 dark:text-slate-400">La configuración de dominios permite que la plataforma identifique automáticamente tu marca en URLs personalizadas.</p>
               </div>
               <div className="space-y-2">
                 <Label>Dominio Base (Subdominio o Dominio principal)</Label>
                 <Input name="dominio_tenant" value={formData.dominio_tenant} onChange={handleChange} placeholder="ej: serjema.com" />
               </div>
            </div>
          )}

          {activeTab === "contacto" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label>Email</Label>
                   <Input name="correo_contacto" value={formData.correo_contacto} onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                   <Label>Teléfono</Label>
                   <Input name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                   <Label>WhatsApp (Link o Número)</Label>
                   <Input name="whatsapp_contacto" value={formData.whatsapp_contacto} onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                   <Label>Link Google Maps</Label>
                   <Input name="ubicacion_url" value={formData.ubicacion_url} onChange={handleChange} />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label>Dirección Física</Label>
                   <Input name="direccion_completa" value={formData.direccion_completa} onChange={handleChange} />
                 </div>
               </div>
            </div>
          )}

          {activeTab === "configuracion" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label>Facebook URL</Label>
                   <Input name="facebook_url" value={formData.facebook_url} onChange={handleChange} />
                 </div>
                 <div className="space-y-2">
                   <Label>Instagram URL</Label>
                   <Input name="instagram_url" value={formData.instagram_url} onChange={handleChange} />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label>Horarios</Label>
                   <Input name="horarios_atencion" value={formData.horarios_atencion} onChange={handleChange} />
                 </div>
               </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-[#2a2b3d] flex justify-end">
            <Button disabled={cargando} type="submit" className="bg-[#00B4AA] hover:bg-[#009a96] text-white px-8 h-12 rounded-xl font-bold transition-all shadow-md shadow-[#00B4AA]/20">
              {cargando ? "GUARDANDO..." : "ACTUALIZAR EMPRESA"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
