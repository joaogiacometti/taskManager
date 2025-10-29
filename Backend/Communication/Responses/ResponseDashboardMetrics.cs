namespace Communication.Responses;

public record class ResponseDashboardMetrics(
    int TasksPending,
    int TasksInProgress,
    int TasksCompleted,
    int TasksCancelled,
    int TasksOverdue,
    int TasksCompletedOnTime,
    int CompletionRatePercentage
);
