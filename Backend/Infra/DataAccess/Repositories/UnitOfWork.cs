using Domain.Repositories;

namespace Infra.DataAccess.Repositories;

public class UnitOfWork(ApplicationDbContext dbContext) : IUnitOfWork
{
    public async Task Commit()
    {
        await dbContext.SaveChangesAsync();
    }
}