"use client"

import { useState } from "react"
import { flushSync } from "react-dom"
import {
  projects as initialProjects,
  tasks as initialTasks,
  folders as initialFolders,
  files as initialFiles
} from "../data/mock"
import { Project, Task, Folder, File } from "../types"
import { ProjectsGrid } from "./projects/ProjectsGrid"
import { ProjectDetailView } from "./projects/ProjectDetailView"
import { KanbanBoard } from "./tasks/KanbanBoard"
import { CalendarView } from "./tasks/CalendarView"
import { DocumentsView } from "./documents/DocumentsView"
import { UsersView } from "./users/UsersView"
import { ProfileView } from "./profile/ProfileView"
import { Sidebar } from "./sidebar/Sidebar"
import { LayoutDashboard, Calendar as CalendarIcon, ListTodo, FolderOpen } from "lucide-react"
import { Button } from "./ui/button"

export default function Dashboard() {
  const [view, setView] = useState<"projects" | "kanban" | "calendar" | "documentos" | "project-detail" | "users" | "profile">("projects")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState(initialProjects)
  const [tasks, setTasks] = useState(initialTasks)
  const [folders, setFolders] = useState(initialFolders)
  const [files, setFiles] = useState(initialFiles)

  const runWithViewTransition = (update: () => void) => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const transitionDocument = document as Document & {
        startViewTransition: (callback: () => void) => void
      }

      transitionDocument.startViewTransition(() => {
        flushSync(update)
      })
      return
    }

    update()
  }

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: `${Date.now()}`
    }

    runWithViewTransition(() => {
      setTasks((prev) => [newTask, ...prev])
    })
  }

  const handleMoveTask = (
    taskId: string,
    targetStatus: Task["status"],
    targetTaskId?: string
  ) => {
    runWithViewTransition(() => {
      setTasks((prev) => {
        const taskToMove = prev.find((task) => task.id === taskId)
        if (!taskToMove) {
          return prev
        }

        const tasksWithoutMoved = prev.filter((task) => task.id !== taskId)
        const movedTask: Task = { ...taskToMove, status: targetStatus }

        if (targetTaskId) {
          const targetIndex = tasksWithoutMoved.findIndex((task) => task.id === targetTaskId)
          if (targetIndex >= 0) {
            return [
              ...tasksWithoutMoved.slice(0, targetIndex),
              movedTask,
              ...tasksWithoutMoved.slice(targetIndex)
            ]
          }
        }

        let insertIndex = tasksWithoutMoved.length
        for (let index = tasksWithoutMoved.length - 1; index >= 0; index -= 1) {
          if (tasksWithoutMoved[index].status === targetStatus) {
            insertIndex = index + 1
            break
          }
        }

        return [
          ...tasksWithoutMoved.slice(0, insertIndex),
          movedTask,
          ...tasksWithoutMoved.slice(insertIndex)
        ]
      })
    })
  }

  const handleUpdateTask = (updatedTask: Task) => {
    runWithViewTransition(() => {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
    })
  }

  const handleDeleteTask = (taskId: string) => {
    runWithViewTransition(() => {
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    })
  }

  const handleCreateProject = (projectData: Omit<Project, "id">) => {
    const newProject = {
      ...projectData,
      id: `${Date.now()}`
    }

    runWithViewTransition(() => {
      setProjects((prev) => [newProject, ...prev])
    })
  }

  const handleUpdateProject = (updatedProject: Project) => {
    runWithViewTransition(() => {
      setProjects((prev) =>
        prev.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      )
    })
  }

  const handleDeleteProject = (projectId: string) => {
    runWithViewTransition(() => {
      setProjects((prev) => prev.filter((project) => project.id !== projectId))
      setTasks((prev) =>
        prev.map((task) =>
          task.projectId === projectId ? { ...task, projectId: undefined } : task
        )
      )
    })
  }

  // Document handlers
  const handleCreateFolder = (parentId?: string) => {
    const folderName = prompt("Nombre de la carpeta:")
    if (!folderName) return

    const newFolder: Folder = {
      id: `f${Date.now()}`,
      name: folderName,
      parentId,
      createdAt: new Date().toISOString()
    }

    runWithViewTransition(() => {
      setFolders((prev) => [newFolder, ...prev])
    })
  }

  const handleUploadFile = () => {
    alert("Funcionalidad de subir archivos en desarrollo")
  }

  const handleDeleteFile = (fileId: string) => {
    if (!confirm("¿Estás seguro de eliminar este archivo?")) return

    runWithViewTransition(() => {
      setFiles((prev) => prev.filter((file) => file.id !== fileId))
    })
  }

  const handleRenameFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    const newName = prompt("Nuevo nombre:", file.name)
    if (!newName) return

    runWithViewTransition(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f))
      )
    })
  }

  const handleLinkToProject = (fileId: string) => {
    alert("Modal para vincular archivo a proyecto - en desarrollo")
  }

  const handleDownloadFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      alert(`Descargando: ${file.name}`)
    }
  }

  const handleSidebarNavigate = (target: "projects" | "kanban" | "calendar" | "documentos" | "project-detail" | "users" | "profile") => {
    runWithViewTransition(() => {
      if (target === "projects") {
        setSelectedProject(null)
      }
      setView(target)
    })
  }

  const handleSignOut = () => {
    alert("Cerrando sesión...")
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    runWithViewTransition(() => {
      setView("project-detail")
    })
  }

  const handleBackFromProjectDetail = () => {
    runWithViewTransition(() => {
      setView("projects")
      setSelectedProject(null)
    })
  }

  const handleLinkFilesToProject = (fileIds: string[], projectId: string) => {
    runWithViewTransition(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (fileIds.includes(file.id)) {
            const newProjectIds = [...file.projectIds]
            if (!newProjectIds.includes(projectId)) {
              newProjectIds.push(projectId)
            }
            return { ...file, projectIds: newProjectIds }
          }
          return file
        })
      )
    })
  }

  const handleUnlinkFileFromProject = (fileId: string, projectId: string) => {
    runWithViewTransition(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            return {
              ...file,
              projectIds: file.projectIds.filter((id) => id !== projectId)
            }
          }
          return file
        })
      )
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar
        currentView={view}
        onNavigate={handleSidebarNavigate}
        onSignOut={handleSignOut}
      />

      <div className="pl-16">
      <header className="flex items-center justify-between mb-1 pb-2 border-b border-zinc-800 px-4 pt-4">
        <div>
           <h1 className="text-xl font-bold tracking-tight">Atria Manager</h1>
        </div>
        
        {view !== "project-detail" && view !== "users" && view !== "profile" && (
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <Button 
            variant={view === "projects" ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setView("projects")}
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Proyectos
          </Button>
          <Button 
            variant={view === "kanban" ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setView("kanban")}
            className="gap-2"
          >
            <ListTodo className="h-4 w-4" />
            Kanban
          </Button>
          <Button 
            variant={view === "calendar" ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setView("calendar")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendario
          </Button>
          <Button 
            variant={view === "documentos" ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setView("documentos")}
            className="gap-2"
          >
            <FolderOpen className="h-4 w-4" />
            Documentos
          </Button>
        </div>
        )}
      </header>

      <main className="space-y-8 animate-in fade-in duration-500 px-4 pb-4">
        {view === "projects" && (
          <ProjectsGrid
            projects={projects}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onProjectClick={handleProjectClick}
          />
        )}
        
        {view === "project-detail" && selectedProject && (
          <ProjectDetailView
            project={selectedProject}
            tasks={tasks}
            files={files}
            folders={folders}
            projects={projects}
            onBack={handleBackFromProjectDetail}
            onEdit={handleUpdateProject}
            onDelete={handleDeleteProject}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onLinkFiles={handleLinkFilesToProject}
            onUnlinkFile={handleUnlinkFileFromProject}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
            onDownloadFile={handleDownloadFile}
          />
        )}
        
        {view === "kanban" && (
          <div className="h-[calc(100vh-200px)]">
            <KanbanBoard
              tasks={tasks}
              projects={projects}
              onCreateTask={handleCreateTask}
              onMoveTask={handleMoveTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}

        {view === "calendar" && (
          <CalendarView tasks={tasks} projects={projects} onCreateTask={handleCreateTask} />
        )}

        {view === "documentos" && (
          <div className="h-[calc(100vh-200px)]">
            <DocumentsView
              files={files}
              folders={folders}
              projects={projects}
              onCreateFolder={handleCreateFolder}
              onUploadFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              onLinkToProject={handleLinkToProject}
              onDownloadFile={handleDownloadFile}
            />
          </div>
        )}

        {view === "users" && <UsersView />}

        {view === "profile" && <ProfileView />}
      </main>
      </div>
    </div>
  )
}
