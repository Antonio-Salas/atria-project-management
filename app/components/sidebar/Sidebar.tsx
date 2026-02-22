"use client"

import { LayoutDashboard, Users, User, LogOut } from "lucide-react"
import { Tooltip } from "../ui/tooltip"
import { cn } from "../ui/card"

type ViewType = "projects" | "kanban" | "calendar" | "documentos" | "project-detail" | "users" | "profile"

interface SidebarProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onSignOut: () => void
}

interface NavItem {
  id: ViewType
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: "projects",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "users",
    label: "Usuarios",
    icon: <Users className="h-5 w-5" />,
  },
]

export function Sidebar({ currentView, onNavigate, onSignOut }: SidebarProps) {
  const isActive = (id: ViewType) =>
    id === "projects"
      ? ["projects", "kanban", "calendar", "documentos", "project-detail"].includes(currentView)
      : currentView === id

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-16 flex-col items-center border-l border-zinc-800 bg-zinc-950 py-4">
      {/* Brand */}
      <Tooltip content="Atria Manager" side="right">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black font-bold text-lg select-none cursor-default">
          A
        </div>
      </Tooltip>

      {/* Divider */}
      <div className="mb-4 h-px w-8 bg-zinc-800" />

      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => (
          <Tooltip key={item.id} content={item.label} side="right">
            <button
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                isActive(item.id)
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {item.icon}
            </button>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-2">
        <Tooltip content="Perfil" side="right">
          <button
            onClick={() => onNavigate("profile")}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              currentView === "profile"
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <User className="h-5 w-5" />
          </button>
        </Tooltip>

        <Tooltip content="Cerrar sesión" side="right">
          <button
            onClick={onSignOut}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
