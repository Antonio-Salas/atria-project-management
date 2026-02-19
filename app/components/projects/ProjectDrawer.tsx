"use client"

import { useEffect, useState } from "react"
import { Sheet } from "../ui/sheet"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Project } from "../../types"

interface ProjectDrawerProps {
  project: Project | null
  mode: "create" | "edit"
  open: boolean
  onClose: () => void
  onSave: (projectData: Project | Omit<Project, "id">) => void
  onDelete: (projectId: string) => void
}

const emptyProject: Omit<Project, "id"> = {
  name: "",
  status: "pending",
  startDate: "",
  endDate: "",
  client: "",
  description: ""
}

export function ProjectDrawer({ project, mode, open, onClose, onSave, onDelete }: ProjectDrawerProps) {
  const [formData, setFormData] = useState<Project | Omit<Project, "id"> | null>(null)

  useEffect(() => {
    if (!open) {
      setFormData(null)
      return
    }

    if (mode === "edit" && project) {
      setFormData({ ...project })
      return
    }

    setFormData({ ...emptyProject })
  }, [mode, open, project])

  if (!formData) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      onSave(formData)
      onClose()
    }
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <div className="h-full flex flex-col">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold">{mode === "create" ? "Nuevo Proyecto" : "Editar Proyecto"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto pr-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre del Proyecto
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del proyecto"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="client" className="text-sm font-medium">
              Cliente
            </label>
            <Input
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Cliente"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Fecha Inicio
              </label>
              <div className="relative">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                Fecha Fin
              </label>
              <div className="relative">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Estatus
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950"
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
              placeholder="Descripción del proyecto..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
            {mode === "edit" && project && (
              <Button
                type="button"
                variant="destructive"
                className="mr-auto"
                onClick={() => onDelete(project.id)}
              >
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" ? "Crear Proyecto" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </Sheet>
  )
}
