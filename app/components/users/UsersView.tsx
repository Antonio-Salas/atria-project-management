"use client"

import { Users } from "lucide-react"

export function UsersView() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700">
          <Users className="h-5 w-5 text-zinc-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Usuarios</h1>
          <p className="text-sm text-zinc-400">Gestiona los usuarios que has invitado</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 gap-3">
        <p className="text-sm text-zinc-500">Usuarios</p>
      </div>
    </div>
  )
}
