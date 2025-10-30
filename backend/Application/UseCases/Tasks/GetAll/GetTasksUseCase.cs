using Application.Mappings;
using Communication.Responses;
using Domain.Repositories.Tasks;

namespace Application.UseCases.Tasks.GetAll;

public class GetTasksUseCase(ITaskReadOnlyRepository taskReadOnlyRepository) : IGetTasksUseCase
{
    public async Task<List<ResponseTask>> Execute(
        int? projectId = null,
        Communication.Enums.TaskStatus? status = null,
        string? responsibleUserId = null,
        DateTime? deadlineBefore = null)
    {
        var entities = await taskReadOnlyRepository.GetAll(projectId, (Domain.Enums.TaskStatus?)status, responsibleUserId, deadlineBefore);

        return entities.ToResponse();
    }
}