"use client"

import { useRouter } from "next/navigation"
import { useAppData } from "@/app/context/AppDataContext"
import { ProjectsGrid } from "@/app/components/projects/ProjectsGrid"
import { Project } from "@/app/types"

export default function ProjectsPage() {
  const router = useRouter()
  const {
    projects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useAppData()

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`)
  }

  return (
    <ProjectsGrid
      projects={projects}
      onCreateProject={handleCreateProject}
      onUpdateProject={handleUpdateProject}
      onDeleteProject={handleDeleteProject}
      onProjectClick={handleProjectClick}
    />
  )
}
