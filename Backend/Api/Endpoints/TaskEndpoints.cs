using Application.UseCases.Tasks.Create;
using Application.UseCases.Tasks.Delete;
using Application.UseCases.Tasks.Get;
using Application.UseCases.Tasks.GetAll;
using Application.UseCases.Tasks.Update;
using Application.UseCases.Tasks.UpdateStatus;
using Communication.Requests;
using Communication.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Endpoints;

public static class TaskEndpoints
{
    public static void AddTaskEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/tarefas")
            .WithTags("Tasks")
            .RequireAuthorization();

        group.MapPost("", async ([FromServices] ICreateTaskUseCase useCase, [FromBody] RequestCreateTask request) =>
        {
            var result = await useCase.Execute(request);

            var uri = $"/api/tarefas/{result.Id}";

            return Results.Created(uri, result);
        })
        .Produces<ResponseTask>(StatusCodes.Status201Created)
        .Produces<ResponseError>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ResponseError>(StatusCodes.Status404NotFound);

        group.MapGet("", async ([FromServices] IGetTasksUseCase useCase) =>
        {
            var result = await useCase.Execute();
            return result.Count == 0 ? Results.NoContent() : Results.Ok(result);
        })
        .Produces<List<ResponseTask>>()
        .Produces<NoContentResult>(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized);

        group.MapGet("/{id:int}", async ([FromServices] IGetTaskUseCase useCase, [FromRoute] int id) =>
        {
            var result = await useCase.Execute(id);
            return result is null ? Results.NotFound() : Results.Ok(result);
        })
        .Produces<ResponseTask>()
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);

        group.MapPut("/{id:int}", async (
            [FromServices] IUpdateTaskUseCase useCase,
            [FromBody] RequestUpdateTask request,
            [FromRoute] int id) =>
        {
            await useCase.Execute(id, request);
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ResponseError>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ResponseError>(StatusCodes.Status404NotFound);

        group.MapPatch("/{id:int}/status", async (
            [FromServices] IUpdateTaskStatusUseCase useCase,
            [FromBody] RequestUpdateTaskStatus request,
            [FromRoute] int id) =>
        {
            await useCase.Execute(id, request);
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ResponseError>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ResponseError>(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:int}", async ([FromServices] IDeleteTaskUseCase useCase, [FromRoute] int id) =>
        {
            await useCase.Execute(id);
            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ResponseError>(StatusCodes.Status404NotFound);
    }
}