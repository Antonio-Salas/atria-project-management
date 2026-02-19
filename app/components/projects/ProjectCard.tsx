import { Project } from "../../types"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Calendar, Briefcase, User } from "lucide-react"

interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusColors = {
    "completed": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "pending": "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-300"
  };

  return (
    <Card 
      onClick={() => onClick(project)}
      className="cursor-pointer hover:shadow-md transition-all hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-900 text-white border-zinc-800"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Briefcase className="h-5 w-5 text-zinc-400 mb-2" />
        </div>
        <CardTitle className="text-sm font-medium leading-tight h-10 line-clamp-2">
          {project.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-xs text-zinc-400">
          {project.client && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate">{project.client}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
