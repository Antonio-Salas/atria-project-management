"use client"

import { useState } from "react"
import { X, UserPlus, Check } from "lucide-react"
import { Project } from "../../types"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface InviteUserModalProps {
  open: boolean
  projects: Project[]
  onClose: () => void
  onInvite: (name: string, email: string, projectIds: string[]) => void
}

export function InviteUserModal({ open, projects, onClose, onInvite }: InviteUserModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [error, setError] = useState("")

  if (!open) return null

  const toggleProject = (id: string) => {
    const next = new Set(selectedProjects)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedProjects(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError("El nombre es requerido."); return }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo válido.")
      return
    }
    setError("")
    onInvite(name.trim(), email.trim(), Array.from(selectedProjects))
    setName("")
    setEmail("")
    setSelectedProjects(new Set())
    onClose()
  }

  const handleClose = () => {
    setName("")
    setEmail("")
    setSelectedProjects(new Set())
    setError("")
    onClose()
  }

  const statusLabel: Record<string, string> = {
    "in-progress": "En curso",
    completed: "Completado",
    pending: "Pendiente",
  }

  const statusColor: Record<string, string> = {
    "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700">
              <UserPlus className="h-4 w-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Invitar colaborador</h3>
              <p className="text-xs text-zinc-500">Envía una invitación por correo electrónico</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto flex-1">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="invite-name">Nombre</label>
              <Input
                id="invite-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María García"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="invite-email">Correo electrónico</label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                Proyectos asignados
                <span className="ml-2 text-xs text-zinc-500">(opcional — {selectedProjects.size} seleccionados)</span>
              </label>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden divide-y divide-zinc-800">
                {projects.map((project) => {
                  const selected = selectedProjects.has(project.id)
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => toggleProject(project.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-800/60 ${selected ? "bg-zinc-800/40" : ""}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${selected ? "bg-white border-white" : "border-zinc-600"}`}>
                          {selected && <Check className="h-3 w-3 text-zinc-900" strokeWidth={3} />}
                        </div>
                        <span className="text-sm text-zinc-200 truncate font-medium">{project.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ml-3 ${statusColor[project.status]}`}>
                        {statusLabel[project.status]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 shrink-0">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <UserPlus className="h-4 w-4 mr-2" />
              Enviar invitación
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
