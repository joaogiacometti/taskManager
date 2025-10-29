using Application.UseCases.Projects.Create;
using Application.UseCases.Projects.Delete;
using Application.UseCases.Projects.Get;
using Application.UseCases.Projects.GetAll;
using Application.UseCases.Projects.Update;
using Communication.Requests;
using Communication.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Api.Endpoints;

public static class ProjectEndpoints
{
    public static void AddProjectEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/projetos")
            .WithTags("Projects")
            .RequireAuthorization();

        group.MapPost("", async ([FromServices] ICreateProjectUseCase useCase, [FromBody] RequestProject request) =>
        {
            var result = await useCase.Execute(request);

            var uri = $"/api/projetos/{result.Id}";

            return Results.Created(uri, result);
        })
        .Produces<ResponseProject>(StatusCodes.Status201Created)
        .Produces<ResponseError>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized);

        group.MapGet("", async ([FromServices] IGetProjectsUseCase useCase) =>
        {
            var result = await useCase.Execute();

            return result.Count == 0 ? Results.NoContent() : Results.Ok(result);
        })
        .Produces<List<ResponseProject>>()
        .Produces<NoContentResult>(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized);
        
        group.MapGet("/{id:int}", async (
                [FromServices] IGetProjectUseCase useCase,
                [FromRoute] int id) =>
        {
            var result = await useCase.Execute(id);

            return result is null ? Results.NotFound() : Results.Ok(result);
        })
        .Produces<ResponseProject>()
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);
        
        group.MapPut("/{id:int}", async ([FromServices] IUpdateProjectUseCase useCase, [FromBody] RequestProject request,
            [FromRoute] int id) =>
        {
            await useCase.Execute(id, request);

            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ResponseError>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ResponseError>(StatusCodes.Status404NotFound);
        
        group.MapDelete("/{id:int}", async ([FromServices] IDeleteProjectUseCase useCase, [FromRoute] int id) =>
        {
            await useCase.Execute(id);

            return Results.NoContent();
        })
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces<ResponseError>(StatusCodes.Status404NotFound);
    }
}