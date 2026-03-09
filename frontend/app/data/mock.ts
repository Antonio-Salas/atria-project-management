import { Project, Task, Folder, File, CollaboratorUser } from "../types";

export const projects: Project[] = [
  {
    id: "1",
    name: "PARQUE CHACON 1",
    status: "in-progress",
    startDate: "2026-01-10",
    endDate: "2026-03-15",
    client: "Gobierno Municipal",
    description: "Rehabilitación de parque urbano zona norte."
  },
  {
    id: "2",
    name: "RAUL BERBER COUTIÑO",
    status: "in-progress",
    startDate: "2026-02-01",
    endDate: "2026-04-20",
    client: "Privado",
    description: "Desarrollo habitacional."
  },
  {
    id: "3",
    name: "CANCHA Y FORO CULTURAL",
    status: "completed",
    startDate: "2025-11-05",
    endDate: "2026-01-30",
    client: "Comité Vecinal",
    description: "Construcción de cancha de usos múltiples."
  },
  {
    id: "4",
    name: "UNIDAD DEPORTIVA 2 CARLOS",
    status: "in-progress",
    startDate: "2026-01-20",
    endDate: "2026-05-10",
    client: "Gobierno Estatal",
    description: "Ampliación de unidad deportiva."
  },
  {
    id: "5",
    name: "PARQUE RINCONADAS DE LOS ANGELES",
    status: "pending",
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    client: "Constructora X",
    description: "Nuevo parque residencial."
  },
  {
    id: "6",
    name: "PARQUE LA PILA",
    status: "in-progress",
    startDate: "2026-02-05",
    endDate: "2026-04-15",
    client: "Ayuntamiento",
    description: "Mantenimiento general."
  },
  {
    id: "7",
    name: "CAMPESTRE VILLAS DEL ALAMO",
    status: "completed",
    startDate: "2025-10-15",
    endDate: "2026-01-25",
    client: "Asociación de Colonos",
    description: "Pavimentación y áreas verdes."
  },
  {
    id: "8",
    name: "PARQUE COLINAS DE PLATA",
    status: "pending",
    startDate: "2026-03-10",
    endDate: "2026-05-20",
    client: "Inmobiliaria Z",
    description: "Jardinería y alumbrado."
  },
  {
    id: "9",
    name: "PARQUE APEPELCO",
    status: "in-progress",
    startDate: "2026-02-12",
    endDate: "2026-04-30",
    client: "Comunidad Rural",
    description: "Construcción de kiosco."
  },
  {
    id: "10",
    name: "PARQUE FRACCIONAMIENTO RINCONADAS DE SAN FRANCISCO",
    status: "pending",
    startDate: "2026-04-01",
    endDate: "2026-07-15",
    client: "Constructora Y",
    description: "Obra nueva."
  }
];

export const tasks: Task[] = [
  {
    id: "101",
    title: "REVISIÓN GENERAL",
    status: "todo",
    date: "2026-02-11T09:32:00",
    priority: "urgent",
    projectId: "5"
  },
  {
    id: "102",
    title: "ENTREGA",
    status: "todo",
    date: "2026-02-11T09:37:00",
    priority: "medium",
    projectId: "6"
  },
  {
    id: "103",
    title: "REVISAR ESTADO",
    status: "todo",
    date: "2026-02-11T09:21:00",
    priority: "medium",
    projectId: "9"
  },
  {
    id: "104",
    title: "New page",
    status: "in-progress",
    date: "2026-02-12T10:00:00",
    priority: "low",
    projectId: "2"
  },
  // Calendar tasks can be same or derived
];

export const folders: Folder[] = [
  {
    id: "f1",
    name: "Contratos",
    createdAt: "2026-01-05T10:00:00"
  },
  {
    id: "f2",
    name: "Planos",
    createdAt: "2026-01-06T10:00:00"
  },
  {
    id: "f3",
    name: "Fotos",
    createdAt: "2026-01-07T10:00:00"
  },
  {
    id: "f4",
    name: "Presupuestos",
    createdAt: "2026-01-08T10:00:00"
  },
  {
    id: "f5",
    name: "Legal",
    parentId: "f1",
    createdAt: "2026-01-10T10:00:00"
  }
];

