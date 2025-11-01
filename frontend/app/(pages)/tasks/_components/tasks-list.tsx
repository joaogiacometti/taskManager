"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { getTasks, TaskFilters } from "@/app/actions/tasks";
import {
  Task,
  TaskStatus,
  TaskPriority,
  taskStatusLabels,
  taskPriorityLabels,
} from "@/app/types/task";
import { toast } from "sonner";
import { UpdateTaskStatusDialog } from "./update-task-status-dialog";
import { UpdateTaskDialog } from "./update-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";

interface TasksListProps {
  onRefresh?: number;
  filters: TaskFilters;
  sortBy: "deadline" | "priority" | "status";
  onTaskUpdated?: () => void;
}

export const TasksList = ({
  onRefresh,
  filters,
  sortBy,
  onTaskUpdated,
}: TasksListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getTasks(filters);
      setTasks(sortTasks(data, sortBy));
    } catch {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [onRefresh, filters]);

  useEffect(() => {
    setTasks((prev) => sortTasks([...prev], sortBy));
  }, [sortBy]);

  const sortTasks = (
    tasksToSort: Task[],
    sort: "deadline" | "priority" | "status"
  ): Task[] => {
    return [...tasksToSort].sort((a, b) => {
      if (sort === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sort === "priority") {
        return b.priority - a.priority;
      }
      if (sort === "status") {
        return a.status - b.status;
      }
      return 0;
    });
  };

  const isOverdue = (task: Task): boolean => {
    if (!task.deadline || task.status === TaskStatus.Completed) return false;
    return new Date(task.deadline) < new Date();
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Pending:
        return "bg-gray-100 text-gray-800";
      case TaskStatus.InProgress:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.Completed:
        return "bg-green-100 text-green-800";
      case TaskStatus.Cancelled:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.Low:
        return "bg-gray-100 text-gray-800";
      case TaskPriority.Medium:
        return "bg-yellow-100 text-yellow-800";
      case TaskPriority.High:
        return "bg-orange-100 text-orange-800";
      case TaskPriority.Urgent:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white rounded-lg shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-700">
            Nenhuma tarefa encontrada
          </h3>
          <p className="text-gray-500">
            Crie uma nova tarefa ou ajuste os filtros
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className={isOverdue(task) ? "bg-red-50" : ""}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {task.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {task.status === TaskStatus.Completed ? (
                  <Badge className={getStatusColor(task.status)}>
                    {taskStatusLabels[task.status]}
                  </Badge>
                ) : (
                  <UpdateTaskStatusDialog
                    taskId={task.id}
                    currentStatus={task.status}
                    onStatusUpdated={fetchTasks}
                  >
                    <Badge
                      className={`${getStatusColor(
                        task.status
                      )} cursor-pointer hover:opacity-80`}
                    >
                      {taskStatusLabels[task.status]}
                    </Badge>
                  </UpdateTaskStatusDialog>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.priority)}>
                  {taskPriorityLabels[task.priority]}
                </Badge>
              </TableCell>
              <TableCell>
                {task.deadline ? (
                  <span
                    className={
                      isOverdue(task) ? "text-red-600 font-semibold" : ""
                    }
                  >
                    {new Date(task.deadline).toLocaleDateString("pt-BR")}
                  </span>
                ) : (
                  <span className="text-gray-400">Sem prazo</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <UpdateTaskDialog task={task} onTaskUpdated={fetchTasks} />
                  <DeleteTaskDialog
                    taskId={task.id}
                    taskTitle={task.title}
                    onTaskDeleted={fetchTasks}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
