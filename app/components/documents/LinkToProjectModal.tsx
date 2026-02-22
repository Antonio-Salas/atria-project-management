"use client"

import { useState, useMemo } from "react"
import { File, Project, Folder } from "@/app/types"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Search, FileText, Image as ImageIcon, Link2, FolderIcon } from "lucide-react"

interface LinkToProjectModalProps {
  open: boolean
  files: File[]
  folders: Folder[]
  projects: Project[]
  currentProjectId?: string
  onClose: () => void
  onLink: (fileIds: string[], projectId: string) => void
}

export function LinkToProjectModal({
  open,
  files,
  folders,
  projects,
  currentProjectId,
  onClose,
  onLink
}: LinkToProjectModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>()
  const [selectedFileType, setSelectedFileType] = useState<string | undefined>()
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const fileTypes = useMemo(() => {
    const types = new Set(files.map((f) => f.type))
    return Array.from(types)
  }, [files])

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // Filter by search
      const matchesSearch =
        !searchQuery ||
        file.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by folder
      const matchesFolder =
        !selectedFolder || file.folderId === selectedFolder

      // Filter by type
      const matchesType =
        !selectedFileType || file.type === selectedFileType

      // Don't show files already linked to current project
      const notLinked =
        !currentProjectId || !file.projectIds.includes(currentProjectId)

      return matchesSearch && matchesFolder && matchesType && notLinked
    })
  }, [files, searchQuery, selectedFolder, selectedFileType, currentProjectId])

  const handleToggleFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId)
    } else {
      newSelected.add(fileId)
    }
    setSelectedFiles(newSelected)
  }

  const handleToggleAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.id)))
    }
  }

  const handleSubmit = () => {
    if (currentProjectId && selectedFiles.size > 0) {
      onLink(Array.from(selectedFiles), currentProjectId)
      setSelectedFiles(new Set())
      setSearchQuery("")
      setSelectedFolder(undefined)
      setSelectedFileType(undefined)
      onClose()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-purple-400" />
    }
    return <FileText className="h-5 w-5 text-blue-400" />
  }

  const getFolderName = (folderId?: string) => {
    if (!folderId) return "Sin carpeta"
    return folders.find((f) => f.id === folderId)?.name || "Desconocido"
  }

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith("image/")) return "Imagen"
    if (type === "application/pdf") return "PDF"
    if (type.includes("word")) return "Word"
    if (type.includes("excel") || type.includes("sheet")) return "Excel"
    if (type === "application/acad") return "AutoCAD"
    return type.split("/")[1]?.toUpperCase() || "Archivo"
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold mb-2">Vincular Archivos Existentes</h2>
          <p className="text-sm text-zinc-400">
            Selecciona archivos del drive global para vincular a este proyecto
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-zinc-800 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter by Folder and Type */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-zinc-400 mb-2 block">Carpeta</label>
              <select
                value={selectedFolder || ""}
                onChange={(e) =>
                  setSelectedFolder(e.target.value || undefined)
                }
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              >
                <option value="">Todas las carpetas</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
                <option value="null">Sin carpeta</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-zinc-400 mb-2 block">Tipo de archivo</label>
              <select
                value={selectedFileType || ""}
                onChange={(e) =>
                  setSelectedFileType(e.target.value || undefined)
                }
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              >
                <option value="">Todos los tipos</option>
                {fileTypes.map((type) => (
                  <option key={type} value={type}>
                    {getFileTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  filteredFiles.length > 0 &&
                  selectedFiles.size === filteredFiles.length
                }
                onChange={handleToggleAll}
                className="rounded border-zinc-700 bg-zinc-900"
              />
              <span className="text-sm text-zinc-400">
                {selectedFiles.size} de {filteredFiles.length} seleccionados
              </span>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No se encontraron archivos disponibles</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedFiles.has(file.id)
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                  onClick={() => handleToggleFile(file.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleToggleFile(file.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 rounded border-zinc-700 bg-zinc-900"
                    />
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium mb-1 truncate">
                        {file.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <FolderIcon className="h-3 w-3" />
                          {getFolderName(file.folderId)}
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                        <span>{getFileTypeLabel(file.type)}</span>
                      </div>
                      {file.projectIds.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {file.projectIds.slice(0, 3).map((projId) => {
                            const project = projects.find((p) => p.id === projId)
                            return project ? (
                              <Badge
                                key={projId}
                                variant="outline"
                                className="text-xs"
                              >
                                {project.name}
                              </Badge>
                            ) : null
                          })}
                          {file.projectIds.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{file.projectIds.length - 3} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedFiles.size === 0}
            className="gap-2"
          >
            <Link2 className="h-4 w-4" />
            Vincular {selectedFiles.size > 0 && `(${selectedFiles.size})`}
          </Button>
        </div>
      </div>
    </div>
  )
}
