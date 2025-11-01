"use client";

import { useState } from "react";
import { TaskFilters } from "./_components/task-filters";
import { TaskFilters as TaskFiltersType } from "@/app/actions/tasks";
import { Navigation } from "@/components/navigation";
import { CreateTaskDialog } from "./_components/create-task-dialog";
import { TasksList } from "./_components/tasks-list";

export default function TasksPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [sortBy, setSortBy] = useState<"deadline" | "priority" | "status">(
    "deadline"
  );

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
            <p className="text-gray-600 mt-1">
              Gerencie suas tarefas e acompanhe o progresso
            </p>
          </div>
          <CreateTaskDialog onTaskCreated={handleTaskCreated} />
        </div>

        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <TasksList
          onRefresh={refreshKey}
          filters={filters}
          sortBy={sortBy}
          onTaskUpdated={handleTaskCreated}
        />
      </div>
    </div>
  );
}
