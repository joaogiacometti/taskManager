using Domain.Repositories;
using Domain.Repositories.Projects;
using Infra.DataAccess;
using Infra.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infra;

public static class DependencyInjection
{
    public static void AddInfra(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options => { options.UseNpgsql(connectionString); });
        
        services.AddRepositories();
    }

    public static void MigrateDatabase(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();
    }

    private static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IProjectReadOnlyRepository, ProjectRepository>();
        services.AddScoped<IProjectWriteOnlyRepository, ProjectRepository>();
        
        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }
}