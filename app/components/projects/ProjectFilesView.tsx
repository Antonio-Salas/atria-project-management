"use client"

import { useState, useMemo } from "react"
import { File, Folder, Project } from "@/app/types"
import { FileUploader } from "../documents/FileUploader"
import { LinkToProjectModal } from "../documents/LinkToProjectModal"
import { FolderTree } from "../documents/FolderTree"
import { FileTable } from "../documents/FileTable"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Upload,
  Link2,
  Search,
  X,
  ChevronRight
} from "lucide-react"

interface ProjectFilesViewProps {
  projectId: string
  files: File[]
  folders: Folder[]
  projects: Project[]
  onUploadFile?: (folderId?: string, projectId?: string) => void
  onLinkFiles: (fileIds: string[], projectId: string) => void
  onUnlinkFile: (fileId: string, projectId: string) => void
  onDeleteFile: (fileId: string) => void
  onRenameFile: (fileId: string) => void
  onDownloadFile: (fileId: string) => void
  onMoveFile?: (fileId: string, folderId?: string) => void
}

export function ProjectFilesView({
  projectId,
  files,
  folders,
  projects,
  onLinkFiles,
  onUnlinkFile,
  onDeleteFile,
  onRenameFile,
  onDownloadFile
}: ProjectFilesViewProps) {
  const [showUploader, setShowUploader] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState("")

  // Only files linked to this project
  const projectFiles = useMemo(
    () => files.filter((file) => file.projectIds.includes(projectId)),
    [files, projectId]
  )

  // Only folders that contain at least one project file
  const relevantFolders = useMemo(() => {
    const usedFolderIds = new Set(projectFiles.map((f) => f.folderId).filter(Boolean))
    // Include ancestor folders so the tree renders correctly
    const result = new Set<string>()
    usedFolderIds.forEach((id) => {
      let current = folders.find((f) => f.id === id)
      while (current) {
        result.add(current.id)
        current = folders.find((f) => f.id === current?.parentId)
      }
    })
    return folders.filter((f) => result.has(f.id))
  }, [folders, projectFiles])

  // Apply folder + search filters
  const filteredFiles = useMemo(() => {
    return projectFiles.filter((file) => {
      const matchesFolder =
        selectedFolderId === undefined || file.folderId === selectedFolderId
      const matchesSearch =
        !searchQuery.trim() ||
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFolder && matchesSearch
    })
  }, [projectFiles, selectedFolderId, searchQuery])

  // Breadcrumbs
  const breadcrumbs = useMemo((): { id?: string; name: string }[] => {
    if (!selectedFolderId) return [{ name: "Todos los archivos" }]
    const crumbs: { id?: string; name: string }[] = []
    let current = folders.find((f) => f.id === selectedFolderId)
    while (current) {
      crumbs.unshift({ id: current.id, name: current.name })
      current = folders.find((f) => f.id === current?.parentId)
    }
    crumbs.unshift({ name: "Todos los archivos" })
    return crumbs
  }, [selectedFolderId, folders])

  return (
    <div className="flex h-full">
      {/* Left sidebar — folder tree */}
      <FolderTree
        folders={relevantFolders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={() => {}}
      />

      {/* Right content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="border-b border-zinc-800 bg-zinc-900/30 p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-zinc-600" />}
                  <button
                    onClick={() => setSelectedFolderId(crumb.id)}
                    className={`hover:text-white transition-colors ${
                      index === breadcrumbs.length - 1
                        ? "text-white font-medium"
                        : "text-zinc-400"
                    }`}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowUploader(true)}
                size="sm"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Subir archivo
              </Button>
              <Button
                onClick={() => setShowLinkModal(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Link2 className="h-4 w-4" />
                Vincular existente
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* File table */}
        <div className="flex-1 overflow-auto p-4">
          <FileTable
            files={filteredFiles}
            projects={projects}
            onDelete={onDeleteFile}
            onRename={onRenameFile}
            onLinkToProject={(fileId) => onUnlinkFile(fileId, projectId)}
            onDownload={onDownloadFile}
          />
        </div>
      </div>

      {/* Upload modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <h3 className="font-semibold text-lg">Subir archivos</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Los archivos se vincularán automáticamente a este proyecto
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploader(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-5">
              <FileUploader
                projectId={projectId}
                onUploadComplete={() => setShowUploader(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Link modal */}
      <LinkToProjectModal
        open={showLinkModal}
        files={files}
        folders={folders}
        projects={projects}
        currentProjectId={projectId}
        onClose={() => setShowLinkModal(false)}
        onLink={onLinkFiles}
      />
    </div>
  )
}
