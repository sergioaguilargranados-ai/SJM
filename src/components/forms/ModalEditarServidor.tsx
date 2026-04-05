"use client"

import * as React from "react"
import { Settings2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import EditarServidorForm from "./EditarServidorForm"
import { getServidorById, getMinisterios, getCargos } from "@/app/actions/consultas"

interface ModalEditarServidorProps {
  servidorId: string
}

export function ModalEditarServidor({ servidorId }: ModalEditarServidorProps) {
  const [open, setOpen] = React.useState(false)
  const [cargando, setCargando] = React.useState(false)
  const [datos, setDatos] = React.useState<any>(null)

  async function handleOpen() {
    setOpen(true)
    setCargando(true)
    
    // Cargamos datos del servidor y catálogos
    const [servRes, minRes, carRes] = await Promise.all([
      getServidorById(servidorId),
      getMinisterios(),
      getCargos()
    ])
    
    setDatos({
      servidor: servRes.data,
      ministerios: minRes.data || [],
      cargos: carRes.data || []
    })
    setCargando(false)
  }

  return (
    <>
      <button 
        onClick={handleOpen}
        className="text-blue-600 hover:text-blue-800 dark:text-[#8e8ea0] dark:hover:text-[#e11d48] text-sm font-medium transition-colors flex items-center gap-1.5"
      >
        <Settings2 className="w-4 h-4" />
        Administrar
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-[#1a1b26] dark:border-[#2a2b3d] p-0"
          onPointerDownOutside={(e) => e.preventDefault()} // REGLA DE ORO
        >
          <DialogHeader className="p-6 border-b border-slate-100 dark:border-[#3b3c54]">
            <DialogTitle className="text-xl font-bold dark:text-white">Gestión de Servidor</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-0">
            {cargando || !datos ? (
               <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Cargando expediente...</p>
               </div>
            ) : (
               <EditarServidorForm 
                 servidor={datos.servidor} 
                 ministerios={datos.ministerios}
                 cargos={datos.cargos}
                 onSuccess={() => setOpen(false)} 
               />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
