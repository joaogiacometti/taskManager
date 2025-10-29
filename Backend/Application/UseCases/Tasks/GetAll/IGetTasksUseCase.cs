using Communication.Responses;

namespace Application.UseCases.Tasks.GetAll;

public interface IGetTasksUseCase
{
    Task<List<ResponseTask>> Execute(
        int? projectId = null,
        Communication.Enums.TaskStatus? status = null,
        string? responsibleUserId = null,
        DateTime? deadlineBefore = null
    );
}