export const files: File[] = [
  {
    id: "file1",
    name: "Contrato_ParqueChacon.pdf",
    folderId: "f1",
    type: "application/pdf",
    size: 2450000,
    uploadedBy: "Juan Pérez",
    uploadedAt: "2026-01-10T14:30:00",
    status: "ready",
    projectIds: ["1"]
  },
  {
    id: "file2",
    name: "Contrato_RaulBerber.pdf",
    folderId: "f1",
    type: "application/pdf",
    size: 1850000,
    uploadedBy: "María García",
    uploadedAt: "2026-02-01T09:15:00",
    status: "ready",
    projectIds: ["2"]
  },
  {
    id: "file3",
    name: "Plano_Arquitectonico_ParqueChacon.dwg",
    folderId: "f2",
    type: "application/acad",
    size: 5200000,
    uploadedBy: "Carlos Ruiz",
    uploadedAt: "2026-01-12T11:45:00",
    status: "ready",
    projectIds: ["1"]
  },
  {
    id: "file4",
    name: "Plano_Estructural_UD2Carlos.dwg",
    folderId: "f2",
    type: "application/acad",
    size: 4800000,
    uploadedBy: "Ana López",
    uploadedAt: "2026-01-22T16:20:00",
    status: "ready",
    projectIds: ["4"]
  },
  {
    id: "file5",
    name: "Foto_Avance_1.jpg",
    folderId: "f3",
    type: "image/jpeg",
    size: 3200000,
    uploadedBy: "Pedro Martínez",
    uploadedAt: "2026-02-15T10:00:00",
    status: "ready",
    projectIds: ["1", "6"]
  },
  {
    id: "file6",
    name: "Foto_Avance_2.jpg",
    folderId: "f3",
    type: "image/jpeg",
    size: 2900000,
    uploadedBy: "Pedro Martínez",
    uploadedAt: "2026-02-16T14:30:00",
    status: "ready",
    projectIds: ["1"]
  },
  {
    id: "file7",
    name: "Presupuesto_ParqueRinconadas.xlsx",
    folderId: "f4",
    type: "application/vnd.ms-excel",
    size: 450000,
    uploadedBy: "Laura Sánchez",
    uploadedAt: "2026-02-10T09:00:00",
    status: "ready",
    projectIds: ["5"]
  },
  {
    id: "file8",
    name: "Acuerdo_Legal.pdf",
    folderId: "f5",
    type: "application/pdf",
    size: 890000,
    uploadedBy: "Roberto Torres",
    uploadedAt: "2026-01-15T13:20:00",
    status: "ready",
    projectIds: ["1", "2"]
  },
  {
    id: "file9",
    name: "Nota_Tecnica.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 150000,
    uploadedBy: "Sofia Ramírez",
    uploadedAt: "2026-02-17T11:30:00",
    status: "ready",
    projectIds: []
  },
  {
    id: "file10",
    name: "Memoria_Calculo.pdf",
    type: "application/pdf",
    size: 1200000,
    uploadedBy: "Diego Fernández",
    uploadedAt: "2026-02-18T08:45:00",
    status: "ready",
    projectIds: []
  }
];

export const collaboratorUsers: CollaboratorUser[] = [
  {
    id: "u1",
    name: "Antonio Reyes",
    email: "antonio@atria.com",
    projectIds: ["1", "2", "4", "6", "9"],
    invitedAt: "2026-01-15T09:00:00"
  },
  {
    id: "u2",
    name: "Daniela Montoya",
    email: "daniela@atria.com",
    projectIds: ["3", "5", "7"],
    invitedAt: "2026-01-20T11:30:00"
  },
  {
    id: "u3",
    name: "Carlos Vega",
    email: "carlos@atria.com",
    projectIds: ["1", "8"],
    invitedAt: "2026-02-01T08:15:00"
  },
  {
    id: "u4",
    name: "Sofía Herrera",
    email: "sofia@atria.com",
    projectIds: ["2", "4", "6"],
    invitedAt: "2026-02-05T14:00:00"
  },
  {
    id: "u5",
    name: "Miguel Ángel Torres",
    email: "miguel@atria.com",
    projectIds: [],
    invitedAt: "2026-02-18T16:45:00"
  }
];

