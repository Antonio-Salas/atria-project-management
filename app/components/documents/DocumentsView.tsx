"use client"

import { useState } from "react"
import { File, Folder, Project } from "@/app/types"
import { FolderTree } from "./FolderTree"
import { FileTable } from "./FileTable"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Upload, FolderPlus, Search, ChevronRight } from "lucide-react"

interface DocumentsViewProps {
  files: File[]
  folders: Folder[]
  projects: Project[]
  onCreateFolder: (parentId?: string) => void
  onUploadFile: () => void
  onDeleteFile: (fileId: string) => void
  onRenameFile: (fileId: string) => void
  onLinkToProject: (fileId: string) => void
  onDownloadFile: (fileId: string) => void
}

export function DocumentsView({
  files,
  folders,
  projects,
  onCreateFolder,
  onUploadFile,
  onDeleteFile,
  onRenameFile,
  onLinkToProject,
  onDownloadFile
}: DocumentsViewProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFiles = files.filter((file) => {
    const matchesFolder =
      selectedFolderId === undefined || file.folderId === selectedFolderId
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const getBreadcrumbs = (): { id?: string; name: string }[] => {
    if (!selectedFolderId) {
      return [{ name: "Todos los archivos" }]
    }

    const breadcrumbs: { id?: string; name: string }[] = []
    let currentFolder = folders.find((f) => f.id === selectedFolderId)

    while (currentFolder) {
      breadcrumbs.unshift({ id: currentFolder.id, name: currentFolder.name })
      currentFolder = folders.find((f) => f.id === currentFolder?.parentId)
    }

    breadcrumbs.unshift({ name: "Todos los archivos" })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="flex h-full">
      <FolderTree
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={onCreateFolder}
      />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
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
              <Button onClick={onUploadFile} size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Subir archivo
              </Button>
              <Button
                onClick={() => onCreateFolder(selectedFolderId)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                Nueva carpeta
              </Button>
            </div>
          </div>

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
        </div>

        {/* File Table */}
        <div className="flex-1 overflow-auto p-4">
          <FileTable
            files={filteredFiles}
            projects={projects}
            onDelete={onDeleteFile}
            onRename={onRenameFile}
            onLinkToProject={onLinkToProject}
            onDownload={onDownloadFile}
          />
        </div>
      </div>
    </div>
  )
}
