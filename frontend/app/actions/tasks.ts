import { Task, TaskStatus } from "../types/task";

export interface TaskFilters {
  projectId?: number;
  status?: TaskStatus;
  responsibleUserId?: string;
  deadlineBefore?: string;
}

export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams();

  if (filters?.projectId) {
    params.append("projectId", filters.projectId.toString());
  }
  if (filters?.status !== undefined) {
    params.append("status", filters.status.toString());
  }
  if (filters?.responsibleUserId) {
    params.append("responsibleUserId", filters.responsibleUserId);
  }
  if (filters?.deadlineBefore) {
    params.append("deadlineBefore", filters.deadlineBefore);
  }

  const queryString = params.toString();
  const url = queryString ? `/api/tarefas?${queryString}` : "/api/tarefas";

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 204) {
    return [];
  }

  if (res.ok) {
    const tasks = await res.json();
    return tasks;
  }

  return [];
}

export async function createTask(data: {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number;
  projectId: number;
  responsibleUserId?: string;
  deadline?: string;
}): Promise<{ success: boolean; error?: string; task?: Task }> {
  const res = await fetch("/api/tarefas", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      projectId: data.projectId,
      responsibleUserId: data.responsibleUserId || null,
      deadline: data.deadline || null,
    }),
  });

  if (res.ok) {
    const task = await res.json();
    return { success: true, task };
  }

  const errorData = await res.json().catch(() => ({}));
  return {
    success: false,
    error: errorData.message || "Erro ao criar tarefa",
  };
}

export async function updateTask(
  id: number,
  data: {
    title: string;
    description?: string;
    priority: number;
    responsibleUserId?: string;
    deadline?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`/api/tarefas/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      responsibleUserId: data.responsibleUserId || null,
      deadline: data.deadline || null,
    }),
  });

  if (res.ok || res.status === 204) {
    return { success: true };
  }

  const errorData = await res.json().catch(() => ({}));
  return {
    success: false,
    error: errorData.message || "Erro ao atualizar tarefa",
  };
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`/api/tarefas/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (res.ok || res.status === 204) {
    return { success: true };
  }

  const errorData = await res.json().catch(() => ({}));
  return {
    success: false,
    error: errorData.message || "Erro ao atualizar status",
  };
}

export async function deleteTask(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`/api/tarefas/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.ok || res.status === 204) {
    return { success: true };
  }

  const errorData = await res.json().catch(() => ({}));
  return {
    success: false,
    error: errorData.message || "Erro ao deletar tarefa",
  };
}
