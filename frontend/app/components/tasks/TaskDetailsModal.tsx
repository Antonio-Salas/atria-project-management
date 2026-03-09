"use client"

import { Task } from "../../types"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Pencil, Trash2, X } from "lucide-react"

interface TaskDetailsModalProps {
  open: boolean
  onClose: () => void
  task: Task | null
  projectName?: string
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

const priorityLabel: Record<Task["priority"], string> = {
  urgent: "Urgente",
  medium: "Media",
  low: "Baja"
}

const statusLabel: Record<Task["status"], string> = {
  todo: "Por hacer",
  "in-progress": "En progreso",
  done: "Completado"
}

const priorityClass: Record<Task["priority"], string> = {
  urgent: "bg-red-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-blue-500 text-white"
}

export function TaskDetailsModal({ open, onClose, task, projectName, onEdit, onDelete }: TaskDetailsModalProps) {
  if (!open || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200"
          type="button"
          title="Cerrar"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-center justify-between pr-8">
          <h3 className="text-lg font-semibold">Detalle de tarea</h3>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onEdit(task)}
                  title="Editar tarea"
                  aria-label="Editar tarea"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-400 hover:text-red-300"
                  onClick={() => onDelete(task.id)}
                  title="Eliminar tarea"
                  aria-label="Eliminar tarea"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-zinc-400 mb-1">Título</p>
            <p className="text-white font-medium">{task.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-400 mb-1">Fecha y hora</p>
              <p>{new Date(task.date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-zinc-400 mb-1">Estado</p>
              <p>{statusLabel[task.status]}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-400 mb-1">Prioridad</p>
              <Badge variant="secondary" className={`${priorityClass[task.priority]} text-[11px] px-2 py-0.5`}>
                {priorityLabel[task.priority]}
              </Badge>
            </div>
            <div>
              <p className="text-zinc-400 mb-1">Proyecto</p>
              <p>{projectName || "Sin proyecto"}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <Button type="button" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  )
}
