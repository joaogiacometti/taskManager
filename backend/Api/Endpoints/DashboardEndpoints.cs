using Application.UseCases.Dashboards.Metrics;
using Communication.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Api.Endpoints;

public static class DashboardEndpoints
{
    public static void AddDashboardEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/dashboard")
            .WithTags("Dashboard")
            .RequireAuthorization();

        group.MapGet("/metricas", async ([FromServices] IDashboardMetricsUseCase useCase, [FromServices] ILogger logger) =>
        {
            var result = await useCase.Execute();

            logger.LogInformation("Returned dashboard metrics");
            return Results.Ok(result);
        })
        .Produces<ResponseDashboardMetrics>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);
    }
}
