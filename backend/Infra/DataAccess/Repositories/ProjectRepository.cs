using Domain.Entities;
using Domain.Repositories.Projects;
using Microsoft.EntityFrameworkCore;

namespace Infra.DataAccess.Repositories;

internal class ProjectRepository(ApplicationDbContext dbContext) : IProjectReadOnlyRepository, IProjectWriteOnlyRepository
{
    public async Task Add(Project entity)
    {
        await dbContext.AddAsync(entity);
    }

    async Task<Project?> IProjectReadOnlyRepository.GetById(int id)
    {
        return await dbContext.Projects
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    async Task<Project?> IProjectWriteOnlyRepository.GetById(int id)
    {
        return await dbContext.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Project>> GetAll()
    {
        return await dbContext.Projects
            .AsNoTracking()
            .ToListAsync();
    }
    
    public void Delete(Project entity)
    {
        dbContext.Projects.Remove(entity);
    }
}