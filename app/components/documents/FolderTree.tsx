"use client"

import { Folder } from "@/app/types"
import { Folder as FolderIcon, ChevronRight, ChevronDown, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"

interface FolderTreeProps {
  folders: Folder[]
  selectedFolderId?: string
  onSelectFolder: (folderId?: string) => void
  onCreateFolder: (parentId?: string) => void
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const rootFolders = folders.filter((f) => !f.parentId)
  const getChildFolders = (parentId: string) => folders.filter((f) => f.parentId === parentId)

  const renderFolder = (folder: Folder, level: number = 0) => {
    const hasChildren = folders.some((f) => f.parentId === folder.id)
    const isExpanded = expandedFolders.has(folder.id)
    const isSelected = selectedFolderId === folder.id

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/50 rounded-md transition-colors ${
            isSelected ? "bg-zinc-800" : ""
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => onSelectFolder(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
              className="p-0 h-4 w-4"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <FolderIcon className="h-4 w-4 text-blue-400" />
          <span className="text-sm flex-1">{folder.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {getChildFolders(folder.id).map((child) => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-300">Carpetas</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCreateFolder()}
          className="h-7 w-7 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800/50 rounded-md mb-2 transition-colors ${
          !selectedFolderId ? "bg-zinc-800" : ""
        }`}
        onClick={() => onSelectFolder(undefined)}
      >
        <FolderIcon className="h-4 w-4 text-zinc-400" />
        <span className="text-sm">Todos los archivos</span>
      </div>

      <div className="space-y-1">
        {rootFolders.map((folder) => renderFolder(folder))}
      </div>
    </div>
  )
}
