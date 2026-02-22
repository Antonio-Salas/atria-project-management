"use client"

import { useState } from "react"
import { Users, UserPlus, Mail, FolderKanban } from "lucide-react"
import { CollaboratorUser } from "../../types"
import { collaboratorUsers, projects } from "../../data/mock"
import { Button } from "../ui/button"
import { InviteUserModal } from "./InviteUserModal"
import { UserDetailModal } from "./UserDetailModal"

export function UsersView() {
  const [users, setUsers] = useState<CollaboratorUser[]>(collaboratorUsers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<CollaboratorUser | null>(null)

  const handleInvite = (name: string, email: string, projectIds: string[]) => {
    const newUser: CollaboratorUser = {
      id: `u${Date.now()}`,
      name,
      email,
      projectIds,
      invitedAt: new Date().toISOString(),
    }
    setUsers((prev) => [...prev, newUser])
  }

  const handleRemoveFromProject = (userId: string, projectId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, projectIds: u.projectIds.filter((id) => id !== projectId) } : u
      )
    )
    setSelectedUser((prev) =>
      prev && prev.id === userId
        ? { ...prev, projectIds: prev.projectIds.filter((id) => id !== projectId) }
        : prev
    )
  }

  const handleAssignProjects = (userId: string, projectIds: string[]) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, projectIds: [...new Set([...u.projectIds, ...projectIds])] }
          : u
      )
    )
    setSelectedUser((prev) =>
      prev && prev.id === userId
        ? { ...prev, projectIds: [...new Set([...prev.projectIds, ...projectIds])] }
        : prev
    )
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700">
            <Users className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Usuarios</h1>
            <p className="text-sm text-zinc-400">Gestiona los usuarios que has invitado a colaborar</p>
          </div>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invitar usuario
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total de usuarios", value: users.length },
          { label: "Con proyectos asignados", value: users.filter((u) => u.projectIds.length > 0).length },
          { label: "Sin proyectos", value: users.filter((u) => u.projectIds.length === 0).length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 gap-3">
          <Users className="h-8 w-8 text-zinc-600" />
          <p className="text-sm text-zinc-500">Aún no has invitado ningún usuario</p>
          <Button variant="ghost" size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invitar usuario
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    Usuario
                  </div>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    Correo
                  </div>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-3.5 w-3.5" />
                    Proyectos
                  </div>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Invitado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                >
                  {/* Usuario */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-zinc-200">
                          {user.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <span className="font-medium text-zinc-100 group-hover:text-white transition-colors">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Correo */}
                  <td className="px-5 py-3.5 text-zinc-400">{user.email}</td>

                  {/* Proyectos */}
                  <td className="px-5 py-3.5">
                    {user.projectIds.length === 0 ? (
                      <span className="text-xs text-zinc-600 italic">Sin proyectos</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full">
                        {user.projectIds.length}
                        <FolderKanban className="h-3 w-3 text-zinc-400" />
                      </span>
                    )}
                  </td>

                  {/* Fecha invitación */}
                  <td className="px-5 py-3.5 text-zinc-500 text-xs">{formatDate(user.invitedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <InviteUserModal
        open={inviteOpen}
        projects={projects}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />

      <UserDetailModal
        open={!!selectedUser}
        user={selectedUser}
        projects={projects}
        onClose={() => setSelectedUser(null)}
        onRemoveFromProject={handleRemoveFromProject}
        onAssignProjects={handleAssignProjects}
      />
    </div>
  )
}
