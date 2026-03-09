"use client"

import { useAppData } from "@/app/context/AppDataContext"
import { DocumentsView } from "@/app/components/documents/DocumentsView"

export default function DocumentsPage() {
  const {
    files,
    folders,
    projects,
    handleCreateFolder,
    handleUploadFile,
    handleDeleteFile,
    handleRenameFile,
    handleDownloadFile,
  } = useAppData()

  return (
    <div className="h-[calc(100vh-8rem)]">
      <DocumentsView
        files={files}
        folders={folders}
        projects={projects}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleUploadFile}
        onDeleteFile={handleDeleteFile}
        onRenameFile={handleRenameFile}
        onLinkToProject={() => alert("Modal para vincular archivo a proyecto - en desarrollo")}
        onDownloadFile={handleDownloadFile}
      />
    </div>
  )
}
