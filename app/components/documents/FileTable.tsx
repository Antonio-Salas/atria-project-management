"use client"

import { File, Project } from "@/app/types"
import {
  FileText,
  Image as ImageIcon,
  Download,
  Trash2,
  Link2,
  MoreVertical,
  Edit
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { useState } from "react"

interface FileTableProps {
  files: File[]
  projects: Project[]
  onDelete: (fileId: string) => void
  onRename: (fileId: string) => void
  onLinkToProject: (fileId: string) => void
  onDownload: (fileId: string) => void
}

export function FileTable({
  files,
  projects,
  onDelete,
  onRename,
  onLinkToProject,
  onDownload
}: FileTableProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-purple-400" />
    }
    return <FileText className="h-5 w-5 text-blue-400" />
  }

  const getProjectNames = (projectIds: string[]): string[] => {
    return projectIds
      .map((id) => projects.find((p) => p.id === id)?.name)
      .filter(Boolean) as string[]
  }

  const getStatusBadge = (status: File["status"]) => {
    const variants: Record<File["status"], { variant: any; label: string }> = {
      ready: { variant: "default", label: "Listo" },
      uploading: { variant: "secondary", label: "Subiendo" },
      processing: { variant: "secondary", label: "Procesando" },
      pending: { variant: "secondary", label: "Pendiente" },
      error: { variant: "destructive", label: "Error" }
    }
    const config = variants[status]
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p>No hay archivos en esta carpeta</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-zinc-800">
          <tr className="text-left text-xs text-zinc-400 uppercase tracking-wider">
            <th className="pb-3 pl-4 w-8">
              <input
                type="checkbox"
                className="rounded border-zinc-700 bg-zinc-900"
                checked={selectedFiles.size === files.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedFiles(new Set(files.map((f) => f.id)))
                  } else {
                    setSelectedFiles(new Set())
                  }
                }}
              />
            </th>
            <th className="pb-3">Nombre</th>
            <th className="pb-3">Proyectos</th>
            <th className="pb-3">Tamaño</th>
            <th className="pb-3">Subido por</th>
            <th className="pb-3">Fecha</th>
            <th className="pb-3">Estado</th>
            <th className="pb-3 pr-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const projectNames = getProjectNames(file.projectIds)
            return (
              <tr
                key={file.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
              >
                <td className="py-3 pl-4">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-700 bg-zinc-900"
                    checked={selectedFiles.has(file.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedFiles)
                      if (e.target.checked) {
                        newSelected.add(file.id)
                      } else {
                        newSelected.delete(file.id)
                      }
                      setSelectedFiles(newSelected)
                    }}
                  />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex gap-1 flex-wrap max-w-xs">
                    {projectNames.length > 0 ? (
                      projectNames.map((name, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500">Sin proyecto</span>
                    )}
                  </div>
                </td>
                <td className="py-3 text-sm text-zinc-400">{formatFileSize(file.size)}</td>
                <td className="py-3 text-sm text-zinc-400">{file.uploadedBy}</td>
                <td className="py-3 text-sm text-zinc-400">{formatDate(file.uploadedAt)}</td>
                <td className="py-3">{getStatusBadge(file.status)}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(file.id)}
                      className="h-8 w-8 p-0"
                      title="Descargar"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRename(file.id)}
                      className="h-8 w-8 p-0"
                      title="Renombrar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLinkToProject(file.id)}
                      className="h-8 w-8 p-0"
                      title="Vincular a proyecto"
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(file.id)}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
