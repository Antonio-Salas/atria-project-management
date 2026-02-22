"use client"

import { useState } from "react"
import { X, FolderKanban, Trash2, Plus, Check, Mail, User } from "lucide-react"
import { CollaboratorUser, Project } from "../../types"
import { Button } from "../ui/button"

interface UserDetailModalProps {
  open: boolean
  user: CollaboratorUser | null
  projects: Project[]
  onClose: () => void
  onRemoveFromProject: (userId: string, projectId: string) => void
  onAssignProjects: (userId: string, projectIds: string[]) => void
}

const STATUS_LABEL: Record<string, string> = {
  "in-progress": "En curso",
  completed: "Completado",
  pending: "Pendiente",
}

const STATUS_COLOR: Record<string, string> = {
  "in-progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

const STATUS_DOT: Record<string, string> = {
  "in-progress": "bg-blue-400",
  completed: "bg-emerald-400",
  pending: "bg-amber-400",
}

export function UserDetailModal({
  open,
  user,
  projects,
  onClose,
  onRemoveFromProject,
  onAssignProjects,
}: UserDetailModalProps) {
  const [assigning, setAssigning] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  if (!open || !user) return null

  const assignedProjects = projects.filter((p) => user.projectIds.includes(p.id))
  const unassignedProjects = projects.filter((p) => !user.projectIds.includes(p.id))

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const handleConfirmAssign = () => {
    if (selected.size === 0) return
    onAssignProjects(user.id, Array.from(selected))
    setSelected(new Set())
    setAssigning(false)
  }

  const handleCancelAssign = () => {
    setSelected(new Set())
    setAssigning(false)
  }

  const handleClose = () => {
    setSelected(new Set())
    setAssigning(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 shrink-0">
              <User className="h-5 w-5 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{user.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3 text-zinc-500" />
                <span className="text-xs text-zinc-400">{user.email}</span>
              </div>
            </div>
          </div>
          <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-200 transition-colors mt-0.5">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">

            {/* Assigned projects section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-200">Proyectos asignados</span>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">{assignedProjects.length}</span>
                </div>
                {!assigning && unassignedProjects.length > 0 && (
                  <button
                    onClick={() => setAssigning(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors border border-zinc-700 hover:border-zinc-500 px-2.5 py-1 rounded-md"
                  >
                    <Plus className="h-3 w-3" />
                    Asignar proyecto
                  </button>
                )}
              </div>

              {assignedProjects.length === 0 ? (
                <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/30">
                  <p className="text-xs text-zinc-500">Sin proyectos asignados</p>
                </div>
              ) : (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden divide-y divide-zinc-800">
                  {assignedProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between px-4 py-2.5 group hover:bg-zinc-800/30 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[project.status]}`} />
                        <span className="text-sm text-zinc-200 truncate">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLOR[project.status]}`}>
                          {STATUS_LABEL[project.status]}
                        </span>
                        <button
                          onClick={() => onRemoveFromProject(user.id, project.id)}
                          title="Eliminar del proyecto"
                          className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assign projects panel */}
            {assigning && (
              <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-200">Selecciona proyectos</span>
                  {selected.size > 0 && (
                    <span className="text-xs text-zinc-400 ml-auto">{selected.size} seleccionado{selected.size !== 1 ? "s" : ""}</span>
                  )}
                </div>
                <div className="divide-y divide-zinc-800 max-h-52 overflow-y-auto">
                  {unassignedProjects.map((project) => {
                    const isSelected = selected.has(project.id)
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => toggleSelect(project.id)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-zinc-800/60 ${isSelected ? "bg-zinc-800/40" : ""}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-white border-white" : "border-zinc-600"}`}>
                            {isSelected && <Check className="h-3 w-3 text-zinc-900" strokeWidth={3} />}
                          </div>
                          <span className="text-sm text-zinc-200 truncate">{project.name}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ml-3 ${STATUS_COLOR[project.status]}`}>
                          {STATUS_LABEL[project.status]}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-900/30">
                  <button
                    type="button"
                    onClick={handleCancelAssign}
                    className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded border border-zinc-700 hover:border-zinc-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAssign}
                    disabled={selected.size === 0}
                    className="text-xs text-white px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                  >
                    <Check className="h-3 w-3" />
                    Asignar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-zinc-800 shrink-0">
          <Button variant="ghost" onClick={handleClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  )
}
