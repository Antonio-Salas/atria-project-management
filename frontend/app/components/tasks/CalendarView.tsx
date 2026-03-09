"use client"

import { useMemo, useState } from "react"
import { Project, Task } from "../../types"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { TaskCreateModal } from "./TaskCreateModal"
import { TaskDetailsModal } from "./TaskDetailsModal"

interface CalendarViewProps {
  tasks: Task[]
  projects: Project[]
  onCreateTask: (taskData: Omit<Task, "id">) => void
}

export function CalendarView({ tasks, projects, onCreateTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const priorityColors = {
    urgent: "bg-red-900/50 text-red-200 border-red-800",
    medium: "bg-yellow-900/50 text-yellow-200 border-yellow-800",
    low: "bg-blue-900/50 text-blue-200 border-blue-800"
  }

  const projectNameById = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects]
  )

  return (
    <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📅 Calendario</span>
          <span className="text-zinc-500 font-normal text-sm">{format(currentDate, 'MMMM yyyy')}</span>
        </h2>
        <div className="flex gap-2 items-center">
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Button>
          <button onClick={prevMonth} className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setCurrentDate(new Date())} className="text-sm px-2 hover:bg-zinc-800 rounded">Today</button>
          <button onClick={nextMonth} className="p-1 hover:bg-zinc-800 rounded"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-zinc-950 p-2 text-center text-xs text-zinc-500 font-medium">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, idx) => {
          const dayTasks = tasks.filter(task => isSameDay(new Date(task.date), day))
          const isCurrentMonth = isSameMonth(day, monthStart)
          
          return (
            <div 
              key={day.toISOString()} 
              className={`min-h-[120px] bg-zinc-950 p-2 border-t border-zinc-800 ${!isCurrentMonth ? 'bg-zinc-950/50 text-zinc-600' : ''}`}
            >
              <div className={`text-right text-xs mb-2 ${isSameDay(day, new Date()) ? 'bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white ml-auto' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayTasks.map(task => (
                  <button
                    type="button"
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`w-full text-left text-[10px] p-1 rounded border border-l-2 truncate ${priorityColors[task.priority] || 'bg-zinc-800'}`}
                  >
                    <div className="font-semibold">{format(new Date(task.date), 'h:mm a')}</div>
                    <div className="truncate">{task.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <TaskCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={onCreateTask}
        projects={projects}
        defaultStatus="todo"
      />

      <TaskDetailsModal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        projectName={selectedTask?.projectId ? projectNameById.get(selectedTask.projectId) : undefined}
      />
    </div>
  )
}
