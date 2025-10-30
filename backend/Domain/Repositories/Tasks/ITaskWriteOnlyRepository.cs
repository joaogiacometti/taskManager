using Domain.Entities;

namespace Domain.Repositories.Tasks;

public interface ITaskWriteOnlyRepository
{
    Task Add(AppTask entity);
    Task<AppTask?> GetById(int id);
    void Delete(AppTask entity);
}