"use client"

import { useAppData } from "@/app/context/AppDataContext"
import { CalendarView } from "@/app/components/tasks/CalendarView"

export default function CalendarPage() {
  const { tasks, projects, handleCreateTask } = useAppData()

  return (
    <CalendarView
      tasks={tasks}
      projects={projects}
      onCreateTask={handleCreateTask}
    />
  )
}
