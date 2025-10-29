using Communication.Responses;
using Domain.Repositories.Tasks;

namespace Application.UseCases.Dashboards.Metrics;

public class DashboardMetricsUseCase(ITaskReadOnlyRepository taskReadOnlyRepository) : IDashboardMetricsUseCase
{
    public async Task<ResponseDashboardMetrics> Execute()
    {
        var allTasks = await taskReadOnlyRepository.GetAll();
        var now = DateTime.UtcNow;

        var tasksPending = allTasks.Count(t => t.Status == Domain.Enums.TaskStatus.Pending);
        var tasksInProgress = allTasks.Count(t => t.Status == Domain.Enums.TaskStatus.InProgress);
        var tasksCompleted = allTasks.Count(t => t.Status == Domain.Enums.TaskStatus.Completed);
        var tasksCancelled = allTasks.Count(t => t.Status == Domain.Enums.TaskStatus.Cancelled);

        var tasksOverdue = allTasks.Count(t => 
            t.Status != Domain.Enums.TaskStatus.Completed && 
            t.Status != Domain.Enums.TaskStatus.Cancelled &&
            t.Deadline.HasValue && 
            t.Deadline.Value < now);

        var tasksCompletedOnTime = allTasks.Count(t => 
            t.Status == Domain.Enums.TaskStatus.Completed &&
            t.Deadline.HasValue &&
            t.FinishedAt.HasValue &&
            t.FinishedAt.Value <= t.Deadline.Value);

        var totalNonCancelledTasks = allTasks.Count(t => t.Status != Domain.Enums.TaskStatus.Cancelled);
        var completionRatePercentage = totalNonCancelledTasks > 0 
            ? (int)Math.Round((double)tasksCompleted / totalNonCancelledTasks * 100)
            : 0;

        return new ResponseDashboardMetrics(
            TasksPending: tasksPending,
            TasksInProgress: tasksInProgress,
            TasksCompleted: tasksCompleted,
            TasksCancelled: tasksCancelled,
            TasksOverdue: tasksOverdue,
            TasksCompletedOnTime: tasksCompletedOnTime,
            CompletionRatePercentage: completionRatePercentage
        );
    }
}
