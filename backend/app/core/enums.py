from enum import StrEnum


class ProjectStatus(StrEnum):
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class TaskStatus(StrEnum):
    TODO = "todo"
    IN_PROGRESS = "in-progress"
    DONE = "done"


class TaskPriority(StrEnum):
    URGENT = "urgent"
    MEDIUM = "medium"
    LOW = "low"


class FileStatus(StrEnum):
    PENDING = "pending"
    UPLOADING = "uploading"
    READY = "ready"
    ERROR = "error"


class CollaboratorStatus(StrEnum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REVOKED = "revoked"
