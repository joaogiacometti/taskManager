using Domain.Entities;
using Domain.Repositories.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Infra.DataAccess.Repositories;

internal class TaskRepository(ApplicationDbContext dbContext) : ITaskReadOnlyRepository, ITaskWriteOnlyRepository
{
    public async Task Add(AppTask entity)
    {
        await dbContext.AddAsync(entity);
    }

    async Task<AppTask?> ITaskReadOnlyRepository.GetById(int id)
    {
        return await dbContext.Tasks
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    async Task<AppTask?> ITaskWriteOnlyRepository.GetById(int id)
    {
        return await dbContext.Tasks
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<AppTask>> GetAll()
    {
        return await dbContext.Tasks
            .AsNoTracking()
            .ToListAsync();
    }

    public void Delete(AppTask entity)
    {
        dbContext.Tasks.Remove(entity);
    }
}