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

    public async Task<List<AppTask>> GetAll(
        int? projectId = null,
        Domain.Enums.TaskStatus? status = null,
        string? responsibleUserId = null,
        DateTime? deadlineBefore = null)
    {
        var query = dbContext.Tasks
            .AsNoTracking()
            .AsQueryable();

        if (projectId.HasValue)
            query = query.Where(t => t.ProjectId == projectId.Value);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(responsibleUserId))
            query = query.Where(t => t.ResponsibleUserId == responsibleUserId);

        if (deadlineBefore.HasValue)
            query = query.Where(t => t.Deadline.HasValue && t.Deadline.Value.Date <= deadlineBefore.Value.Date);

        return await query.ToListAsync();
    }

    public void Delete(AppTask entity)
    {
        dbContext.Tasks.Remove(entity);
    }
}