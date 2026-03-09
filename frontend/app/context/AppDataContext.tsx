"use client"

import { createContext, useContext, useState } from "react"
import { flushSync } from "react-dom"
import {
  projects as initialProjects,
  tasks as initialTasks,
  folders as initialFolders,
  files as initialFiles,
} from "@/app/data/mock"
import { Project, Task, Folder, File } from "@/app/types"

interface AppDataContextValue {
  projects: Project[]
  tasks: Task[]
  folders: Folder[]
  files: File[]
  handleCreateTask: (taskData: Omit<Task, "id">) => void
  handleUpdateTask: (updatedTask: Task) => void
  handleDeleteTask: (taskId: string) => void
  handleMoveTask: (taskId: string, targetStatus: Task["status"], targetTaskId?: string) => void
  handleCreateProject: (projectData: Omit<Project, "id">) => void
  handleUpdateProject: (updatedProject: Project) => void
  handleDeleteProject: (projectId: string) => void
  handleCreateFolder: (parentId?: string) => void
  handleUploadFile: () => void
  handleDeleteFile: (fileId: string) => void
  handleRenameFile: (fileId: string) => void
  handleDownloadFile: (fileId: string) => void
  handleLinkFilesToProject: (fileIds: string[], projectId: string) => void
  handleUnlinkFileFromProject: (fileId: string, projectId: string) => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [folders, setFolders] = useState<Folder[]>(initialFolders)
  const [files, setFiles] = useState<File[]>(initialFiles)

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

  // ── Tasks ──────────────────────────────────────────────────────────────────

  const handleCreateTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = { ...taskData, id: `${Date.now()}` }
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
        if (!taskToMove) return prev

        const tasksWithoutMoved = prev.filter((task) => task.id !== taskId)
        const movedTask: Task = { ...taskToMove, status: targetStatus }

        if (targetTaskId) {
          const targetIndex = tasksWithoutMoved.findIndex((task) => task.id === targetTaskId)
          if (targetIndex >= 0) {
            return [
              ...tasksWithoutMoved.slice(0, targetIndex),
              movedTask,
              ...tasksWithoutMoved.slice(targetIndex),
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
          ...tasksWithoutMoved.slice(insertIndex),
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

  // ── Projects ───────────────────────────────────────────────────────────────

  const handleCreateProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = { ...projectData, id: `${Date.now()}` }
    runWithViewTransition(() => {
      setProjects((prev) => [newProject, ...prev])
    })
  }

  const handleUpdateProject = (updatedProject: Project) => {
    runWithViewTransition(() => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
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

  // ── Documents ──────────────────────────────────────────────────────────────

  const handleCreateFolder = (parentId?: string) => {
    const folderName = prompt("Nombre de la carpeta:")
    if (!folderName) return

    const newFolder: Folder = {
      id: `f${Date.now()}`,
      name: folderName,
      parentId,
      createdAt: new Date().toISOString(),
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

  const handleDownloadFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      alert(`Descargando: ${file.name}`)
    }
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
              projectIds: file.projectIds.filter((id) => id !== projectId),
            }
          }
          return file
        })
      )
    })
  }

  return (
    <AppDataContext.Provider
      value={{
        projects,
        tasks,
        folders,
        files,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask,
        handleMoveTask,
        handleCreateProject,
        handleUpdateProject,
        handleDeleteProject,
        handleCreateFolder,
        handleUploadFile,
        handleDeleteFile,
        handleRenameFile,
        handleDownloadFile,
        handleLinkFilesToProject,
        handleUnlinkFileFromProject,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error("useAppData debe usarse dentro de AppDataProvider")
  }
  return context
}
