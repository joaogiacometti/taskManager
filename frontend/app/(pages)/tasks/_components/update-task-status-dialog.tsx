"use client";

import { ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { updateTaskStatus } from "@/app/actions/tasks";
import { TaskStatus, taskStatusLabels } from "@/app/types/task";
import { toast } from "sonner";

interface UpdateTaskStatusDialogProps {
  taskId: number;
  currentStatus: TaskStatus;
  onStatusUpdated?: () => void;
  children: ReactNode;
}

const getAvailableStatuses = (currentStatus: TaskStatus): TaskStatus[] => {
  switch (currentStatus) {
    case TaskStatus.Pending:
      return [TaskStatus.Pending, TaskStatus.InProgress];
    case TaskStatus.InProgress:
      return [TaskStatus.InProgress, TaskStatus.Completed];
    case TaskStatus.Completed:
      return [TaskStatus.Completed];
    case TaskStatus.Cancelled:
      return [TaskStatus.Cancelled];
    default:
      return [currentStatus];
  }
};

export const UpdateTaskStatusDialog = ({
  taskId,
  currentStatus,
  onStatusUpdated,
  children,
}: UpdateTaskStatusDialogProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const availableStatuses = getAvailableStatuses(currentStatus);

  const handleStatusChange = async (value: string) => {
    setIsUpdating(true);
    try {
      const newStatus = Number(value) as TaskStatus;
      const result = await updateTaskStatus(taskId, newStatus);

      if (result.success) {
        toast.success("Status atualizado com sucesso!");
        onStatusUpdated?.();
      } else {
        toast.error(result.error || "Erro ao atualizar status");
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={currentStatus.toString()}
      onValueChange={handleStatusChange}
      disabled={isUpdating || currentStatus === TaskStatus.Completed}
    >
      <SelectTrigger className="w-fit border-0 focus:ring-0 p-0 h-auto gap-0">
        {children}
      </SelectTrigger>
      <SelectContent>
        {availableStatuses.map((status) => (
          <SelectItem key={status} value={status.toString()}>
            {taskStatusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
