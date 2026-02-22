"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { FileStatus } from "@/app/types"

interface UploadingFile {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
}

interface FileUploaderProps {
  folderId?: string
  projectId?: string
  onUploadComplete?: (fileId: string) => void
  onClose?: () => void
}

export function FileUploader({
  folderId,
  projectId,
  onUploadComplete,
  onClose
}: FileUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles: UploadingFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: "pending" as FileStatus,
      progress: 0
    }))

    setUploadingFiles((prev) => [...prev, ...newFiles])

    // Simulate upload for each file
    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id)
    })
  }, [])

  const simulateUpload = async (fileId: string) => {
    // Update status to uploading
    setUploadingFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" as FileStatus } : f))
    )

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
      )
    }

    // Update to processing
    setUploadingFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "processing" as FileStatus } : f))
    )

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update to ready
    setUploadingFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "ready" as FileStatus } : f))
    )

    if (onUploadComplete) {
      onUploadComplete(fileId)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles]
  )

  const removeFile = (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "pending" as FileStatus, progress: 0, error: undefined } : f
      )
    )
    simulateUpload(fileId)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "uploading":
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Upload className="h-5 w-5 text-zinc-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-700 hover:border-zinc-600"
        }`}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-zinc-500" />
        <p className="text-lg font-medium mb-2">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-sm text-zinc-500 mb-4">
          Soporta múltiples archivos. Tamaño máximo 50MB por archivo.
        </p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Seleccionar archivos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">
            Archivos ({uploadingFiles.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadingFiles.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3"
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(uploadFile.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <span className="text-xs text-zinc-500 ml-2">
                        {formatFileSize(uploadFile.file.size)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {(uploadFile.status === "uploading" ||
                      uploadFile.status === "processing") && (
                      <div className="mb-2">
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          {uploadFile.status === "uploading"
                            ? `Subiendo ${uploadFile.progress}%`
                            : "Procesando..."}
                        </p>
                      </div>
                    )}

                    {/* Status Messages */}
                    {uploadFile.status === "ready" && (
                      <p className="text-xs text-green-500">Subido correctamente</p>
                    )}
                    {uploadFile.status === "error" && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-red-500">
                          {uploadFile.error || "Error al subir archivo"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retryUpload(uploadFile.id)}
                          className="h-6 text-xs"
                        >
                          Reintentar
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
