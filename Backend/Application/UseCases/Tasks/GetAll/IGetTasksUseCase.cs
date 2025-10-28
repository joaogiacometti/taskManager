using Communication.Responses;

namespace Application.UseCases.Tasks.GetAll;

public interface IGetTasksUseCase
{
    Task<List<ResponseTask>> Execute();
}