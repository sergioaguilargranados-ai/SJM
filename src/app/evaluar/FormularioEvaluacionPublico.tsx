"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sjmToast } from "@/components/ui/SjmToast";
import { validarYCrearEvaluacionAction } from "@/app/actions/inscripciones";

export default function FormularioEvaluacionPublico({ eventos }: { eventos: any[] }) {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [identificacion, setIdentificacion] = useState({ evento_id: "", identificador: "" });
  const [evaluacion, setEvaluacion] = useState({
    cumplio_expectativas: "si",
    calificacion_instalaciones: "10",
    calificacion_alimentos: "10",
    calificacion_organizacion: "10",
    te_confesaste: "si",
    tema_mas_gusto: "",
    oracion_mas_gusto: "",
    comentarios_sugerencias: "",
    gustas_integrarte: "si",
    gustas_apoyar_economicamente: "no",
    oficio_profesion: "",
  });

  const handleVerificar = () => {
    if (!identificacion.evento_id || !identificacion.identificador) {
      sjmToast("Error", "Seleccione el evento y escriba su correo o celular", "error");
      return;
    }
    setPaso(2);
  };

  const handleSubmit = async () => {
    if (!evaluacion.tema_mas_gusto || !evaluacion.oracion_mas_gusto) {
      sjmToast("Error", "Por favor complete los campos requeridos", "error");
      return;
    }
    setCargando(true);
    const res = await validarYCrearEvaluacionAction({ ...identificacion, evaluacion });
    setCargando(false);
    
    if (res.success) {
      sjmToast("¡Gracias!", "Tu evaluación se ha guardado correctamente.", "success");
      setPaso(3);
    } else {
      sjmToast("Error", res.error || "No se pudo guardar la evaluación", "error");
    }
  };

  if (paso === 3) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">¡Muchas Gracias!</h2>
        <p className="text-slate-600">Hemos recibido tus respuestas. Dios te bendiga.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Enviar otra evaluación</Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-6">
        Evaluación Post-Evento
      </h2>
      
      {paso === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4 text-center">Para comenzar, identifícate con los datos de tu inscripción.</p>
          <div className="space-y-2">
            <Label>Evento o Retiro al que asististe</Label>
            <Select value={identificacion.evento_id} onValueChange={v => setIdentificacion(p => ({ ...p, evento_id: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre_evento || e.tipo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tu Correo Electrónico o Celular (WhatsApp)</Label>
            <Input 
              placeholder="Ej. tu@email.com o 5512345678" 
              value={identificacion.identificador}
              onChange={e => setIdentificacion(p => ({ ...p, identificador: e.target.value }))}
            />
          </div>
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleVerificar}>
            Comenzar Evaluación
          </Button>
        </div>
      )}

      {paso === 2 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>¿El retiro cumplió tus expectativas?</Label>
            <Select value={evaluacion.cumplio_expectativas} onValueChange={v => setEvaluacion(p => ({ ...p, cumplio_expectativas: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="si">Sí, totalmente</SelectItem><SelectItem value="no">No del todo</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Instalaciones (1-10)</Label>
              <Input type="number" min="1" max="10" value={evaluacion.calificacion_instalaciones} onChange={e => setEvaluacion(p => ({ ...p, calificacion_instalaciones: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Alimentos (1-10)</Label>
              <Input type="number" min="1" max="10" value={evaluacion.calificacion_alimentos} onChange={e => setEvaluacion(p => ({ ...p, calificacion_alimentos: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Organización (1-10)</Label>
              <Input type="number" min="1" max="10" value={evaluacion.calificacion_organizacion} onChange={e => setEvaluacion(p => ({ ...p, calificacion_organizacion: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>¿Te confesaste durante el retiro?</Label>
            <Select value={evaluacion.te_confesaste} onValueChange={v => setEvaluacion(p => ({ ...p, te_confesaste: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="si">Sí</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tema que más te gustó *</Label>
            <Input value={evaluacion.tema_mas_gusto} onChange={e => setEvaluacion(p => ({ ...p, tema_mas_gusto: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Oración que más te gustó *</Label>
            <Input value={evaluacion.oracion_mas_gusto} onChange={e => setEvaluacion(p => ({ ...p, oracion_mas_gusto: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Comentarios o sugerencias</Label>
            <Textarea value={evaluacion.comentarios_sugerencias} onChange={e => setEvaluacion(p => ({ ...p, comentarios_sugerencias: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>¿Te gustaría integrarte como servidor?</Label>
            <Select value={evaluacion.gustas_integrarte} onValueChange={v => setEvaluacion(p => ({ ...p, gustas_integrarte: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="si">Sí me gustaría</SelectItem><SelectItem value="no">Por ahora no</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>¿Estarías dispuesto a apoyar económicamente a la comunidad?</Label>
            <Select value={evaluacion.gustas_apoyar_economicamente} onValueChange={v => setEvaluacion(p => ({ ...p, gustas_apoyar_economicamente: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="si">Sí</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>¿Cuál es tu oficio o profesión?</Label>
            <Input value={evaluacion.oficio_profesion} onChange={e => setEvaluacion(p => ({ ...p, oficio_profesion: e.target.value }))} />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setPaso(1)}>Regresar</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit} disabled={cargando}>
              {cargando ? "Enviando..." : "Enviar Evaluación"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
