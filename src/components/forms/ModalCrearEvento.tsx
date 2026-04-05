"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import NuevoEventoForm from "./NuevoEventoForm"

interface ModalCrearEventoProps {
  sedes: any[]
  casas: any[]
  tipos: any[]
}

export function ModalCrearEvento({ sedes, casas, tipos }: ModalCrearEventoProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#e11d48] dark:hover:bg-[#be123c] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-100 dark:shadow-none"
      >
        <Plus className="w-4 h-4" />
        Programar Retiro
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-[#1a1b26] dark:border-[#2a2b3d] p-0"
          onPointerDownOutside={(e) => e.preventDefault()} // REGLA DE ORO
        >
          <DialogHeader className="p-6 border-b border-slate-100 dark:border-[#3b3c54]">
            <DialogTitle className="text-xl font-bold dark:text-white text-left">Programar Nuevo Retiro / Evento</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-0">
            <NuevoEventoForm 
              sedes={sedes} 
              casas={casas} 
              tipos={tipos}
              onSuccess={() => setOpen(false)} 
              isModal={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
