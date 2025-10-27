using Domain.Entities;

namespace Domain.Repositories.Projects;

public interface IProjectReadOnlyRepository
{
    Task<Project?> GetById(int id);
    Task<List<Project>> GetAll();
}