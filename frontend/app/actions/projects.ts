import { Project } from "../types/project";
import z from "zod";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch("/api/projetos", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 204) {
    return [];
  }

  if (res.ok) {
    const projects = await res.json();
    return projects;
  }

  return [];
}

export async function createProject(data: {
  name: string;
  description?: string;
}): Promise<{ success: boolean; error?: string; project?: Project }> {
  const createProjectSchema = z.object({
    name: z.string().max(200, "Nome deve ter no máximo 200 caracteres."),
    description: z
      .string()
      .max(2000, "Descrição deve ter no máximo 2000 caracteres.")
      .optional()
      .nullable(),
  });

  const parsed = createProjectSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const message = first?.message || "Dados inválidos";
    return { success: false, error: message };
  }
  const res = await fetch("/api/projetos", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description || null,
    }),
  });

  if (res.ok) {
    const project = await res.json();
    return { success: true, project };
  }

  const errorData = await res.json();
  return {
    success: false,
    error: errorData.message || "Erro ao criar projeto",
  };
}

export async function updateProject(
  id: number,
  data: {
    name: string;
    description?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const updateProjectSchema = z.object({
    name: z.string().max(200, "Nome deve ter no máximo 200 caracteres."),
    description: z
      .string()
      .max(2000, "Descrição deve ter no máximo 2000 caracteres.")
      .optional()
      .nullable(),
  });

  const parsed = updateProjectSchema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const message = first?.message || "Dados inválidos";
    return { success: false, error: message };
  }
  const res = await fetch(`/api/projetos/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description || null,
    }),
  });

  if (res.ok || res.status === 204) {
    return { success: true };
  }

  if (res.status === 401) {
    return {
      success: false,
      error: "Não autorizado. Por favor, faça login novamente.",
    };
  }

  if (res.status === 404) {
    return {
      success: false,
      error: "Projeto não encontrado.",
    };
  }

  const errorData = await res.json().catch(() => ({}));

  if (errorData.errors && Array.isArray(errorData.errors)) {
    return {
      success: false,
      error: errorData.errors[0] || "Erro ao atualizar projeto",
    };
  }

  return {
    success: false,
    error: errorData.message || "Erro ao atualizar projeto",
  };
}

export async function deleteProject(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`/api/projetos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.ok || res.status === 204) {
    return { success: true };
  }

  if (res.status === 401) {
    return {
      success: false,
      error: "Não autorizado. Por favor, faça login novamente.",
    };
  }

  if (res.status === 404) {
    return {
      success: false,
      error: "Projeto não encontrado.",
    };
  }

  const errorData = await res.json().catch(() => ({}));

  if (errorData.errors && Array.isArray(errorData.errors)) {
    return {
      success: false,
      error: errorData.errors[0] || "Erro ao deletar projeto",
    };
  }

  return {
    success: false,
    error: errorData.message || "Erro ao deletar projeto",
  };
}
