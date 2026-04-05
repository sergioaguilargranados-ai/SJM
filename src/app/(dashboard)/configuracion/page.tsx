"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Building, Link as LinkIcon, Phone, Monitor, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General", icon: Building },
  { id: "dominio", label: "Dominio y Acceso", icon: LinkIcon },
  { id: "contacto", label: "Contacto", icon: Phone },
  { id: "landing", label: "Tienda / Landing", icon: Monitor },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

export default function ConfiguracionOrganizacion() {
  const [cargando, setCargando] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    nombre: "Servidores de Jesús por María",
    lema: "Sirviendo con amor a la comunidad",
    logo_url: "https://ejemplo.com/logo.png",
    
    telefono_contacto: "+52 722 948 3163",
    whatsapp_contacto: "+527229483163",
    correo_contacto: "contacto@sjm.org",
    direccion_completa: "Vía José López Portillo 541, Toluca, Edo. Méx.",
    ubicacion_url: "https://maps.google.com/?q=19.4795,-99.6480",
    horarios_atencion: "Lun-Vie 9:00-18:00, Sáb 9:00-14:00",
    facebook_url: "https://facebook.com/sjm",
    instagram_url: "https://instagram.com/sjm",
    
    dominio_personalizado: "https://jucateconecta.com",
    subdominio: "juca-norte",
    url_login: "https://jucateconecta.com/login",
    
    color_primario: "#e11d48", // ERPCubox Red
    color_secundario: "#1e3a8a",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      alert("Configuración de Organización Actualizada Satisfactoriamente");
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* ERPCubox Theme Modal Header Equivalent */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Editar Empresa</h1>
        <p className="text-[#8e8ea0] mt-1 text-sm">Configure los detalles de la empresa, incluyendo su plan, subdominio y portal público.</p>
      </div>

      <div className="bg-[#1a1b26] border border-[#2a2b3d] rounded-xl shadow-xl overflow-hidden flex flex-col">
        
        {/* TABS NAVIGATION */}
        <div className="flex border-b border-[#2a2b3d] overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all",
                  isActive
                    ? "text-[#e11d48] border-b-2 border-[#e11d48] bg-[#2a2b3d]/30"
                    : "text-[#8e8ea0] hover:text-slate-300 hover:bg-[#2a2b3d]/10 border-b-2 border-transparent"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Nombre Oficial de la Empresa</Label>
                   <Input name="nombre" value={formData.nombre} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] text-white" />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Lema</Label>
                   <Input name="lema" value={formData.lema} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] text-white" />
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-[#c1c1d1]">URL del Logotipo</Label>
                   <Input name="logo_url" value={formData.logo_url} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] text-white" />
                 </div>
               </div>
            </div>
          )}

          {/* TAB: DOMINIO Y ACCESO */}
          {activeTab === "dominio" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="bg-[#121b2d] border border-[#1e293b] p-4 rounded-lg flex gap-3 text-sm">
                  <span className="text-blue-400">💡</span>
                  <div>
                     <p className="font-semibold text-blue-300">Configuración de dominio</p>
                     <p className="text-blue-200/70 mt-1">El <strong className="text-white">Dominio Personalizado</strong> tiene prioridad sobre el Subdominio. Úsalo si la landing tiene su propio dominio (ej: portal.sjm.org).</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Dominio Personalizado (Prioridad Alta)</Label>
                   <Input name="dominio_personalizado" value={formData.dominio_personalizado} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] text-white" />
                   <p className="text-xs text-[#8e8ea0]">URL exacta donde se aloja el portal público</p>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Subdominio (Legacy)</Label>
                   <div className="flex">
                     <Input name="subdominio" value={formData.subdominio} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] border-r-0 rounded-r-none text-white focus-visible:z-10" />
                     <div className="bg-[#2a2b3d] border border-[#3b3c54] border-l-0 rounded-r-md px-3 flex items-center text-sm text-[#8e8ea0]">.sjm.org</div>
                   </div>
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-[#c1c1d1]">URL del Login</Label>
                   <div className="relative">
                      <Input name="url_login" value={formData.url_login} onChange={handleChange} className="pl-9 bg-[#0f1015] border-[#2a2b3d] text-white" />
                      <span className="absolute left-3 top-2.5">🔒</span>
                   </div>
                   <p className="text-xs text-[#8e8ea0]">Redirección para "Iniciar Sesión"</p>
                 </div>
               </div>
            </div>
          )}

          {/* TAB: CONTACTO */}
          {activeTab === "contacto" && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Email de Contacto</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400">✉️</span>
                     <Input name="correo_contacto" value={formData.correo_contacto} onChange={handleChange} className="pl-9 bg-[#0f1015] border-[#2a2b3d] text-white" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Teléfono</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400">📞</span>
                     <Input name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} className="pl-9 bg-[#0f1015] border-[#2a2b3d] text-white" />
                   </div>
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-[#c1c1d1]">Dirección Fiscal Completa</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400">📍</span>
                     <Input name="direccion_completa" value={formData.direccion_completa} onChange={handleChange} className="pl-9 bg-[#0f1015] border-[#2a2b3d] text-white" />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">WhatsApp</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400 text-sm">WH</span>
                     <Input name="whatsapp_contacto" value={formData.whatsapp_contacto} onChange={handleChange} className="pl-10 bg-[#0f1015] border-[#2a2b3d] text-white" />
                   </div>
                   <p className="text-xs text-[#8e8ea0]">Formato internacional (+52...)</p>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[#c1c1d1]">Link Google Maps</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400 text-sm">GM</span>
                     <Input name="ubicacion_url" value={formData.ubicacion_url} onChange={handleChange} className="pl-10 bg-[#0f1015] border-[#2a2b3d] text-white" />
                   </div>
                   <p className="text-xs text-[#8e8ea0]">URL completa de tu ubicación</p>
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <Label className="text-[#c1c1d1]">Horarios de Atención</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-slate-400">🕒</span>
                     <Input name="horarios_atencion" value={formData.horarios_atencion} onChange={handleChange} className="pl-9 bg-[#0f1015] border-[#2a2b3d] text-white" />
                   </div>
                 </div>
               </div>

               <div className="pt-4 border-t border-[#2a2b3d]">
                  <h3 className="text-[#e2e2e9] font-medium text-sm mb-4">Redes Sociales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#c1c1d1] flex items-center gap-2 text-xs"><span className="text-blue-500 font-bold">f</span> Facebook</Label>
                      <Input name="facebook_url" value={formData.facebook_url} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] text-white text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#c1c1d1] flex items-center gap-2 text-xs"><span className="text-pink-500 font-bold">IG</span> Instagram</Label>
                      <Input name="instagram_url" value={formData.instagram_url} onChange={handleChange} className="bg-[#0f1015] border-[#2a2b3d] text-white text-sm" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: TIENDA / CONFIG */}
          {(activeTab === "landing" || activeTab === "configuracion") && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="bg-[#2a2b3d]/30 border border-[#2a2b3d] p-4 text-center rounded-lg">
                  <p className="text-slate-400 text-sm">Opciones en construcción. Puedes regresar a General o Contacto.</p>
               </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-10 pt-6 border-t border-[#2a2b3d] flex justify-end">
            <Button disabled={cargando} type="submit" className="bg-[#e11d48] hover:bg-[#be123c] text-white px-8 h-10 rounded-md font-medium text-sm transition-colors">
              {cargando ? "Actualizando..." : "Actualizar Empresa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
