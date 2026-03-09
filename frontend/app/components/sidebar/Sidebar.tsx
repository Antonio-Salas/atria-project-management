"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, User, LogOut } from "lucide-react"
import { Tooltip } from "../ui/tooltip"
import { cn } from "../ui/card"

const navItems = [
  { href: "/projects", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/users",    label: "Usuarios",  icon: <Users className="h-5 w-5" /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === "/projects"
      ? pathname === "/projects" || /^\/projects\/.+/.test(pathname) || pathname.startsWith("/tasks") || pathname.startsWith("/documents")
      : pathname.startsWith(href)

  const handleSignOut = () => {
    alert("Cerrando sesión...")
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-16 flex-col items-center border-r border-zinc-800 bg-zinc-950 py-4">
      {/* Brand */}
      <Tooltip content="Atria Manager" side="right">
        <Link
          href="/projects"
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black font-bold text-lg select-none"
        >
          A
        </Link>
      </Tooltip>

      {/* Divider */}
      <div className="mb-4 h-px w-8 bg-zinc-800" />

      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => (
          <Tooltip key={item.href} content={item.label} side="right">
            <Link
              href={item.href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {item.icon}
            </Link>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-2">
        <Tooltip content="Perfil" side="right">
          <Link
            href="/profile"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              pathname.startsWith("/profile")
                ? "bg-zinc-700 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <User className="h-5 w-5" />
          </Link>
        </Tooltip>

        <Tooltip content="Cerrar sesión" side="right">
          <button
            onClick={handleSignOut}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
    </aside>
  )
}
