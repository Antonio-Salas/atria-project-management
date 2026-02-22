"use client"

import { useState } from "react"
import { Project } from "../../types"
import { ProjectCard } from "./ProjectCard"
import { ProjectDrawer } from "./ProjectDrawer"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

interface ProjectsGridProps {
  projects: Project[]
  onCreateProject: (projectData: Omit<Project, "id">) => void
  onUpdateProject: (project: Project) => void
  onDeleteProject: (projectId: string) => void
  onProjectClick?: (project: Project) => void
}

export function ProjectsGrid({
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onProjectClick
}: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [mode, setMode] = useState<"create" | "edit">("edit")

  const handleProjectClick = (project: Project) => {
    if (onProjectClick) {
      onProjectClick(project)
    } else {
      setMode("edit")
      setSelectedProject(project)
      setIsDrawerOpen(true)
    }
  }

  const handleCreateClick = () => {
    setMode("create")
    setSelectedProject(null)
    setIsDrawerOpen(true)
  }

  const handleSaveProject = (projectData: Project | Omit<Project, "id">) => {
    if (mode === "create") {
      onCreateProject(projectData as Omit<Project, "id">)
      return
    }

    onUpdateProject(projectData as Project)
  }

  const handleDelete = (projectId: string) => {
    onDeleteProject(projectId)
    handleCloseDrawer()
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedProject(null), 300) // Clear after animation
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-zinc-800 text-white px-2 py-1 rounded text-xs">Proyectos</span>
        </h2>
        <div className="flex gap-2">
           <Button size="sm" variant="ghost" className="h-8" onClick={handleCreateClick}>
             <Plus className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={handleProjectClick} 
          />
        ))}
        
        {/* Add New Project Placeholder */}
        <button
          onClick={handleCreateClick}
          className="flex flex-col items-center justify-center p-6 border border-dashed border-zinc-700 rounded-lg text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300 transition-colors h-full min-h-[140px]"
        >
          <Plus className="h-8 w-8 mb-2" />
          <span className="text-sm font-medium">Nuevo Proyecto</span>
        </button>
      </div>

      <ProjectDrawer 
        project={selectedProject}
        mode={mode}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveProject}
        onDelete={handleDelete}
      />
    </div>
  )
}
