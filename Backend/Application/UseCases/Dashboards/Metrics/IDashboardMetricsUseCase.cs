using Communication.Responses;

namespace Application.UseCases.Dashboards.Metrics;

public interface IDashboardMetricsUseCase
{
    Task<ResponseDashboardMetrics> Execute();
}
