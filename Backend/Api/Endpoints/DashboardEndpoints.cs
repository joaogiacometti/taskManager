using Application.UseCases.Dashboards.Metrics;
using Communication.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Endpoints;

public static class DashboardEndpoints
{
    public static void AddDashboardEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/dashboard")
            .WithTags("Dashboard")
            .RequireAuthorization();

        group.MapGet("/metricas", async ([FromServices] IDashboardMetricsUseCase useCase) =>
        {
            var result = await useCase.Execute();
            return Results.Ok(result);
        })
        .Produces<ResponseDashboardMetrics>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);
    }
}
