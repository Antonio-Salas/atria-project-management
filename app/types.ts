export type ProjectStatus = "completed" | "in-progress" | "pending";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  client: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  date: string;
  priority: "urgent" | "medium" | "low";
  projectId?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export type FileStatus = "pending" | "uploading" | "processing" | "ready" | "error";

export interface File {
  id: string;
  name: string;
  folderId?: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  status: FileStatus;
  projectIds: string[];
}

export interface CollaboratorUser {
  id: string;
  name: string;
  email: string;
  projectIds: string[];
  invitedAt: string;
}
