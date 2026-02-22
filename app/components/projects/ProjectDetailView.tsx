"use client"

import { useState } from "react"
import { Project, Task, File, Folder } from "@/app/types"
import { ProjectFilesView } from "./ProjectFilesView"
import { CalendarView } from "../tasks/CalendarView"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  ArrowLeft,
  Calendar,
  FileText,
  ListTodo,
  Briefcase,
  User,
  Edit,
  Trash2
} from "lucide-react"

type TabType = "resume" | "tasks" | "calendar" | "files"

interface ProjectDetailViewProps {
  project: Project
  tasks: Task[]
  files: File[]
  folders: Folder[]
  projects: Project[]
  onBack: () => void
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  onCreateTask: (taskData: Omit<Task, "id">) => void
  onUpdateTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onLinkFiles: (fileIds: string[], projectId: string) => void
  onUnlinkFile: (fileId: string, projectId: string) => void
  onDeleteFile: (fileId: string) => void
  onRenameFile: (fileId: string) => void
  onDownloadFile: (fileId: string) => void
}

export function ProjectDetailView({
  project,
  tasks,
  files,
  folders,
  projects,
  onBack,
  onEdit,
  onDelete,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onLinkFiles,
  onUnlinkFile,
  onDeleteFile,
  onRenameFile,
  onDownloadFile
}: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("resume")

  const projectTasks = tasks.filter((task) => task.projectId === project.id)

  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    pending: "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300"
  }

  const statusLabels = {
    completed: "Completado",
    "in-progress": "En Progreso",
    pending: "Pendiente"
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date)
  }

  const renderResumeProject = () => (
    <div className="space-y-6">
      {/* Project Info Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <Badge className={`mt-2 ${statusColors[project.status]}`}>
                {statusLabels[project.status]}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("¿Estás seguro de eliminar este proyecto?")) {
                  onDelete(project.id)
                  onBack()
                }
              }}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Cliente</label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-zinc-500" />
              <span className="font-medium">{project.client || "No especificado"}</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-1">Periodo</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <span className="font-medium">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-zinc-400 block mb-2">Descripción</label>
            <p className="text-zinc-200">
              {project.description || "Sin descripción"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <ListTodo className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Tareas</p>
              <p className="text-2xl font-bold">{projectTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Archivos</p>
              <p className="text-2xl font-bold">
                {files.filter((f) => f.projectIds.includes(project.id)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <ListTodo className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Completadas</p>
              <p className="text-2xl font-bold">
                {projectTasks.filter((t) => t.status === "done").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Tareas Recientes</h3>
        {projectTasks.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">
            No hay tareas asociadas a este proyecto
          </p>
        ) : (
          <div className="space-y-2">
            {projectTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.status === "done"
                        ? "bg-green-500"
                        : task.status === "in-progress"
                        ? "bg-purple-500"
                        : "bg-zinc-500"
                    }`}
                  />
                  <span className="font-medium">{task.title}</span>
                </div>
                <Badge
                  variant={
                    task.priority === "urgent"
                      ? "destructive"
                      : task.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {task.priority === "urgent"
                    ? "Urgente"
                    : task.priority === "medium"
                    ? "Media"
                    : "Baja"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderTasks = () => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Tareas del Proyecto</h3>
      <p className="text-zinc-500">Vista de tareas en desarrollo</p>
      {/* TODO: Implement view tasks */}
    </div>
  )

  const renderCalendar = () => (
    <div className="h-[calc(100vh-300px)]">
      <CalendarView
        tasks={projectTasks}
        projects={projects}
        onCreateTask={(taskData) =>
          onCreateTask({ ...taskData, projectId: project.id })
        }
      />
    </div>
  )

  const renderFiles = () => (
    <div className="h-[calc(100vh-200px)]">
      <ProjectFilesView
        projectId={project.id}
        files={files}
        folders={folders}
        projects={projects}
        onLinkFiles={onLinkFiles}
        onUnlinkFile={onUnlinkFile}
        onDeleteFile={onDeleteFile}
        onRenameFile={onRenameFile}
        onDownloadFile={onDownloadFile}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with back button and tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "resume" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("resume")}
            className="gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Resumen
          </Button>
          <Button
            variant={activeTab === "tasks" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("tasks")}
            className="gap-2"
          >
            <ListTodo className="h-4 w-4" />
            Tareas
          </Button>
          <Button
            variant={activeTab === "calendar" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calendar")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendario
          </Button>
          <Button
            variant={activeTab === "files" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("files")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Archivos
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "resume" && renderResumeProject()}
        {activeTab === "tasks" && renderTasks()}
        {activeTab === "calendar" && renderCalendar()}
        {activeTab === "files" && renderFiles()}
      </div>
    </div>
  )
}
