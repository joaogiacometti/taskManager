using Domain.Entities;

namespace Domain.Repositories.Projects;

public interface IProjectWriteOnlyRepository
{
    Task Add(Project entity);
    Task<Project?> GetById(int id);
    void Delete(Project entity);
}