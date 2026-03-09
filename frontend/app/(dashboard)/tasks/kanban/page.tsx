"use client"

import { useAppData } from "@/app/context/AppDataContext"
import { KanbanBoard } from "@/app/components/tasks/KanbanBoard"

export default function KanbanPage() {
  const {
    tasks,
    projects,
    handleCreateTask,
    handleMoveTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useAppData()

  return (
    <div className="h-[calc(100vh-8rem)]">
      <KanbanBoard
        tasks={tasks}
        projects={projects}
        onCreateTask={handleCreateTask}
        onMoveTask={handleMoveTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}
