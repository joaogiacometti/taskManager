using Domain.Entities;

namespace Domain.Repositories.Tasks;

public interface ITaskReadOnlyRepository
{
    Task<AppTask?> GetById(int id);
    Task<List<AppTask>> GetAll();
}