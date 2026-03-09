"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListTodo, Calendar as CalendarIcon, FolderOpen } from "lucide-react"
import { Button } from "@/app/components/ui/button"

const tabs = [
  { label: "Proyectos",  href: "/projects",       icon: LayoutDashboard },
  { label: "Kanban",     href: "/tasks/kanban",    icon: ListTodo },
  { label: "Calendario", href: "/tasks/calendar",  icon: CalendarIcon },
  { label: "Documentos", href: "/documents",       icon: FolderOpen },
]

export function DashboardHeader() {
  const pathname = usePathname()

  // Ocultar tabs en detalle de proyecto, usuarios y perfil
  const hideTabs =
    /^\/projects\/.+/.test(pathname) ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/profile")

  return (
    <header className="flex items-center justify-between mb-1 pb-2 border-b border-zinc-800 px-4 pt-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Atria Manager</h1>
      </div>

      {!hideTabs && (
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {tabs.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === "/projects"
                ? pathname === "/projects"
                : pathname.startsWith(href)

            return (
              <Button
                key={href}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                asChild
                className="gap-2"
              >
                <Link href={href}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </Button>
            )
          })}
        </div>
      )}
    </header>
  )
}
