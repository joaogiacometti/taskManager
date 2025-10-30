using Domain.Entities;

namespace Domain.Repositories.Tasks;

public interface ITaskReadOnlyRepository
{
    Task<AppTask?> GetById(int id);
    Task<List<AppTask>> GetAll(
        int? projectId = null,
        Enums.TaskStatus? status = null,
        string? responsibleUserId = null,
        DateTime? deadlineBefore = null
    );
}