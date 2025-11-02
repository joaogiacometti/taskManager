export interface DashboardMetrics {
  tasksPending: number;
  tasksInProgress: number;
  tasksCompleted: number;
  tasksCancelled: number;
  tasksOverdue: number;
  tasksCompletedOnTime: number;
  completionRatePercentage: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics | null> {
  const res = await fetch("/api/dashboard/metricas", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (res.ok) {
    const metrics = await res.json();
    return metrics;
  }

  return null;
}
