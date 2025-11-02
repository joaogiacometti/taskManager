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
import { Pencil } from "lucide-react";
import { updateTask } from "@/app/actions/tasks";
import { Task, TaskPriority } from "@/app/types/task";
import { getUsers } from "@/app/actions/users";
import { User } from "@/app/types/user";

const updateTaskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().optional(),
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

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;

interface UpdateTaskDialogProps {
  task: Task;
  onTaskUpdated?: () => void;
}

export const UpdateTaskDialog = ({
  task,
  onTaskUpdated,
}: UpdateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<number>(
    task.priority
  );
  const [selectedUserId, setSelectedUserId] = useState<string>(
    task.responsibleUserId || ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      responsibleUserId: task.responsibleUserId || "",
      deadline: task.deadline
        ? new Date(task.deadline).toISOString().slice(0, 10)
        : "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (open) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        responsibleUserId: task.responsibleUserId || "",
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().slice(0, 10)
          : "",
      });
      setSelectedPriority(task.priority);
      setSelectedUserId(task.responsibleUserId || "");
    }
  }, [open, task, reset]);

  useEffect(() => {
    setValue("priority", selectedPriority);
  }, [selectedPriority, setValue]);

  useEffect(() => {
    setValue("responsibleUserId", selectedUserId || undefined);
  }, [selectedUserId, setValue]);

  const onSubmit = async (data: UpdateTaskFormData) => {
    setIsSubmitting(true);
    try {
      const deadlineDateTime = data.deadline
        ? new Date(data.deadline).toISOString()
        : undefined;

      const result = await updateTask(task.id, {
        ...data,
        deadline: deadlineDateTime,
        responsibleUserId: data.responsibleUserId || undefined,
      });

      if (result.success) {
        toast.success("Tarefa atualizada com sucesso!");
        setOpen(false);
        onTaskUpdated?.();
      } else {
        toast.error(result.error || "Erro ao atualizar tarefa");
      }
    } catch (error) {
      toast.error("Erro ao atualizar tarefa");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Atualize as informações da tarefa abaixo.
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
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
