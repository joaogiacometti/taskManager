using Application.UseCases.Projects.Create;
using Application.UseCases.Projects.Delete;
using Application.UseCases.Projects.Get;
using Application.UseCases.Projects.GetAll;
using Application.UseCases.Projects.Update;
using Microsoft.Extensions.DependencyInjection;
using Application.UseCases.Tasks.Create;
using Application.UseCases.Tasks.Get;
using Application.UseCases.Tasks.GetAll;
using Application.UseCases.Tasks.Update;
using Application.UseCases.Tasks.UpdateStatus;
using Application.UseCases.Tasks.Delete;

namespace Application;

public static class DependencyInjection
{
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ICreateProjectUseCase, CreateProjectUseCase>();
        services.AddScoped<IGetProjectUseCase, GetProjectUseCase>();
        services.AddScoped<IGetProjectsUseCase, GetProjectsUseCase>();
        services.AddScoped<IUpdateProjectUseCase, UpdateProjectUseCase>();
        services.AddScoped<IDeleteProjectUseCase, DeleteProjectUseCase>();

        services.AddScoped<ICreateTaskUseCase, CreateTaskUseCase>();
        services.AddScoped<IGetTaskUseCase, GetTaskUseCase>();
        services.AddScoped<IGetTasksUseCase, GetTasksUseCase>();
        services.AddScoped<IUpdateTaskUseCase, UpdateTaskUseCase>();
        services.AddScoped<IUpdateTaskStatusUseCase, UpdateTaskStatusUseCase>();
        services.AddScoped<IDeleteTaskUseCase, DeleteTaskUseCase>();
    }
}
