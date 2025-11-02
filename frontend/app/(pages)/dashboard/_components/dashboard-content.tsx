"use client";

import { useEffect, useState } from "react";
import { getDashboardMetrics, DashboardMetrics } from "@/app/actions/dashboard";
import { MetricsCard } from "./metrics-card";
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  CircleDashed,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      const data = await getDashboardMetrics();
      setMetrics(data);
      setIsLoading(false);
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Não foi possível carregar as métricas do dashboard
        </p>
      </div>
    );
  }

  const totalTasks =
    metrics.tasksPending +
    metrics.tasksInProgress +
    metrics.tasksCompleted +
    metrics.tasksCancelled;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Pendentes"
          value={metrics.tasksPending}
          icon={CircleDashed}
          description="Aguardando início"
          className="border-l-4 border-l-gray-400"
        />
        <MetricsCard
          title="Em Progresso"
          value={metrics.tasksInProgress}
          icon={PlayCircle}
          description="Tarefas em andamento"
          className="border-l-4 border-l-blue-500"
        />
        <MetricsCard
          title="Concluídas"
          value={metrics.tasksCompleted}
          icon={CheckCircle2}
          description="Tarefas finalizadas"
          className="border-l-4 border-l-green-500"
        />
        <MetricsCard
          title="Canceladas"
          value={metrics.tasksCancelled}
          icon={XCircle}
          description="Tarefas canceladas"
          className="border-l-4 border-l-red-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricsCard
          title="Atrasadas"
          value={metrics.tasksOverdue}
          icon={AlertCircle}
          description="Tarefas vencidas não concluídas"
          className="border-l-4 border-l-orange-500"
        />
        <MetricsCard
          title="Concluídas no Prazo"
          value={metrics.tasksCompletedOnTime}
          icon={Clock}
          description="Finalizadas dentro do deadline"
          className="border-l-4 border-l-emerald-500"
        />
        <MetricsCard
          title="Taxa de Conclusão"
          value={metrics.completionRatePercentage}
          icon={TrendingUp}
          description={`${metrics.completionRatePercentage}% das tarefas concluídas`}
          className="border-l-4 border-l-purple-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total de Tarefas</span>
                <span className="font-semibold">{totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all"
                  style={{
                    width: `${
                      totalTasks > 0
                        ? (metrics.tasksCompleted / totalTasks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">
                  {metrics.tasksPending}
                </div>
                <div className="text-xs text-gray-600">Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {metrics.tasksInProgress}
                </div>
                <div className="text-xs text-gray-600">Em Progresso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {metrics.tasksCompleted}
                </div>
                <div className="text-xs text-gray-600">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {metrics.tasksCancelled}
                </div>
                <div className="text-xs text-gray-600">Canceladas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
