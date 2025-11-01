export enum TaskStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Urgent = 3,
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  responsibleUserId?: string;
  createdAt: string;
  deadline?: string;
  finishedAt?: string;
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: "Pendente",
  [TaskStatus.InProgress]: "Em Progresso",
  [TaskStatus.Completed]: "Concluída",
  [TaskStatus.Cancelled]: "Cancelada",
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.Low]: "Baixa",
  [TaskPriority.Medium]: "Média",
  [TaskPriority.High]: "Alta",
  [TaskPriority.Urgent]: "Urgente",
};
