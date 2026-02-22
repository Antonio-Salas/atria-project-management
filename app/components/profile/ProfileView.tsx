"use client"

import { User, Mail, Building2 } from "lucide-react"

interface ProfileViewProps {
  name?: string
  email?: string
  organization?: string
}

export function ProfileView({
  name = "Antonio García",
  email = "antonio@atria.com",
  organization = "Atria",
}: ProfileViewProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700">
          <User className="h-5 w-5 text-zinc-300" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Perfil</h1>
          <p className="text-sm text-zinc-400">Tu información personal</p>
        </div>
      </div>

      <div className="max-w-md rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Nombre</p>
            <p className="text-sm font-medium text-white">{name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
            <Mail className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Correo electrónico</p>
            <p className="text-sm font-medium text-white">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
            <Building2 className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Organización</p>
            <p className="text-sm font-medium text-white">{organization}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
