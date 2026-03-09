import { AppDataProvider } from "@/app/context/AppDataContext"
import { Sidebar } from "@/app/components/sidebar/Sidebar"
import { DashboardHeader } from "./DashboardHeader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppDataProvider>
      <div className="min-h-screen bg-black text-white">
        <Sidebar />
        <div className="pl-16">
          <DashboardHeader />
          <main className="animate-in fade-in duration-500 px-4 pb-4">
            {children}
          </main>
        </div>
      </div>
    </AppDataProvider>
  )
}
