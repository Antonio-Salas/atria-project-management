"use client"

import { notFound, useRouter } from "next/navigation"
import { use } from "react"
import { useAppData } from "@/app/context/AppDataContext"
import { ProjectDetailView } from "@/app/components/projects/ProjectDetailView"

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const {
    projects,
    tasks,
    files,
    folders,
    handleUpdateProject,
    handleDeleteProject,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleLinkFilesToProject,
    handleUnlinkFileFromProject,
    handleDeleteFile,
    handleRenameFile,
    handleDownloadFile,
  } = useAppData()

  const project = projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  const handleDelete = (projectId: string) => {
    handleDeleteProject(projectId)
    router.push("/projects")
  }

  return (
    <ProjectDetailView
      project={project}
      tasks={tasks}
      files={files}
      folders={folders}
      projects={projects}
      onBack={() => router.push("/projects")}
      onEdit={handleUpdateProject}
      onDelete={handleDelete}
      onCreateTask={handleCreateTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onLinkFiles={handleLinkFilesToProject}
      onUnlinkFile={handleUnlinkFileFromProject}
      onDeleteFile={handleDeleteFile}
      onRenameFile={handleRenameFile}
      onDownloadFile={handleDownloadFile}
    />
  )
}
