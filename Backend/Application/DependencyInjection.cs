using Application.UseCases.Projects.Create;
using Application.UseCases.Projects.Delete;
using Application.UseCases.Projects.Get;
using Application.UseCases.Projects.GetAll;
using Application.UseCases.Projects.Update;
using Microsoft.Extensions.DependencyInjection;

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
    }
}
