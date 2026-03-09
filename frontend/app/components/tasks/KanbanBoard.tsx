"use client"

import { CSSProperties } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Project, Task } from "../../types"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Plus, MoreHorizontal, BriefcaseBusiness } from "lucide-react"
import { Button } from "../ui/button"
import { TaskCreateModal } from "./TaskCreateModal"
import { TaskDetailsModal } from "./TaskDetailsModal"
import { TaskEditModal } from "./TaskEditModal"

interface TaskCardProps {
  task: Task
  projectName?: string
  onOpenDetails: (task: Task) => void
  onDragStart: (taskId: string) => void
  onDragEnd: () => void
  onDragOverTask: (taskId: string) => void
  onDragLeaveTask: (taskId: string) => void
  isDragging: boolean
  isDropTarget: boolean
  isNew: boolean
  onDropOnTask: (targetTaskId: string, targetStatus: Task["status"]) => void
}

function TaskCard({
  task,
  projectName,
  onOpenDetails,
  onDragStart,
  onDragEnd,
  onDragOverTask,
  onDragLeaveTask,
  isDragging,
  isDropTarget,
  isNew,
  onDropOnTask
}: TaskCardProps) {
  const priorityColors = {
    urgent: "bg-red-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-blue-500 text-white"
  }

  return (
    <Card
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/task-id", task.id)
        event.dataTransfer.effectAllowed = "move"
        onDragStart(task.id)
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
        onDragOverTask(task.id)
      }}
      onDragLeave={() => onDragLeaveTask(task.id)}
      onDrop={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onDropOnTask(task.id, task.status)
      }}
      style={{ viewTransitionName: `task-${task.id}` } as CSSProperties}
      className={`bg-zinc-800 text-white mb-3 cursor-pointer transition-all duration-200 ease-out ${isDragging ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"} ${isDropTarget ? "border-zinc-400 shadow-md shadow-zinc-700/40" : "border-zinc-700"} ${isNew ? "animate-in fade-in-50 slide-in-from-top-1 zoom-in-95 duration-300" : ""}`}
      onClick={() => onOpenDetails(task)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
           <h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
           <button className="text-zinc-400 hover:text-white"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
           <time className="text-xs text-zinc-400">
             {new Date(task.date).toLocaleDateString()} {new Date(task.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
           </time>

           {projectName && (
            <div className="text-xs text-zinc-300 flex items-center gap-1.5 truncate">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-zinc-500" />
              <span className="truncate">{projectName}</span>
            </div>
           )}
           
           <div className="flex gap-1">
             <Badge variant="secondary" className={`${priorityColors[task.priority]} text-[10px] px-1.5 py-0`}>
               {task.priority === 'urgent' ? 'Urgente' : task.priority === 'medium' ? 'Media' : 'Baja'}
             </Badge>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface KanbanBoardProps {
  tasks: Task[]
  projects: Project[]
  onCreateTask: (taskData: Omit<Task, "id">) => void
  onMoveTask: (taskId: string, status: Task["status"], targetTaskId?: string) => void
  onUpdateTask: (updatedTask: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function KanbanBoard({
  tasks,
  projects,
  onCreateTask,
  onMoveTask,
  onUpdateTask,
  onDeleteTask
}: KanbanBoardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [statusForNewTask, setStatusForNewTask] = useState<Task["status"]>("todo")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskForEdit, setTaskForEdit] = useState<Task | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<Task["status"] | null>(null)
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)
  const [newTaskIds, setNewTaskIds] = useState<Set<string>>(new Set())
  const hasInitializedTasks = useRef(false)
  const previousTaskIdsRef = useRef<Set<string>>(new Set(tasks.map((task) => task.id)))

  const columns: Array<{ id: Task["status"]; title: string; color: string }> = [
    { id: 'todo', title: 'Por hacer', color: 'bg-zinc-700' },
    { id: 'in-progress', title: 'En progreso', color: 'bg-purple-900/40 text-purple-300' },
    { id: 'done', title: 'Completado', color: 'bg-green-900/40 text-green-300' }
  ]

  const projectNameById = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects]
  )

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  )

  useEffect(() => {
    const currentIds = new Set(tasks.map((task) => task.id))

    if (!hasInitializedTasks.current) {
      hasInitializedTasks.current = true
      previousTaskIdsRef.current = currentIds
      return
    }

    const addedIds = [...currentIds].filter((taskId) => !previousTaskIdsRef.current.has(taskId))
    if (addedIds.length === 0) {
      previousTaskIdsRef.current = currentIds
      return
    }

    setNewTaskIds((prev) => {
      const next = new Set(prev)
      addedIds.forEach((taskId) => next.add(taskId))
      return next
    })

    const timeout = window.setTimeout(() => {
      setNewTaskIds((prev) => {
        const next = new Set(prev)
        addedIds.forEach((taskId) => next.delete(taskId))
        return next
      })
    }, 400)

    previousTaskIdsRef.current = currentIds
    return () => window.clearTimeout(timeout)
  }, [tasks])

  const getTasksByStatus = (status: Task["status"]) => tasks.filter(t => t.status === status)
  const openCreateModal = (status: Task["status"]) => {
    setStatusForNewTask(status)
    setIsCreateModalOpen(true)
  }

  const handleDropOnColumn = (taskId: string | null, status: Task["status"]) => {
    if (!taskId) {
      setDragOverStatus(null)
      setDragOverTaskId(null)
      return
    }

    onMoveTask(taskId, status)
    setDraggedTaskId(null)
    setDragOverStatus(null)
    setDragOverTaskId(null)
  }

  const handleDropOnTask = (targetTaskId: string, targetStatus: Task["status"]) => {
    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      setDragOverTaskId(null)
      return
    }

    onMoveTask(draggedTaskId, targetStatus, targetTaskId)
    setDraggedTaskId(null)
    setDragOverStatus(null)
    setDragOverTaskId(null)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverStatus(null)
    setDragOverTaskId(null)
  }

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTaskId(task.id)
  }

  const handleStartEditingTask = (task: Task) => {
    setSelectedTaskId(null)
    setTaskForEdit(task)
  }

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId)
    setSelectedTaskId(null)
    setTaskForEdit((prev) => (prev?.id === taskId ? null : prev))
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tareas por Estado</h2>
        <div className="flex items-center gap-3">
          <div className="text-zinc-500 text-sm">Se mostrará el estado de las tareas de ayer, hoy y mañana.</div>
          <Button size="sm" onClick={() => openCreateModal("todo")} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px]">
        {columns.map(col => (
          <div
            key={col.id}
            className={`flex flex-col h-full bg-zinc-900/50 rounded-lg p-2 border transition-colors ${dragOverStatus === col.id ? "border-zinc-500 bg-zinc-800/60" : "border-zinc-800"}`}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = "move"
              if (dragOverStatus !== col.id) {
                setDragOverStatus(col.id)
              }
            }}
            onDragLeave={() => {
              if (dragOverStatus === col.id) {
                setDragOverStatus(null)
              }
            }}
            onDrop={(event) => {
              event.preventDefault()
              const droppedTaskId = event.dataTransfer.getData("text/task-id")
              handleDropOnColumn(droppedTaskId || draggedTaskId, col.id)
            }}
          >
            <div className="px-2 py-3 mb-2 flex justify-between items-center">
               <div className={`px-2 py-1 rounded text-xs font-medium ${col.color}`}>
                 ● {col.title}
               </div>
               <span className="text-zinc-500 text-xs">{getTasksByStatus(col.id).length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              {getTasksByStatus(col.id).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectName={task.projectId ? projectNameById.get(task.projectId) : undefined}
                  onOpenDetails={handleOpenTaskDetails}
                  onDragStart={setDraggedTaskId}
                  onDragEnd={handleDragEnd}
                  onDragOverTask={setDragOverTaskId}
                  onDragLeaveTask={(taskId) => {
                    if (dragOverTaskId === taskId) {
                      setDragOverTaskId(null)
                    }
                  }}
                  isDragging={draggedTaskId === task.id}
                  isDropTarget={dragOverTaskId === task.id}
                  isNew={newTaskIds.has(task.id)}
                  onDropOnTask={handleDropOnTask}
                />
              ))}
              
              <button
                onClick={() => openCreateModal(col.id)}
                className="w-full py-2 flex items-center justify-start px-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded transition-colors text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva tarea
              </button>
            </div>
          </div>
        ))}
      </div>

      <TaskCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={onCreateTask}
        projects={projects}
        defaultStatus={statusForNewTask}
      />

      <TaskDetailsModal
        key={`${selectedTask?.id ?? "none"}-${Boolean(selectedTask)}`}
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTaskId(null)}
        task={selectedTask}
        projectName={selectedTask?.projectId ? projectNameById.get(selectedTask.projectId) : undefined}
        onEdit={handleStartEditingTask}
        onDelete={handleDeleteTask}
      />

      <TaskEditModal
        open={Boolean(taskForEdit)}
        onClose={() => setTaskForEdit(null)}
        task={taskForEdit}
        onUpdateTask={onUpdateTask}
        projects={projects}
      />
    </div>
  )
}
