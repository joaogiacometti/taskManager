"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { createTask } from "@/app/actions/tasks";
import { TaskStatus, TaskPriority } from "@/app/types/task";
import { getProjects } from "@/app/actions/projects";
import { Project } from "@/app/types/project";
import { getUsers } from "@/app/actions/users";
import { User } from "@/app/types/user";

const createTaskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
  projectId: z.number().min(1, "Selecione um projeto"),
  priority: z.number(),
  responsibleUserId: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: "O prazo não pode ser no passado" }
    ),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskDialogProps {
  onTaskCreated?: () => void;
}

export const CreateTaskDialog = ({ onTaskCreated }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [selectedPriority, setSelectedPriority] = useState<number>(
    TaskPriority.Medium
  );
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: TaskPriority.Medium,
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    setValue("projectId", selectedProjectId);
  }, [selectedProjectId, setValue]);

  useEffect(() => {
    setValue("priority", selectedPriority);
  }, [selectedPriority, setValue]);

  useEffect(() => {
    setValue("responsibleUserId", selectedUserId || undefined);
  }, [selectedUserId, setValue]);

  const onSubmit = async (data: CreateTaskFormData) => {
    setIsSubmitting(true);
    try {
      const deadlineDateTime = data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined;

      const result = await createTask({
        ...data,
        status: TaskStatus.Pending,
        deadline: deadlineDateTime,
        responsibleUserId: data.responsibleUserId || undefined,
      });

      if (result.success) {
        toast.success("Tarefa criada com sucesso!");
        setOpen(false);
        reset();
        setSelectedProjectId(0);
        setSelectedPriority(TaskPriority.Medium);
        setSelectedUserId("");
        onTaskCreated?.();
      } else {
        toast.error(result.error || "Erro ao criar tarefa");
      }
    } catch (error) {
      toast.error("Erro ao criar tarefa");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha as informações da tarefa abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Título da tarefa"
                {...register("title")}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição da tarefa (opcional)"
                rows={3}
                {...register("description")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">Projeto *</Label>
              <Select
                value={selectedProjectId.toString()}
                onValueChange={(value) => setSelectedProjectId(Number(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      <span className="block truncate max-w-[18rem]">
                        {project.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-red-500">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={selectedPriority.toString()}
                onValueChange={(value) => setSelectedPriority(Number(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.Low.toString()}>
                    Baixa
                  </SelectItem>
                  <SelectItem value={TaskPriority.Medium.toString()}>
                    Média
                  </SelectItem>
                  <SelectItem value={TaskPriority.High.toString()}>
                    Alta
                  </SelectItem>
                  <SelectItem value={TaskPriority.Urgent.toString()}>
                    Urgente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibleUserId">Responsável</Label>
              <Select
                value={selectedUserId || "none"}
                onValueChange={(value) =>
                  setSelectedUserId(value === "none" ? "" : value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <span className="block truncate max-w-[18rem]">
                        {user.userName}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo</Label>
              <Input
                id="deadline"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("deadline")}
                disabled={isSubmitting}
              />
              {errors.deadline && (
                <p className="text-sm text-red-500">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Tarefa"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
