"use client"

import { Project, Task } from "../../types"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface TaskEditModalProps {
  open: boolean
  onClose: () => void
  task: Task | null
  onUpdateTask: (updatedTask: Task) => void
  projects: Project[]
}

export function TaskEditModal({ open, onClose, task, onUpdateTask, projects }: TaskEditModalProps) {
  if (!open || !task) return null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const title = String(formData.get("title") ?? "").trim()
    const date = String(formData.get("date") ?? "")
    const priority = String(formData.get("priority") ?? "medium") as Task["priority"]
    const status = String(formData.get("status") ?? "todo") as Task["status"]
    const projectId = String(formData.get("projectId") ?? "")

    if (!title || !date) return

    onUpdateTask({
      ...task,
      title,
      date,
      priority,
      status,
      projectId: projectId || undefined
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-semibold mb-4">Editar tarea</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="edit-task-title">Título</label>
            <Input
              id="edit-task-title"
              name="title"
              defaultValue={task.title}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="edit-task-date">Fecha y hora</label>
            <Input
              id="edit-task-date"
              name="date"
              type="datetime-local"
              defaultValue={task.date}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="edit-task-priority">Prioridad</label>
              <select
                id="edit-task-priority"
                name="priority"
                defaultValue={task.priority}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <option value="urgent">Urgente</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="edit-task-status">Estado</label>
              <select
                id="edit-task-status"
                name="status"
                defaultValue={task.status}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <option value="todo">Por hacer</option>
                <option value="in-progress">En progreso</option>
                <option value="done">Completado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="edit-task-project">Proyecto relacionado</label>
            <select
              id="edit-task-project"
              name="projectId"
              defaultValue={task.projectId ?? ""}
              className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <option value="">Sin proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
