"use client"

import { useEffect, useRef, useState } from "react"
import { Project, Task } from "../../types"
import { CalendarClock, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface TaskCreateModalProps {
  open: boolean
  onClose: () => void
  onCreateTask: (taskData: Omit<Task, "id">) => void
  projects: Project[]
  defaultStatus: Task["status"]
}

export function TaskCreateModal({ open, onClose, onCreateTask, projects, defaultStatus }: TaskCreateModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [status, setStatus] = useState<Task["status"]>(defaultStatus)
  const [projectId, setProjectId] = useState("")
  const dateInputRef = useRef<HTMLInputElement>(null)

  const formattedDate = date
    ? new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
    : ""

  const openDateTimePicker = () => {
    const input = dateInputRef.current
    if (!input) return

    const pickerInput = input as HTMLInputElement & { showPicker?: () => void }

    try {
      if (typeof pickerInput.showPicker === "function") {
        pickerInput.showPicker()
      } else {
        pickerInput.focus()
      }
    } catch {
      pickerInput.focus()
    }
  }

  useEffect(() => {
    if (!open) return
    setTitle("")
    setDate("")
    setPriority("medium")
    setStatus(defaultStatus)
    setProjectId("")
  }, [open, defaultStatus])

  if (!open) return null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!title.trim() || !date) return

    onCreateTask({
      title: title.trim(),
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

        <h3 className="text-lg font-semibold mb-4">Crear tarea</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="task-title">Título</label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ej. REVISIÓN GENERAL"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="task-date">Fecha y hora</label>
            <div className="flex items-center gap-2">
              <input
                ref={dateInputRef}
                id="task-date"
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={openDateTimePicker}
                className="rounded-md p-2 text-zinc-400 hover:text-zinc-200"
                aria-label="Seleccionar fecha y hora"
              >
                <CalendarClock className="h-4 w-4" />
              </button>
              {date ? <span className="text-sm text-zinc-300">{formattedDate}</span> : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="task-priority">Prioridad</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Task["priority"])}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <option value="urgent">Urgente</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="task-status">Estado</label>
              <select
                id="task-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as Task["status"])}
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                <option value="todo">Por hacer</option>
                <option value="in-progress">En progreso</option>
                <option value="done">Completado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="task-project">Proyecto relacionado</label>
            <select
              id="task-project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
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
            <Button type="submit">Guardar tarea</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
